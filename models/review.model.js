import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  isVisible: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  Document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
