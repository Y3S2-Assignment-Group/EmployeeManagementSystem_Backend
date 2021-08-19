const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Feedback = new Schema({
    feedback: {
        type: String,
    }
});

module.exports = Admin = mongoose.model("Feedback", Feedback);
