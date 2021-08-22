const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    getProjectManagerDetails, loginProjectManager, registerProjectManager,updateProjectManagerProfile,getAllProjectManagerList,deleteProjectManager
} = require("../controllers/ProjectManager.controller");

router.get("/all",getAllProjectManagerList)
router.post("/register", registerProjectManager);
router.post("/login", loginProjectManager);
router.get("/", auth, getProjectManagerDetails);
router.delete("/:id", deleteProjectManager);
router.put("/updateprofile/:id", updateProjectManagerProfile);

module.exports = router;
