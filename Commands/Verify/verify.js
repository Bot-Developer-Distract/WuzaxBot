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
        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: ":x: | Tu n'a pas la permissions", ephemeral: true})
        let button = new ButtonBuilder().setCustomId("verify").setLabel("Verifier").setStyle(ButtonStyle.Success).setEmoji("✅")
        let verifyButtons = new ActionRowBuilder()
            .addComponents([button])
        let embed = new EmbedBuilder()
        .setTitle(`😀 Bienvenue sur ${interaction.guild.name}`)
        .setDescription("Ce serveur est le serveur communautaire de Wuzax\n\nPour vous verifiez veuillez cliquer sur le boutton `✅ Verifier` !")
        .setFooter({text: "Wuzax | © 2022", iconURL: interaction.guild.iconURL()})
        interaction.reply({content: "Panel envoyé !", ephemeral: true})
        interaction.channel.send({embeds: [embed], components: [verifyButtons]})
    }
}