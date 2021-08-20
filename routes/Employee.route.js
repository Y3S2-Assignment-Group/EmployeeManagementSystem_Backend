const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getEmployeeDetails,
  loginEmployee,
  registerEmployee,
  updateEmployeeProfile,
  deleteEmployee
} = require("../controllers/Employee.controller");


router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.get("/", auth, getEmployeeDetails);
router.put("/updateprofile/:id", auth, updateEmployeeProfile);
router.delete("/:id", auth, deleteEmployee);


module.exports = router;
