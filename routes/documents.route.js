import multer from "multer";
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getalldocuments,
  uploaddocument,
  editdocument,
  deletedocument,
  getdocumentsbysem,
  searchdocuments,
} from "../controller/documents.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.use(protectRoute);

router.get("/alldocuments", getalldocuments);
router.post("/upload", upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), uploaddocument);
router.patch("/edit/:id", upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), editdocument);
router.delete("/delete/:id", deletedocument);
router.get("/search", searchdocuments);
router.get("/:sem", getdocumentsbysem);

export default router;
