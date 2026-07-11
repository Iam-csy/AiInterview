import express from "express";
import { startInterview, sendMessage, endInterview } from "../controllers/interviewController.js";

const router = express.Router();

router.post("/start", startInterview);
router.post("/message", sendMessage);
router.post("/end", endInterview);

export default router;
