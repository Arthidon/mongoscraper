// DEPENDENCIES
var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var NoteSchema = new Schema ({
    _headlineId: {
        type: Schema.Types.ObjectId,
        ref: "Headline"
    },
    noteText: String
});

module.exports = Note;