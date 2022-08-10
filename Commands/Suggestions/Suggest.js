const { ActionRowBuilder, ModalBuilder, ChatInputCommandInteraction, EmbedBuilder, TextInputBuilder } = require("discord.js");
require("../../Modals/Suggestions/Suggest");

module.exports = {
  name: "suggest",
  description: "Create a suggestion in an organized matter!",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      const InputField = new TextInputBuilder().setCustomId("Suggestion_Modal").setLabel("Suggestion").setPlaceholder("Describe what you would like to suggest here").setMinLength(1).setMaxLength(1000).setRequired(true).setStyle(2);
  
      const SuggestModalTextModalInputRow = new ActionRowBuilder().addComponents(InputField);
  
      const modal = new ModalBuilder().setCustomId("SuggestModal").setTitle("Suggestion System").addComponents(SuggestModalTextModalInputRow);
  
      await interaction.showModal(modal);
    } catch (e) {
      console.log(e);
      const Embed = new EmbedBuilder().setColor(`#f8312f`).setDescription(`⛔ | An error occurred, try again`);
    
      return interaction.reply({ embeds: [Embed], ephemeral: true });
    }
  },
};