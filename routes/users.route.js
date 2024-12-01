import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getusers, userdetails, blockuser, searchUsers } from "../controller/users.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/allusers", getusers);
router.get("/details/:id", userdetails);
router.patch("/:id/toggle-block", blockuser);

router.get("/search", searchUsers);

export default router;