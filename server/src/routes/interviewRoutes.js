import express from "express";
import multer from "multer";
import { startInterview, sendMessage, endInterview } from "../controllers/interviewController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/start", authMiddleware, upload.single("resumeFile"), startInterview);
router.post("/message", authMiddleware, sendMessage);
router.post("/end", authMiddleware, endInterview);

export default router;
