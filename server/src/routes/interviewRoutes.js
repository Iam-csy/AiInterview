const express = require("express");
const router = express.Router();
const {
  startInterview,
  sendMessage,
  endInterview,
} = require("../controllers/interviewController");

router.post("/start", startInterview);
router.post("/message", sendMessage);
router.post("/end", endInterview);

module.exports = router;
