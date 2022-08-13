const { ChatInputCommandInteraction, EmbedBuilder, ChannelType } = require("discord.js");
const DB = require("../../Schemas/SuggestSetupDB");

module.exports = {
  name: "suggestion",
  description: "Setup or control the suggestions",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "setup",
      description: "Setup the suggestions system!",
      type: 1,
      options: [
        {
          name: "channel",
          description: "Select the channel the suggestions will be sent to",
          required: true,
          type: 7,
          channelTypes: [ChannelType.GuildText],
        },
      ],
    },
    {
      name: "accept-suggestion",
      description: "Accept a user's suggestion",
      type: 1,
      options: [
        {
          name: "message-id",
          type: 3,
          required: true,
          description: "Provide the message ID of the suggestion",
        },
        {
          name: "reason",
          type: 3,
          required: false,
          description: "Describe your reason in as much detail as possible.",
        },
      ],
    },
    {
      name: "decline-suggestion",
      description: "Decline a user's suggestion",
      type: 1,
      options: [
        {
          name: "message-id",
          type: 3,
          required: true,
          description: "Provide the message ID of the suggestion",
        },
        {
          name: "reason",
          type: 3,
          required: false,
          description: "Describe your reason in as much detail as possible.",
        },
      ],
    },
    {
      name: "reset",
      description: "Reset the suggestions channel",
      type: 1,
    },
  ],
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    try {
      const options = interaction.options;

      const { guild } = interaction;

      switch (options.getSubcommand()) {
        case "setup":
          {
          const SuggestChannel = options.getChannel("channel");

          await DB.findOneAndUpdate({ GuildID: guild.id }, { SuggestChannel: SuggestChannel.id }, { new: true, upsert: true }).catch((err) => console.log(err));

          const SuggestSetup = new EmbedBuilder().setDescription(`✅ | Successfully setup the suggestions system`).setColor(`#00d26a`);

          await guild.channels.cache.get(SuggestChannel.id).send({ embeds: [SuggestSetup] }).then((m) => { setTimeout(() => { m.delete().catch(() => {}); }, 3 * 1000); });

          await interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#00d26a`).setDescription(`✅ | Done`) ], ephemeral: true });
          }
          break;
        case "accept-suggestion":
          {
          const Data = await DB.findOne({ GuildID: guild.id });
        
          if (!Data) { return interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#f8312f`).setDescription(`⛔ | This server has not setup the suggestion system`) ] }) }
        
          const Reason = options.getString("reason") || "No comment";
          const SuggestID = options.getString("message-id");
        
          const SuggestionsChannel = interaction.guild.channels.cache.get(Data.SuggestChannel);
          const SuggestionMessage = await SuggestionsChannel.messages.fetch(SuggestID);
          const Embed = SuggestionMessage.embeds[0];
          const fild = Embed.fields[1]
        
          EmbedBuilder.from(Embed).setColor(`#00d26a`);
          Embed.fields[2] = { name: "Status", value: "\`☑ Accepted\`", inline: true };
          Embed.fields[4] = { name: `Comment from ${interaction.user.tag}`, value: Reason, inline: false };

          SuggestionMessage.edit({ embeds: [EmbedBuilder.from(Embed).setColor(`#00d26a`)] });
          SuggestionMessage.reactions.removeAll();
        
          return interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#00d26a`).setDescription(`✅ | You successfully accepted the suggestion.`) ], ephemeral: true });
          }
          break;
        case "decline-suggestion":
          {
          const Data = await DB.findOne({ GuildID: guild.id });
        
          if (!Data) { return interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#f8312f`).setDescription(`⛔ | This server has not setup the suggestion system`) ] }) }
        
          const Reason = options.getString("reason") || "No comment";
          const SuggestID = options.getString("message-id");
        
          const SuggestionsChannel = interaction.guild.channels.cache.get(Data.SuggestChannel);
          const SuggestionMessage = await SuggestionsChannel.messages.fetch(SuggestID);
        
          const Embed = SuggestionMessage.embeds[0];
        
          EmbedBuilder.from(Embed).setColor(`#f8312f`);
          Embed.fields[2] = { name: "Status", value: "\`☒ Declined\`", inline: true };
          Embed.fields[4] = { name: `Comment from ${interaction.user.tag}`, value: Reason, inline: false };
          console.log(Embed.color)

          SuggestionMessage.edit({ embeds: [Embed] });
          SuggestionMessage.reactions.removeAll();
        
          return interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#00d26a`).setDescription(`✅ | You successfully declined the suggestion.`) ], ephemeral: true });
          }
          break;
        case "reset":
          {
          DB.deleteMany({ GuildID: guild.id }, async (err, data) => {
          if (err) throw err;
          if (!data) return interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#f8312f`).setDescription(`⛔ | There is no data to delete`) ] });

          interaction.reply({ embeds: [ new EmbedBuilder().setDescription(`✅ | Successfully reset the suggestions channel`).setColor(`#00d26a`) ], ephemeral: true });
          });
          }
          return;
      }
    } catch (e) {
      console.log(e);
      const Embed = new EmbedBuilder().setColor(`#f8312f`).setDescription(`⛔ | An error occurred, try again`);
    
      return interaction.reply({ embeds: [Embed] }).then((m) => { setTimeout(() => { m.delete() }, 3 * 1000) }).catch(() => {});
    }
  },
};