const { ActionRowBuilder, MessageButton, ModalBuilder, ButtonInteraction, Client, TextInputBuilder, TextInputStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    id: "verify",

    /**
     * @param { ButtonInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {
        if(interaction.member.roles.cache.some(role => role.id === "868564194235142147")) {
            await interaction.reply({content: ":x: | Tu es deja vérifier !", ephemeral: true})
            return;
        } else {
            await interaction.member.roles.add("868564194235142147")
            await interaction.reply({content: ":white_check_mark: | Tu es désormais verifier !", ephemeral: true})
            let logsC = interaction.guild.channels.cache.get("868564195350806602")
            logsC.send({embeds: [new EmbedBuilder().setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()}).addFields({
                name: "✅ Verification",
                value: `**${interaction.user.tag}** (${interaction.user.id}) vient de passer la vérification !`
            }).setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()}).setTimestamp().setColor("Green")]})
        }
    }
}
