var mongoose = require('mongoose');
var catSchema = new mongoose.Schema({
    name: String,
    image: String,
    modal: String
});
var Category = mongoose.model('categories', catSchema);
module.exports = Category;