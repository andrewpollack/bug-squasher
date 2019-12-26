const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
    userFirstName: { type: String },
    userLastName: { type: String },
    userUsername: { type: String },
    userDigest: { type: String },
    userSalt: { type: Number },
    userTeams: [mongoose.Schema.Types.ObjectId],
    userAdmins: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model("User", User); // Allows importing in server