const { ActionRowBuilder, MessageButton, ModalBuilder, ButtonInteraction, Client, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");

module.exports = {
    id: "shop.cmd",

    /**
     * @param { ButtonInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {
        if(interaction.guild.channels.cache.find((c) => c.name === `boutique-${interaction.user.username}`)) return interaction.reply({content: ":x: | Vous avez déja une commande d'ouverte !", ephemeral: true })
        let channel = await interaction.guild.channels.create({
            name: `boutique - ${interaction.user.username}`,
            parent: "993816901497126973",
            reason: `${interaction.user.tag} créé une commande`,
            type: ChannelType.GuildText
        });
        channel.permissionOverwrites.edit(interaction.user.id, {
            AttachFiles: true,
            ReadMessageHistory: true,
            SendMessages: true,
            ViewChannel: true,
        }, `commande créé par ${interaction.user.tag}`)
        channel.permissionOverwrites.edit(interaction.guild.id, {
            ViewChannel: false
        }, `commande créé par ${interaction.user.tag}`)
        let cID = channel.id
        let code = new ButtonBuilder().setCustomId("shop.code.panel").setLabel("Codes").setStyle(ButtonStyle.Primary).setEmoji("⚙️")
        let custom = new ButtonBuilder().setCustomId("shop.custom.panel").setLabel("Custom").setStyle(ButtonStyle.Primary).setEmoji("🛠️")
        let button = new ActionRowBuilder()
            .addComponents([code, custom])
        let embed = new EmbedBuilder()
        .setTitle("Wuzax | Boutique")
        .setDescription(`Bienvenue ${interaction.user} dans votre commande !\n\nMerci de chosir si vous souhaitez commander un code ou un bot custom en cliquant sur les boutton:\n\`⚙️ Codes\` pour choisir de commandes un codes\n\`🛠️ Custom\` pour soumettre une demande de bot custom\nPour fermer cette commande cliquer sur le bouton \`⛔ Close\``)
        .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
        .setColor("White")
        channel.send({content: `${interaction.user} voici votre commande !`, embeds: [embed], components: [button]})
        interaction.reply({content: `Votre commande a été créé <#${cID}>`, ephemeral: true })
    }
}
