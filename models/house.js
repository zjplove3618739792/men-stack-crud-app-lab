const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  name: String,
  isReadyToBook: Boolean,
});

const House = mongoose.model("House", houseSchema); 



module.exports = House;


