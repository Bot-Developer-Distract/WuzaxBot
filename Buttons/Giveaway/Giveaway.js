const { ButtonInteraction, Client, EmbedBuilder } = require("discord.js");
const DB = require("../../schemas/GiveawayDB");

module.exports = {
    id: "giveaway-join",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const embed = new EmbedBuilder();
        const data = await DB.findOne({
            GuildID: interaction.guild.id,
            ChannelID: interaction.channel.id,
            MessageID: interaction.message.id
        });

        if (!data) {
            embed
                .setColor("Red")
                .setDescription(`Il n'y a pas de données dans la base de données`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (data.Entered.includes(interaction.user.id)) {
            embed
                .setColor("Red")
                .setDescription(`Vous avez déjà participé au giveaway`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (data.Paused === true) {
            embed
                .setColor("Red")
                .setDescription(`Ce giveaway est en pause`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (data.Ended === true) {
            embed
                .setColor("Red")
                .setDescription(`Ce giveaway est terminé`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await DB.findOneAndUpdate({
            GuildID: interaction.guild.id,
            ChannelID: interaction.channel.id,
            MessageID: interaction.message.id
        }, {
            $push: { Entered: interaction.user.id }
        }).then(() => {
            embed
                .setColor("Green")
                .setDescription(`Vous avez participé au giveaway`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        });
    }
};