var mongoose = require('mongoose');
var ListsSchema = new mongoose.Schema({
    lists: [{
        name: String,
        category: String,
        items: [String],
        uses: Number
    }]
});
var Model = mongoose.model('lists', ListsSchema);
module.exports = Model;