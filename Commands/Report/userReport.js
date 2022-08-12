const { Client, ChatInputCommandInteraction, ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ApplicationCommandType, ContextMenuCommandInteraction, CommandInteraction } = require("discord.js")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "report",
    type: ApplicationCommandType.User,
    category: "Report",

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
    }
}