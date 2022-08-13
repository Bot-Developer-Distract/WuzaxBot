const { EmbedBuilder, ChatInputCommandInteraction, ApplicationCommandOptionType } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const DB = require("../../Schemas/TicketDB");
const TicketSetupData = require("../../Schemas/TicketSetup");
const { SlashCommand } = require("discord-commands-params")

module.exports = new SlashCommand({
    name: "ticket",
    description: "Actions des tickets",
    options: [
        {
            name: "user",
            description: "Ajouter ou supprimer un utilisateur du ticket",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "action",
                    type: ApplicationCommandOptionType.String,
                    description: "Ajouter ou supprimer un utilisateur du ticket",
                    required: true,
                    choices: [
                        {name: "Ajouté", value: "add"},
                        {name: "Retiré", value: "remove"},
                    ]
                },
                {
                    name: "member",
                    description: "Choisir un membre",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ]
        },
        {
            name: "close",
            description: "Fermé ce ticket",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "reason",
                    description: "Donnez une raison",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "lock",
            description: "Verrouiller ce channel de ticket",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "reason",
                    description: "Donnez une raison",
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        {
            name: "unlock",
            description: "Déverrouiller ce ticket",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "claim",
            description: "Réclamez ce ticket",
            type: ApplicationCommandOptionType.Subcommand
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
     async execute({client, interaction}) {
        const { guildId, options, channel, guild, member } = interaction;
        const Embed = new EmbedBuilder();
        const SubCommand = options.getSubcommand();
        await interaction.deferReply();
        
        const TicketSetup = await TicketSetupData.findOne({ GuildID: guild.id });
        if (!TicketSetup) {
            Embed
                .setColor("Red")
                .setDescription(`:x: Il n'y a pas de données dans la base de données`);
            return interaction.editReply({embeds: [Embed], ephemeral: true});
        }

        if (!member.roles.cache.find(r => r.id === TicketSetup.Handlers) || !member.permissions.has("ADMINISTRATOR")) {
            Embed
                .setColor("Red")
                .setDescription(`:x: Cette commande est réservée au personnel !`);
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
                                    .setDescription(`:x: Ce canal n'est pas un channel de tickets`);
                                return interaction.editReply({embeds: [Embed], ephemeral: true});
                            }
                            
                            if (docs.MembersID.includes(Member.id)) {
                                Embed
                                    .setColor("Red")
                                    .setDescription(`:x: Cet utilisateur est déjà dans le ticket`);
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
                                        `:white_check_mark: ${Member} a été ajoutée au ticket`
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
                                    .setDescription(`:x: Ce canal n'est pas un channel de tickets`);
                                return interaction.editReply({embeds: [Embed], ephemeral: true});
                            }
                            if (!docs.MembersID.includes(Member.id)) {
                                Embed
                                    .setColor("Red")
                                    .setDescription(`:x: Cet utilisateur n'est pas dans le ticket`);
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
                                        `:white_check_mark: ${Member} a été supprimé de ce ticket`
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
                            .setDescription(`:x: Il n'y a pas de données dans la base de données. Veuillez supprimer ce ticket manuellement`);
                        return interaction.editReply({embeds: [Embed], ephemeral: true});
                    }

                    if (data.Closed === true) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: Ce ticket est déjà fermé. Veuillez attendre qu'il soit supprimé`);
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
                            .setTitle(`ID du ticket: ${data.TicketID}`)
                            .setDescription(`Fermé par: ${member.user.tag}\nRaison: **${Reason}**\nMembre: <@${data.CreatedBy}>`)
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
                const Reason = options.getString("reason") || "Pas de raison donné";
                DB.findOne({ChannelID: channel.id}, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: il n'y a pas de données dans la base de données`);
                        return interaction.editReply({embeds: [Embed]});
                    }

                    if (data.Locked === true) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: Ce ticket est déjà verrouillé`);
                        return interaction.editReply({embeds: [Embed]});
                    }
                    await DB.updateOne({
                        ChannelID: channel.id
                    }, {
                        Locked: true
                    });
                    Embed.setDescription(`:white_check_mark: Ce ticket est maintenant verrouillé`).setColor("Green");
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
                            .setDescription(`:x: Il n'y a pas de données dans la base de données`);
                        return interaction.editReply({embeds: [Embed]});
                    }
                    if (data.Locked === false) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: Ce ticket est déjà déverrouillé !`);
                        return interaction.editReply({embeds: [Embed]});
                    }
                    await DB.updateOne({ ChannelID: channel.id}, { Locked: false });
                    data.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, {
                            SendMessages: true,
                        });
                    });
                    Embed.setDescription(`:white_check_mark: Ce ticket a été déverrouillé`).setColor("Green");
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
                            .setDescription(`:x: Il n'y a pas de données dans la base de données`);
                        return interaction.editReply({embeds: [Embed]});
                    }
                    if (data.Claimed === true) {
                        Embed
                            .setColor("Red")
                            .setDescription(`:x: Ce ticket a déjà été réclamé par <@${data.ClaimedBy}>`);
                        return interaction.editReply({embeds: [Embed]});
                    }

                    await DB.updateOne({ChannelID: channel.id}, {Claimed: true, ClaimedBy: member.id});

                    Embed.setDescription(`Ce ticket a été réclamé par ${member}`).setColor("Green");
                    interaction.editReply({
                        embeds: [Embed],
                    });
                });
            }
            break;
        }
    }
})