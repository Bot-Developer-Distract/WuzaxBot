const { Client, ChatInputCommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "shop",
    description: "envoyé le menu de commande de la boutique",
    category: "Shop",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        let buttonShop = new ButtonBuilder().setLabel("Commander").setCustomId("shop.cmd").setStyle(ButtonStyle.Primary).setEmoji("🛒")
        let shopButton = new ActionRowBuilder()
            .addComponents([buttonShop])
        let embed = new EmbedBuilder()
        .setTitle("Wuzax - Boutique")
        .addFields([
            {
                name: "➤ Codes",
                value: "> `Reaction Role (Button/Reaction)` ✪ **1€**\n> `Giveaway` ✪ **2€**\n> `Economy Bot` ✪ **2€**\n> `Ticket Bot (Panel/Commandes)` ✪ **4€**\n> `Music` ✪ **5€**\n> `Manage Invite` ✪ **8€**"
            },
            {
                name: "➤ Custom Bot",
                value: "Vous pouvez commander un bot custom, **le prix sera en fonction de la commande**."
            }
        ])
        .setDescription("Vous voulez votre propre bot discord ? Vous etes au bonne endroit.\nTous les codes peuvent etre choisi en slash commannd ou commande normal avec prefix, avec boutton ou réaction !\nLe paiement se fait **uniquement par paypal** !")
        .setColor("Red")
        .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
        interaction.channel.send({embeds: [embed], components: [shopButton]})
        interaction.reply({content: "Message envoyé !", ephemeral: true })       
    }

}