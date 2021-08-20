const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Feedback = new Schema({
    feedback: {
        type: String,
    }
});

module.exports = Feedback = mongoose.model("Feedback", Feedback);
