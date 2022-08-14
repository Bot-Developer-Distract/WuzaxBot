const { Client, EmbedBuilder, ModalSubmitInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ms = require("ms");
const DB = require("../../Schemas/GiveawayDB");
const { endGiveaway } = require("../../Structures/Utils/GiveawayFunctions");

module.exports = {
    id: "giveaway-options",
    /**
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const embed = new EmbedBuilder();

        const prize = interaction.fields.getTextInputValue("giveaway-prize").slice(0, 256);
        const winners = Math.round(parseFloat(interaction.fields.getTextInputValue("giveaway-winners")));
        const duration = ms(interaction.fields.getTextInputValue("giveaway-duration"));

        if (isNaN(winners) || !isFinite(winners) || winners < 1) {
            embed
                .setColor("Red")
                .setDescription(`Veuillez fournir un nombre de gagnants valide`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (duration === undefined) {
            embed
                .setColor("Red")
                .setDescription(`Veuillez fournir une durée valide`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const formattedDuration = parseInt((Date.now() + duration) / 1000);

        const giveawayEmbed = new EmbedBuilder()
            .setColor("#156789")
            .setTitle(`${prize}`)
            .setDescription(`**Créé par**: ${interaction.member}\n**Gagnant(s)**: ${winners}\n**Fini dans**: <t:${formattedDuration}:R> (<t:${formattedDuration}>)`)
            .setTimestamp(parseInt(Date.now() + duration));

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("giveaway-join")
                .setEmoji("🎉")
                .setStyle(ButtonStyle.Success)
                .setLabel("Rejoindre ici")
        );

        interaction.reply({ content: "🎉 **Giveaway Lancée** 🎉", embeds: [giveawayEmbed], components: [button], fetchReply: true }).then(async (message) => {
            await DB.create({
                GuildID: interaction.guild.id,
                ChannelID: interaction.channel.id,
                EndTime: formattedDuration,
                Ended: false,
                HostedBy: interaction.user.id,
                Prize: prize,
                Winners: winners,
                Paused: false,
                MessageID: message.id,
                Entered: []
            }).then((data) => {
                setTimeout(async () => {
                    if (data.Ended === false) endGiveaway(message, DB);
                }, duration);
            });
        });
    }
};