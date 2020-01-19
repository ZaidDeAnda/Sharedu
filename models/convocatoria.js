var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isCommunity: Boolean,
    airtableID: {type: String, default:""}
});

module.exports = mongoose.model("User", userSchema);
