const express = require("express");
const router = express.Router();

const {
    getProjectDetails, createProject ,updateProject ,addEmployeeToProject ,addSprintToProject
} = require("../controllers/Project.controller");

router.post("/", createProject);
router.get("/:id", getProjectDetails);
router.put("/:id", updateProject);
router.put("/addemp/:id", addEmployeeToProject);
router.put("/addsprint/:id", addSprintToProject);



module.exports = router;