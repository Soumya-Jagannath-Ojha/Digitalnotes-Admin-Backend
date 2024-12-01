import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import environment from "../SecureCode.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies["diginote-admin"];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    try {
      const decoded = jwt.verify(token, environment.JWT_SECRET);

      // Fetch admin from database using decoded email
      const admin = await Admin.findOne({ email: decoded.email });
      
      if (!admin) {
        return res.status(401).json({ message: "Unauthorized - Invalid User" });
      }

      // Set user info in request
      req.user = {
        email: admin.email,
        id: admin._id
      };

      next();
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token has expired. Please login again." });
      }
      throw jwtError;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};