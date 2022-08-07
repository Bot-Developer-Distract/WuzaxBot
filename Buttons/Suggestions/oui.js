const { ActionRowBuilder, MessageButton, ModalBuilder, ButtonInteraction, Client, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType, ButtonComponent } = require("discord.js");
module.exports = {
    id: "suggest-yes",

    /**
     * @param { ButtonInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {
        if(!interaction.member.permissions.has("Administrator")) return interaction.reply({content: ":x: | Vous n'avez pas la permissions pour accepter une suggestions !", ephemeral: true })
        const modal = new ModalBuilder()
        .setCustomId("suggest-yes-modal")
        .setTitle("Raison de l'acceptation de la suggestions.")
        .setComponents(
            new ActionRowBuilder().setComponents(
                new TextInputBuilder()
                .setCustomId("suggest-yes-modal-input")
                .setLabel("Raison de l'acceptation")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(1000)
            )
        )

        interaction.showModal(modal)
        
    }
}
