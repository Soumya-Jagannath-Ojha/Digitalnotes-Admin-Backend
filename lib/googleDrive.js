import { google } from "googleapis";
import { Readable } from "stream";
import environment from "../SecureCode.js";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const credentials = {
  type: environment.google.type,
  project_id: environment.google.project_id,
  private_key_id: environment.google.private_key_id,
  private_key: environment.google.private_key,
  client_email: environment.google.client_email,
  client_id: environment.google.client_id,
  auth_uri: environment.google.auth_uri,
  token_uri: environment.google.token_uri,
  auth_provider_x509_cert_url: environment.google.auth_provider_x509_cert_url,
  client_x509_cert_url: environment.google.client_x509_cert_url,
  universe_domain: environment.google.universe_domain,
};

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

export const uploadToDrive = async (file) => {
  const fileMetadata = {
    name: file.originalname,
    mimeType: "application/pdf",
    parents: [environment.FOLDER_ID],
  };

  // Convert buffer to readable stream
  const bufferStream = new Readable();
  bufferStream.push(file.buffer);
  bufferStream.push(null);

  const media = {
    mimeType: "application/pdf",
    body: bufferStream,
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id, webViewLink",
  });
  // Set public read permission
  drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return {
    fileId: response.data.id,
    webViewLink: response.data.webViewLink,
  };
};

export const deleteFromDrive = async (fileId) => {
  await drive.files.delete({
    fileId: fileId,
  });
};

// const testUploadAndDelete = async () => {
//   // Read the PDF file from lib folder
//   const pdfPath = path.join(process.cwd(), 'Backend', 'lib', 'test.pdf');
//   const fileBuffer = fs.readFileSync(pdfPath);

//   // Test file
//   const testFile = {
//     originalname: "test.pdf",
//     buffer: fileBuffer,
//   };

//   // Test upload
//   // try {
//   //   const uploadResult = await uploadToDrive(testFile);
//   //   console.log("Upload successful:", uploadResult);
//   // } catch (error) {
//   //   console.error("Upload failed:", error);
//   // }

//   // Test delete
//   // try {
//   //   await deleteFromDrive(fileId);
//   //   console.log('Delete successful');
//   // } catch (error) {
//   //   console.error("Delete failed:", error);
//   // }
// };

// testUploadAndDelete();
