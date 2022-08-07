const { ActionRowBuilder, MessageButton, ModalBuilder, ButtonInteraction, Client, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");
module.exports = {
    id: "suggest-no",

    /**
     * @param { ButtonInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {
        if(!interaction.member.permissions.has("Administrator")) return interaction.reply({content: ":x: | Vous n'avez pas la permission pour refuser une suggestion !", ephemeral: true })
        const modal = new ModalBuilder()
        .setCustomId("suggest-no-modal")
        .setTitle("Raison du refus de la suggestions.")
        .setComponents(
            new ActionRowBuilder().setComponents(
                new TextInputBuilder()
                .setCustomId("suggest-no-modal-input")
                .setLabel("Raison du refus")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(1000)
            )
        )

        interaction.showModal(modal)
    }
}
