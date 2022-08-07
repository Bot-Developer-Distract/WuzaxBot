const { ActionRowBuilder, MessageButton, ModalBuilder, Client, TextInputBuilder, TextInputStyle, EmbedBuilder, Embed, SelectMenuInteraction } = require("discord.js");

module.exports = {
    id: "shop.code.select",

    /**
     * @param { SelectMenuInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {
        if(interaction.values == "code.economy") {
            await interaction.channel.bulkDelete(3)
            let embed = new EmbedBuilder()
            .setTitle("Wuzax | Codes")
            .setDescription(`Veuillez patienter un administateur.`)
            .addFields([
                {
                    name: "Author",
                    value: `${interaction.user.tag} (${interaction.user.id})`
                },
                {
                    name: "Commande",
                    value: "Code"
                },
                {
                    name: "Code",
                    value: "Economy Bot"
                },
                {
                    name: "Prix",
                    value: "2€"
                }
            ])
            .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
            .setColor("White")
            interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
        }
    }
}