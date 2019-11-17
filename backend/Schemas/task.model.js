const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Task = new Schema({
    taskDescription: { type: String },
    taskResponsible: { type: String },
    taskPriority: { type: String },
    taskComplete: { type: Boolean }
});

module.exports = mongoose.model("Task", Task); // Allows importing in server