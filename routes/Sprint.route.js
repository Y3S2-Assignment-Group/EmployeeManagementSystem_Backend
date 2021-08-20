const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    addIssueToSprint , addFeedbackSprint,changeIssueStatusTodoToInProgress,changeIssueStatusInProgressToDone
} = require("../controllers/Sprint.controller");


router.put("/createissue/:id",addIssueToSprint);
router.put("/:id/inprogress",changeIssueStatusTodoToInProgress);
router.put("/:id/done",changeIssueStatusInProgressToDone);
router.put("/addFeedback/:id",addFeedbackSprint);

module.exports = router;
