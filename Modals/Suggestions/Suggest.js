const { EmbedBuilder } = require("discord.js");
const DB1 = require("../../Schemas/SuggestDB");
const DB2 = require("../../Schemas/SuggestSetupDB");
  
module.exports = {
  id: "SuggestModal",
async execute(interaction, client) {
  const { member, user, guild } = interaction;
    
  const input = interaction.fields.getTextInputValue("Suggestion_Modal");

  const Data = await DB2.findOne({ GuildID: interaction.guild.id });

  if (!Data) { return interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#f8312f`).setDescription(`⛔ | This server has not setup the suggestion system`) ], ephemeral: true }) }

  const ID = new Array(8).join().replace(/(.|$)/g, function () { return ((Math.random() * 36) | 0).toString(36) [Math.random() < 0.5 ? "toString" : "toUpperCase"](); });

  await guild.channels.cache.get(Data.SuggestChannel).send({ embeds: [ new EmbedBuilder().setColor(`#5865f2`).setAuthor({ name: `${user.tag}`, iconURL: user.avatarURL({ dynamic: true }) }).addFields({ name: "Suggestion:", value: `${input}`, inline: false }, { name: "User ID", value: `\`${user.id}\``, inline: true }, { name: "Status", value: "`☐ Pending`", inline: true }, { name: "ID", value: `\`${ID}\``, inline: true }) ] }).then(async (Message) => { Message.react(`👍🏻`); Message.react(`👎🏻`);

  await DB1.create({ GuildID: interaction.guild.id, MessageID: Message.id, Details: [ { MemberID: member.id, SuggestionID: ID, SuggestionMessage: input } ] }).catch((err) => console.log(err));

  await interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#00d26a`).setDescription(`✅ | Your [suggestion](${Message.url}) was successfully sent`) ], ephemeral: true });

  await user.send({ embeds: [ new EmbedBuilder().setColor(`#5865f2`).setDescription(`Hi ${user.tag}, your [suggestion](${Message.url}) was sent in (**${guild.name}**)!`).setFields({ name: "Your suggestion:", value: `\`\`\`${input}\`\`\`` }).setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) ] }).catch((err) => { console.log(err); }) });
  }
};