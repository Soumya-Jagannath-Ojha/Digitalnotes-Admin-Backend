import Review from "../models/review.model.js";
import Document from "../models/document.model.js";
import Users from "../models/users.model.js";

export const getallreviews = async (req, res) => {
  try {
      const reviews = await Review.find({})
          .populate('user', 'name')
          .populate('Document', 'name');
      res.status(200).json(reviews);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getreviwshowhide = async (req, res) => {
  try {
      const review = await Review.findById(req.params.id);
      if (!review) {
          return res.status(404).json({ message: "Review not found" });
      }
      review.isVisible = !review.isVisible;
      await review.save();
      res.status(200).json(review);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const deletereview = async (req, res) => {
  try {
      const review = await Review.findById(req.params.id);
      if (!review) {
          return res.status(404).json({ message: "Review not found" });
      }

      // Remove references from document and user
      await Document.findByIdAndUpdate(review.Document, {
          $pull: { reviews: review._id }},
          { new: true }
        );
      await Users.findByIdAndUpdate(review.user, {
          $pull: { reviews: review._id }},
          { new: true }
        );

      await Review.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getfilterreview = async (req, res) => {
  try {
      const reviews = await Review.find({ rating: req.params.rating })
          .populate('user', 'name')
          .populate('Document', 'name');
      res.status(200).json(reviews);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};