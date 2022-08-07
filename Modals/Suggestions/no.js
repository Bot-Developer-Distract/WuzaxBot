const {ModalSubmitInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")

module.exports = {
    id: "suggest-no-modal",

    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const input = interaction.fields.getTextInputValue("suggest-no-modal-input")

        interaction.reply({content: ":white_check_mark: | La raison du refus a bien été enregistrer.", ephemeral: true })

        interaction.message.edit({
            embeds: [EmbedBuilder.from(interaction.message.embeds[0]).setFields([
                { name: interaction.message.embeds[0].fields[0].name, value: interaction.message.embeds[0].fields[0].value },
                { name: interaction.message.embeds[0].fields[1].name, value: interaction.message.embeds[0].fields[1].value },
                { name: "Raison", value: input }
            ]).setColor("Red").setTitle("Wuzax Community - Suggestions Refusé")],
            components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId("suggest-yes-disabled")
                .setLabel("Oui")
                .setStyle(ButtonStyle.Success)
                .setDisabled(true),
                new ButtonBuilder()
                .setCustomId("suggest-no-disabled")
                .setLabel("Non")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
            )]
        })
    }
}