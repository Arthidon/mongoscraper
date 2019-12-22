// DEPENDENCIES
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var headlineSchema = new Schema({
    headline: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
    },
    summary: {
        type: String,
        required: true
    },
    date: Date,
    displayDate: String,
    tag: String,
    saved: {
        type: Boolean,
        default: false
    }
});

var Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;
//updated name