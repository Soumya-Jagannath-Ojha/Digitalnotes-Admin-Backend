import express from "express";
import { login, logout, verify, resetpasswordemail, emailcodeverify, resetpassword } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/send-resetcode", resetpasswordemail);
router.post("/codeverify", emailcodeverify);
router.patch("/resetpassword", resetpassword);
router.post("/logout", logout);


router.get("/verify", protectRoute, verify);

export default router;
