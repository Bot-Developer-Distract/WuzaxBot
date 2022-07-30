const { ActionRowBuilder, MessageButton, ModalBuilder, ButtonInteraction, Client, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require("discord.js");

module.exports = {
    id: "shop.code.panel",

    /**
     * @param { ButtonInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {
        const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
            .setCustomId("shop.code.select")
            .setPlaceholder("Choisir un code")
            .addOptions([
                {
                    label: "Reaction Role (Button/Reaction) ✪ 1€",
                    description: "Permet d'ajouté un roles en cliquant sur un boutton",
                    value: "code.reactrole"
                },
                {
                    label: "Giveaway ✪ 2€",
                    description: "Permet de faire un giveaway (complet)",
                    value: "code.giveaway"
                },
                {
                    label: "Economy Bot ✪ 2€",
                    description: "Permet de faire un bot d'economie",
                    value: "code.economy",
                },
                {
                    label: "Ticket Bot (Panel/Commandes) ✪ 4€",
                    description: "Permet de faire un bot de ticket",
                    value: "code.ticket"
                },
                {
                    label: "Music ✪ 5€",
                    description: "Permet de faire un bot de musique",
                    value: "code.music"
                },
                {
                    label: "Manage Invite ✪ 8€",
                    description: "Permet de gérer les invites",
                    value: "code.invite"
                }
            ])
        )
        let embed = new EmbedBuilder()
        .setTitle("Wuzax | Codes")
        .setDescription("Merci de choisir un code en cliquant sur le boutton correspondant")
        .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
        .setColor("White")
        interaction.reply({content: "Veuillez patienter...", ephemeral: true })
        setTimeout(() => {
            interaction.channel.send({embeds: [embed], components: [row]})
        }, 500)
    }
}