const { model, Schema } = require("mongoose");

module.exports = model(
  "Suggestions",
  new Schema({
    GuildID: String,
    MessageID: String,
    Details: Array,
  })
);