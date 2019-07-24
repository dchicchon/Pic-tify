const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        required: false
    },
    savedImage: [{
        type: Schema.Types.ObjectId,
        ref: "Image"
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;