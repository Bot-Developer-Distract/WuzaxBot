const { ButtonInteraction, EmbedBuilder, MessageActionRow, MessageButton, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const DB = require("../../Schemas/TicketDB");
const TicketSetupData = require("../../Schemas/TicketSetup");

module.exports = {
    id: `close`,
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
                    .setDescription(`:x: There is no data in the database. Please delete this ticket manually`);
                return interaction.reply({embeds: [Embed], ephemeral: true});
            }

            if (data.Closed === true) {
                Embed
                    .setColor("Red")
                    .setDescription(`:x: This ticket is already closed. Please wait for it to be deleted`);
                return interaction.reply({embeds: [Embed], ephemeral: true});
            }

            const attachment = await createTranscript(channel, {
                limit: -1,
                returnBuffer: false,
                fileName: `${data.CreatedBy} - ${data.TicketID}.html`,
            });
            await DB.updateOne({
                ChannelID: channel.id,
            }, {
                Closed: true,
            });

            try {
                Embed
                    .setTitle(`Ticket ID: ${data.TicketID}`)
                    .setDescription(`Closed By: ${member.user.tag}\nMember: <@${data.CreatedBy}>`)
                    .setThumbnail(`${interaction.guild.iconURL({dynamic: true})}`)
                    .setTimestamp();
                
                const Message = await guild.channels.cache.get(TicketSetup.Transcripts).send({
                    embeds: [Embed],
                    files: [attachment],
                });

                interaction.reply({embeds: [Embed]});
                setTimeout(() => {
                    channel.delete().catch(() => {});
                }, 5 * 1000)
            } catch (err) {};
        })
    }
}