const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    salary: {
        type: Number,
    },
    projectsList: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project"
        }
    ],
    attendanceList: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Attendance"
        }
    ],
    department: {
        type: String,
    },
    rate: {
        type: Number,
    },
    commentList: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
        }
    ],
});

module.exports = Admin = mongoose.model("Employee", EmployeeSchema);