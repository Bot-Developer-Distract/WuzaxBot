const { model, Schema } = require("mongoose");

module.exports = model(
  "SuggestSetup",
  new Schema({
    GuildID: String,
    SuggestChannel: String,
  })
);