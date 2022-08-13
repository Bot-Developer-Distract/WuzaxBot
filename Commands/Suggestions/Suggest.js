const { ActionRowBuilder, ModalBuilder, ChatInputCommandInteraction, EmbedBuilder, TextInputBuilder } = require("discord.js");
require("../../Modals/Suggestions/Suggest");
const { SlashCommand } = require("discord-commands-params")

module.exports = new SlashCommand({
  name: "suggest",
  description: "Créez une suggestion de manière organisée !",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
   async execute({client, interaction}) {
    try {
      const InputField = new TextInputBuilder().setCustomId("Suggestion_Modal").setLabel("Suggestion").setPlaceholder("Décrivez ici ce que vous souhaitez suggérer").setMinLength(1).setMaxLength(1000).setRequired(true).setStyle(2);
  
      const SuggestModalTextModalInputRow = new ActionRowBuilder().addComponents(InputField);
  
      const modal = new ModalBuilder().setCustomId("SuggestModal").setTitle("Système de suggestions").addComponents(SuggestModalTextModalInputRow);
  
      await interaction.showModal(modal);
    } catch (e) {
      console.log(e);
      const Embed = new EmbedBuilder().setColor(`#f8312f`).setDescription(`⛔ | Une erreur s'est produite, réessayez`);
    
      return interaction.reply({ embeds: [Embed], ephemeral: true });
    }
  },
})