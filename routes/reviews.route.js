import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getallreviews, getreviwshowhide, deletereview, getfilterreview } from "../controller/review.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/allreviews", getallreviews);
router.patch("/:id/toggleshowhide", getreviwshowhide);
router.delete("/delete/:id", deletereview);

router.get("/:rating", getfilterreview);

export default router;