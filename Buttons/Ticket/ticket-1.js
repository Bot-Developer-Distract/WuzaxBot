const { ButtonInteraction, EmbedBuilder, MessageActionRow, MessageButton, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const DB = require("../../Schemas/TicketDB");
const TicketSetupData = require("../../Schemas/TicketSetup");

module.exports = {
    id: `Ticket-1`,
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        const { guild, member, customId } = interaction;
        const Data = await TicketSetupData.findOne({GuildID: guild.id});
        if (!Data) return;

        const ID = Data.IDs + 1;
        await guild.channels.create({
            name: `${member.user.tag}`,
            type: ChannelType.GuildText,
            parent: Data.Category,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
                },
                {
                    id: Data.Handlers,
                    allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AddReactions]
                },
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
            ],
            
        }).then(async channel => {
            let button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("close")
                .setLabel("Close")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("⛔")
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId("lock")
                .setLabel("Lock")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🔒")
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId("unlock")
                .setLabel("Unlock")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🔓")
            )
            await DB.create({
                GuildID: guild.id,
                MembersID: member.id,
                TicketID: ID,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId,
                Claimed: false,
                CreatedBy: member.id,
                Opened: parseInt(Date.now() / 1000)
            });
            channel.setRateLimitPerUser(5);
            await TicketSetupData.findOneAndUpdate({GuildID: guild.id}, {IDs: ID});
            const Embed = new EmbedBuilder()
                .setAuthor({name: `${guild.name} | Ticket ID: ${ID}`, iconURL: `${guild.iconURL({dynamic: true})}`})
                .setDescription(`Ticket Created by <@${interaction.user.id}>\n\nPlease wait patiently for a response from the Staff team, in the meanwhile, please describe your issue or report in as much detail as possible.`);
            channel.send({
                embeds: [Embed],
                content: `<@${interaction.user.id}>`,
                components: [button]
            });

            await interaction.reply({content: `${member} your ticket has been created: ${channel}`, ephemeral: true});
        });
    }
}