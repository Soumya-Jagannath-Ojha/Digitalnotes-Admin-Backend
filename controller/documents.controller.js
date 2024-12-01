import Document from "../models/document.model.js";
import Users from "../models/users.model.js";
import Review from "../models/review.model.js";
import { uploadToDrive, deleteFromDrive } from "../lib/googleDrive.js";
import cloudinary from "../lib/cloudinary.js";

export const getalldocuments = async (req, res) => {
  try {
    const documents = await Document.find({}).sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploaddocument = async (req, res) => {
  try {
    const { name, semester, branch } = req.body;
    
    if (!req.files?.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    const pdfFile = req.files.file[0];
    
    // Upload to Google Drive
    const { fileId, webViewLink } = await uploadToDrive(pdfFile);
    
    // Handle image upload if present
    let imageUrl = '';
    if (req.files?.image) {
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${req.files.image[0].buffer.toString('base64')}`,
        {
          folder: 'documents',
          resource_type: 'auto'
        }
      );
      imageUrl = result.secure_url;
    }

    const newDocument = new Document({
      name,
      branch,
      semester,
      size: `${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB`,
      image: imageUrl,
      driveFileId: fileId,
      driveViewLink: webViewLink
    });

    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getdocumentsbysem = async (req, res) => {
  try {
    const semester = req.params.sem;
    const documents = await Document.find({ semester });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchdocuments = async (req, res) => {
  try {
    const query = req.query.q;
    const documents = await Document.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { semester: { $regex: query, $options: "i" } },
        { branch: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editdocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const { name, semester, branch } = req.body;
    const document = await Document.findById(documentId);
    
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Initialize updateData with existing document values
    let updateData = {
      name: name || document.name,
      semester: semester || document.semester,
      branch: branch || document.branch,
      driveFileId: document.driveFileId,
      driveViewLink: document.driveViewLink,
      size: document.size
    };

    // Update file only if new file is uploaded
    if (req.files?.file?.[0]) {
      await deleteFromDrive(document.driveFileId);
      const { fileId, webViewLink } = await uploadToDrive(req.files.file[0]);
      updateData.driveFileId = fileId;
      updateData.driveViewLink = webViewLink;
      updateData.size = `${(req.files.file[0].size / (1024 * 1024)).toFixed(2)} MB`;
    }

    // Update image only if new image is uploaded
    if (req.files?.image?.[0]) {
      if (document.image) {
        const publicId = document.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${req.files.image[0].buffer.toString('base64')}`,
        {
          folder: "documents",
        }
      );
      updateData.image = result.secure_url;
    }

    const updatedDocument = await Document.findByIdAndUpdate(
      documentId,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deletedocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Delete from Google Drive
    await deleteFromDrive(document.driveFileId);

    // Delete image from Cloudinary if exists
    if (document.image) {
      const publicId = document.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Handle reviews and user references
    const reviews = await Review.find({ Document: documentId });
    
    if (reviews.length > 0) {
      const reviewIds = reviews.map(review => review._id);
      await Users.updateMany(
        { reviews: { $in: reviewIds } },
        { $pull: { reviews: { $in: reviewIds } } }
      );
      await Review.deleteMany({ Document: documentId });
    }

    // Handle bookmarks cleanup
    await Users.updateMany(
      { bookmarks: documentId },
      { $pull: { bookmarks: documentId } }
    );

    await Document.findByIdAndDelete(documentId);
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
