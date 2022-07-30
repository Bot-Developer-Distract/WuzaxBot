const { ButtonInteraction, EmbedBuilder, MessageActionRow, MessageButton, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const DB = require("../../Schemas/TicketDB");
const TicketSetupData = require("../../Schemas/TicketSetup");

module.exports = {
    id: `lock`,
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        const { guildId, options, channel, guild, member } = interaction;
        DB.findOne({ChannelID: channel.id}, async (err, data) => {
            if (err) throw err;
            if (!data) {
                Embed
                    .setColor("Red")
                    .setDescription(`:x: There is no data in the database`);
                return interaction.reply({embeds: [Embed]});
            }

            if (data.Locked === true) {
                Embed
                    .setColor("Red")
                    .setDescription(`:x: This ticket is already locked`);
                return interaction.reply({embeds: [Embed]});
            }
            await DB.updateOne({
                ChannelID: channel.id
            }, {
                Locked: true
            });
            Embed.setDescription(`:white_check_mark: This ticket is now locked for reviewing`).setColor("Green");
            data.MembersID.forEach(m => {
                channel.permissionOverwrites.edit(m, {
                    SendMessages: false,
                });
            });
            interaction.reply({embeds: [Embed]});
        });
    }
}