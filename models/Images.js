const mongoose = require("mongoose");

const ImagesSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    link: {
        type: String,
        require: true
    }
});

const Image = mongoose.model('Image', ImagesSchema);

module.exports = Image;