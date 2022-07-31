const { ButtonInteraction, EmbedBuilder, MessageActionRow, MessageButton, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const DB = require("../../Schemas/TicketDB");
const TicketSetupData = require("../../Schemas/TicketSetup");
const { createTranscript } = require('discord-html-transcripts');

module.exports = {
    id: `claim`,
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        const { guildId, options, channel, guild, member } = interaction;
        const Embed = new EmbedBuilder();
        const TicketSetup = await TicketSetupData.findOne({ GuildID: guild.id });
        if (!TicketSetup) {
            Embed
                .setColor("Red")
                .setDescription(`:x: There is no data in the database`);
            return interaction.editReply({embeds: [Embed], ephemeral: true});
        }

        if (!member.roles.cache.find(r => r.id === TicketSetup.Handlers) || !member.permissions.has("ADMINISTRATOR")) {
            Embed
                .setColor("Red")
                .setDescription(`:x: This command is for staff only!`);
            return interaction.editReply({embeds: [Embed], ephemeral: true});
        }

        DB.findOne({ChannelID: channel.id}, async (err, data) => {
            if (err) throw err;
            if (!data) {
                Embed
                    .setColor("Red")
                    .setDescription(`:x: There is no data in the database`);
                return interaction.reply({embeds: [Embed]});
            }
            if (data.Claimed === true) {
                Embed
                    .setColor("Red")
                    .setDescription(`:x: This ticket has already been claimed by <@${data.ClaimedBy}>`);
                return interaction.reply({embeds: [Embed]});
            }

            await DB.updateOne({ChannelID: channel.id}, {Claimed: true, ClaimedBy: member.id});

            Embed.setDescription(`This ticket has been claimed by ${member}`).setColor("Green");
            interaction.reply({
                embeds: [Embed],
            });
        });
    }
}