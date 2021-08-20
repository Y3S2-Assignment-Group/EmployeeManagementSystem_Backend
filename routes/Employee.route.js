const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getEmployeeDetails,
  loginEmployee,
  registerEmployee,
} = require("../controllers/Employee.controller");


router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.get("/", auth, getEmployeeDetails);

module.exports = router;
