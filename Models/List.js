var mongoose = require('mongoose');
var ListSchema = new mongoose.Schema({
    name: String,
    category: String,
    items: [String],
    uses: Number
});
var listModel = mongoose.model('list', ListSchema);
module.exports = listModel;