import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  size: { type: String, required: true },
  image: { type: String, default: ""},
  driveFileId: { type: String, required: true },
  driveViewLink: { type: String, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
