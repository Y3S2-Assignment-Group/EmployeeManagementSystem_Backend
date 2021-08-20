const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getEmployeeDetails,
  loginEmployee,
  registerEmployee,
  updateEmployeeProfile,
  deleteEmployee,
  getAllEmployeesList
} = require("../controllers/Employee.controller");

router.get("/all",getAllEmployeesList);
router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.get("/", auth, getEmployeeDetails);
router.put("/updateprofile/:id", updateEmployeeProfile);
router.delete("/:id", deleteEmployee);

module.exports = router;
