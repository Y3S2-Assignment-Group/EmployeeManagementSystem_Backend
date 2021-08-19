const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendenceSchema = new Schema({
    inTime: {
        type: String,
    },
    outTime: {
        type: String,
    },
    date: {
        type: Date,
    }
});

module.exports = Admin = mongoose.model("Attendence", AttendenceSchema);
