const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: String,
  agenda: String,
  venue: String,
  location: String,
  chiefGuest: String,
  date: String,
  image: String,
  status: { type: String, default: "Invited" },
});

module.exports = mongoose.model('Event', eventSchema);
