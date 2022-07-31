const { Client, ChatInputCommandInteraction, ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "verify",
    description: "send a verify menu",
    category: "Verify",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        await client.emit("guildMemberAdd", interaction.member)
        await interaction.reply({content: "Test"})
    }
}