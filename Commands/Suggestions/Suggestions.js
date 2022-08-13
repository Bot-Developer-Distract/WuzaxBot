const { ChatInputCommandInteraction, EmbedBuilder, ChannelType } = require("discord.js");
const DB = require("../../Schemas/SuggestSetupDB");
const { SlashCommand } = require("discord-commands-params")

module.exports = new SlashCommand({
  name: "suggestion",
  description: "Configurer ou contrôler les suggestions",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "setup",
      description: "Mettez en place le système de suggestions !",
      type: 1,
      options: [
        {
          name: "channel",
          description: "Sélectionnez le canal sur lequel les suggestions seront envoyées",
          required: true,
          type: 7,
          channelTypes: [ChannelType.GuildText],
        },
      ],
    },
    {
      name: "accept-suggestion",
      description: "Accepter la suggestion d'un utilisateur",
      type: 1,
      options: [
        {
          name: "message-id",
          type: 3,
          required: true,
          description: "Fournir l'ID du message de la suggestion",
        },
        {
          name: "reason",
          type: 3,
          required: false,
          description: "Décrivez votre raison de manière aussi détaillée que possible.",
        },
      ],
    },
    {
      name: "decline-suggestion",
      description: "Refuser la suggestion d'un utilisateur",
      type: 1,
      options: [
        {
          name: "message-id",
          type: 3,
          required: true,
          description: "Fournir l'ID du message de la suggestion",
        },
        {
          name: "reason",
          type: 3,
          required: false,
          description: "Décrivez votre raison de manière aussi détaillée que possible.",
        },
      ],
    },
    {
      name: "reset",
      description: "Réinitialiser le canal des suggestions",
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

          const SuggestSetup = new EmbedBuilder().setDescription(`✅ | Configurer avec succès le système de suggestions`).setColor(`#00d26a`);

          await guild.channels.cache.get(SuggestChannel.id).send({ embeds: [SuggestSetup] }).then((m) => { setTimeout(() => { m.delete().catch(() => {}); }, 3 * 1000); });

          await interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#00d26a`).setDescription(`✅ | Done`) ], ephemeral: true });
          }
          break;
        case "accept-suggestion":
          {
          const Data = await DB.findOne({ GuildID: guild.id });
        
          if (!Data) { return interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#f8312f`).setDescription(`⛔ | Ce serveur n'a pas configuré le système de suggestions`) ] }) }
        
          const Reason = options.getString("reason") || "Pas de commentaire";
          const SuggestID = options.getString("message-id");
        
          const SuggestionsChannel = interaction.guild.channels.cache.get(Data.SuggestChannel);
          const SuggestionMessage = await SuggestionsChannel.messages.fetch(SuggestID);
          const Embed = SuggestionMessage.embeds[0];
          const fild = Embed.fields[1]
        
          Embed.fields[2] = { name: "Statut", value: "\`☑ Accepté\`", inline: true };
          Embed.fields[4] = { name: `Commentaire de ${interaction.user.tag}`, value: Reason, inline: false };

          SuggestionMessage.edit({ embeds: [EmbedBuilder.from(Embed).setColor(`#00d26a`)] });
          SuggestionMessage.reactions.removeAll();
        
          return interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#00d26a`).setDescription(`✅ | Vous avez accepté la suggestion avec succès.`) ], ephemeral: true });
          }
          break;
        case "decline-suggestion":
          {
          const Data = await DB.findOne({ GuildID: guild.id });
        
          if (!Data) { return interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#f8312f`).setDescription(`⛔ | Ce serveur n'a pas configuré le système de suggestions`) ] }) }
        
          const Reason = options.getString("reason") || "Pas de commentaire";
          const SuggestID = options.getString("message-id");
        
          const SuggestionsChannel = interaction.guild.channels.cache.get(Data.SuggestChannel);
          const SuggestionMessage = await SuggestionsChannel.messages.fetch(SuggestID);
        
          const Embed = SuggestionMessage.embeds[0];
        
          Embed.fields[2] = { name: "Statut", value: "\`☒ Refusé\`", inline: true };
          Embed.fields[4] = { name: `Commentaire de ${interaction.user.tag}`, value: Reason, inline: false };

          SuggestionMessage.edit({ embeds: [EmbedBuilder.from(Embed).setColor(`#f8312f`)] });
          SuggestionMessage.reactions.removeAll();
        
          return interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#00d26a`).setDescription(`✅ | Vous avez refusé la suggestion avec succès.`) ], ephemeral: true });
          }
          break;
        case "reset":
          {
          DB.deleteMany({ GuildID: guild.id }, async (err, data) => {
          if (err) throw err;
          if (!data) return interaction.reply({ embeds: [ new EmbedBuilder().setColor(`#f8312f`).setDescription(`⛔ | Il n'y a pas de données à supprimer`) ] });

          interaction.reply({ embeds: [ new EmbedBuilder().setDescription(`✅ | Réinitialisation réussie du canal des suggestions`).setColor(`#00d26a`) ], ephemeral: true });
          });
          }
          return;
      }
    } catch (e) {
      console.log(e);
      const Embed = new EmbedBuilder().setColor(`#f8312f`).setDescription(`⛔ | Une erreur s'est produite, réessayez`);
    
      return interaction.reply({ embeds: [Embed] }).then((m) => { setTimeout(() => { m.delete() }, 3 * 1000) }).catch(() => {});
    }
  },
})