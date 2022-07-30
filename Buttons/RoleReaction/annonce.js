const { ActionRowBuilder, MessageButton, ModalBuilder, ButtonInteraction, Client, TextInputBuilder, TextInputStyle, EmbedBuilder, Embed } = require("discord.js");

module.exports = {
    id: "annonce",

    /**
     * @param { ButtonInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {
        if(interaction.member.roles.cache.some(role => role.id === "990564185291235359")) {
            await interaction.member.roles.remove("990564185291235359")
            await interaction.reply({content: "📌 | Tu avais déjà le rôle notification des Annonce, je te les donc enlever !", ephemeral: true})
            let logsC = interaction.guild.channels.cache.get("868564195350806602")
            logsC.send({embeds: [new EmbedBuilder().setAuthor({name: interaction.user.tag, iconURL:interaction.user.avatarURL()}).addFields({
                name: "📌 Role Annonce",
                value: `**${interaction.user.tag}** (${interaction.user.id}) vient de s'enlever le role annonce !`
            }).setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()}).setTimestamp().setColor("Red")]})
        } else {
            await interaction.member.roles.add("990564185291235359")
            await interaction.reply({content: "📌 | Tu viens d'obtenir le rôle notification des Annonce !", ephemeral: true})
            let logsC = interaction.guild.channels.cache.get("868564195350806602")
            logsC.send({embeds: [new EmbedBuilder().setAuthor({name: interaction.user.tag, iconURL:interaction.user.avatarURL()}).addFields({
                name: "📌 Role Annonce",
                value: `**${interaction.user.tag}** (${interaction.user.id}) vient de s'ajouter le role annonce !`
            }).setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()}).setTimestamp().setColor("Green")]})
        }
    }
}