const { ActionRowBuilder, MessageButton, ModalBuilder, ButtonInteraction, Client, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    id: "shop.custom.panel",

    /**
     * @param { ButtonInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {
        await interaction.channel.bulkDelete(1)
        let embed = new EmbedBuilder()
        .setTitle("Wuzax | Boutique")
        .addFields([
            {
                name: "Author",
                value: `${interaction.user.tag} (${interaction.user.id})`
            },
            {
                name: "Commande",
                value: "Custom"
            }
        ])
        .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
        .setColor("White")
        await interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
        await interaction.reply({content: "Veuillez décrire un maximum le bot que vous souhaitez, en cas de problème ou de question un administrateur vous en fera part!", ephemeral: true })
    }
}