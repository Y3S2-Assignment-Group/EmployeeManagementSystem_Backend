const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    getProjectManagerDetails, loginProjectManager, registerProjectManager
} = require("../controllers/ProjectManager.controller");


router.post("/register", registerProjectManager);
router.post("/login", loginProjectManager);
router.get("/", auth, getProjectManagerDetails);

module.exports = router;
