const { Client, ChatInputCommandInteraction } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const { SlashCommand } = require("discord-commands-params")

module.exports = new SlashCommand({
    name: "close",
    description: "supprimer une demande de boutique",
    category: "Shop",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: ":x: | Tu n'a pas la permissions", ephemeral: true})
        if(interaction.channel.name.includes("boutique")) {
            await interaction.channel.delete()
        } else {
            interaction.reply({content: ":x: | Ce n'est pas un channel boutique", ephemeral: true})
        }
    }
})