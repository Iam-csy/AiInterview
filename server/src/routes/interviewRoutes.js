import express from "express";
import multer from "multer";
import { startInterview, sendMessage, endInterview } from "../controllers/interviewController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/start", upload.single("resumeFile"), startInterview);
router.post("/message", sendMessage);
router.post("/end", endInterview);

export default router;
