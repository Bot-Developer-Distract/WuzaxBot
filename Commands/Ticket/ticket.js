const { EmbedBuilder, ChatInputCommandInteraction, ApplicationCommandOptionType } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const DB = require("../../Schemas/TicketDB");
const TicketSetupData = require("../../Schemas/TicketSetup");
const { SlashCommand } = require("discord-commands-params")

module.exports = new SlashCommand({
    name: "ticket",
    description: "Ticket Actions",
    options: [
        {
            name: "user",
            description: "Add or remove a user from the ticket",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "action",
                    type: ApplicationCommandOptionType.String,
                    description: "Add or remove a member from this ticket",
                    required: true,
                    choices: [
                        {name: "Add", value: "add"},
                        {name: "Remove", value: "remove"},
                    ]
                },
                {
                    name: "member",
                    description: "Select a member",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ]
        },
        {
            name: "close",
            description: "Close the ticket",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "reason",
                    description: "Provide a reason",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "lock",
            description: "Lock this ticket channel for reviewing",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "reason",
                    description: "Provide a reason",
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        {
            name: "unlock",
            description: "Unlock this ticket",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "claim",
            description: "Claim this ticket for yourself",
            type: ApplicationCommandOptionType.Subcommand
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guildId, options, channel, guild, member } = interaction;
        const Embed = new EmbedBuilder();
        const SubCommand = options.getSubcommand();
        await interaction.deferReply();
        
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

        switch (SubCommand) {
            case "user": {
                const Action = options.getString("action");
                const Member = options.getMember("member");

                switch (Action) {
                    case "add": 
                        DB.findOne({GuildID: guildId, ChannelID: channel.id}, async (err, docs) => {
                            if (err) throw err;
                            if (!docs) {
                                Embed
                                    .setColor("Red")
                                    .setDescription(`:x: This channel is not a ticket channel`);
                                return interaction.editReply({embeds: [Embed], ephemeral: true});
                            }
                            
                            if (docs.MembersID.includes(Member.id)) {
                                Embed
                                    .setColor("Red")
                                    .setDescription(`:x: This user is already in the ticket`);
                                return interaction.editReply({embeds: [Embed]});
                            }
        
                            docs.MembersID.push(Member.id);
        
                            channel.permissionOverwrites.edit(Member.id, {
                                SendMessages: true,
                                ViewChannel: true,
                                ReadMessageHistory: true
                            });
        
                            interaction.editReply({
                                embeds: [
                                    Embed.setColor("Green").setDescription(
                                        `:white_check_mark: ${Member} has been added to the ticket`
                                    )
                                ]
                            });
                            docs.save();
                        }
                    );
                    break;
                    case "remove": 
                        DB.findOne({GuildID: guildId, ChannelID: channel.id}, async (err, docs) => {
                            if (err) throw err;
                            if (!docs) {
                                Embed
                                    .setColor("Red")
                                    .setDescription(`:x: This channel is not a ticket channel`);
                                return interaction.editReply({embeds: [Embed], ephemeral: true});
                            }
                            if (!docs.MembersID.includes(Member.id)) {
                                Embed
                                    .setColor("Red")
                                    .setDescription(`:x: This user is not in the ticket`);
                                return interaction.editReply({embeds: [Embed], ephemeral: true});
                            }
        
                            docs.MembersID.remove(Member.id);
        
                            channel.permissionOverwrites.edit(Member.id, {
                                SendMessages: false,
                                ViewChannel: false
                            });
        
                            interaction.editReply({
                                embeds: [
                                    Embed.setColor("Green").setDescription(
                                        `:white_check_mark: ${Member} has been removed from this ticket`
                                    )
                                ]
                            })
                            docs.save();
                        }
                    );
                    break;
                }
            }
            break;

            case "close": {
                const Reason = options.getString("reason");
                DB.findOne({ChannelID: channel.id}, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: There is no data in the database. Please delete this ticket manually`);
                        return interaction.editReply({embeds: [Embed], ephemeral: true});
                    }

                    if (data.Closed === true) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: This ticket is already closed. Please wait for it to be deleted`);
                        return interaction.editReply({embeds: [Embed], ephemeral: true});
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
                            .setDescription(`Closed By: ${member.user.tag}\nReason: **${Reason}**\nMember: <@${data.CreatedBy}>`)
                            .setThumbnail(`${interaction.guild.iconURL({dynamic: true})}`)
                            .setTimestamp();
                        
                        const Message = await guild.channels.cache.get(TicketSetup.Transcripts).send({
                            embeds: [Embed],
                            files: [attachment],
                        });

                        interaction.editReply({embeds: [Embed]});
                        setTimeout(() => {
                            channel.delete().catch(() => {});
                        }, 5 * 1000)
                    } catch (err) {};
                })
            }
            break;
            case "lock": {
                const Reason = options.getString("reason") || "No reason provided";
                DB.findOne({ChannelID: channel.id}, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: There is no data in the database`);
                        return interaction.editReply({embeds: [Embed]});
                    }

                    if (data.Locked === true) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: This ticket is already locked`);
                        return interaction.editReply({embeds: [Embed]});
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
                    interaction.editReply({embeds: [Embed]});
                });
            }
            break;
            case "unlock": {
                DB.findOne({ChannelID: channel.id}, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: There is no data in the database`);
                        return interaction.editReply({embeds: [Embed]});
                    }
                    if (data.Locked === false) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: This ticket is already unlocked!`);
                        return interaction.editReply({embeds: [Embed]});
                    }
                    await DB.updateOne({ ChannelID: channel.id}, { Locked: false });
                    data.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, {
                            SendMessages: true,
                        });
                    });
                    Embed.setDescription(`:white_check_mark: This ticket has been unlocked`).setColor("Green");
                    interaction.editReply({embeds: [Embed]});
                })
            }
            break;
            case "claim": {
                DB.findOne({ChannelID: channel.id}, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: There is no data in the database`);
                        return interaction.editReply({embeds: [Embed]});
                    }
                    if (data.Claimed === true) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: This ticket has already been claimed by <@${data.ClaimedBy}>`);
                        return interaction.editReply({embeds: [Embed]});
                    }

                    await DB.updateOne({ChannelID: channel.id}, {Claimed: true, ClaimedBy: member.id});

                    Embed.setDescription(`This ticket has been claimed by ${member}`).setColor("Green");
                    interaction.editReply({
                        embeds: [Embed],
                    });
                });
            }
            break;
        }
    }
})