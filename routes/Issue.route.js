const express = require("express");
const router = express.Router();

const {
    deleteIssue,editIssue
} = require("../controllers/Issue.controller");


router.delete("/:id", deleteIssue);
router.put("/:id", editIssue);


module.exports = router;
