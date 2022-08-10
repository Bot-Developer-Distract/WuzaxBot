const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, Client, ChannelType, ApplicationCommandOptionType } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "giveaway",
    description: "Giveaways !",
    options: [
        {
            name: "start",
            description: "Start a giveway",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "duration",
                    description: "Pass a length (1m, 1h, 1d)",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "winners",
                    description: "Set the windows of this giveaway",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                },
                {
                    name: "prize",
                    description: "Set a prize to win",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "channel",
                    description: "Set the channel of giveaway his send",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText]
                }
            ]
        },
        {
            name: "actions",
            description: "Options for giveaway",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "options",
                    description: "Options for giveaway",
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        {
                            name: "end",
                            value: "end"
                        },
                        {
                            name: "pause",
                            value: "pause"
                        },
                        {
                            name: "unpause",
                            value: "unpause"
                        },
                        {
                            name: "reroll",
                            value: "reroll"
                        },
                        {
                            name: "delete",
                            value: "delete"
                        }
                    ],
                    required: true
                },
                {
                    name: "message_id",
                    description: "Set the message id of the giveaway",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;
        const Sub = options.getSubcommand();

        const errorEmbed = new EmbedBuilder()
            .setColor('Red')

        const successEmbed = new EmbedBuilder()
            .setColor('#38ca08')

        switch (Sub) {
            case 'start': {
                const gchannel = options.getChannel('channel') || interaction.channel;
                const duration = options.getString('duration');
                const winnerCount = options.getInteger('winners');
                const prize = options.getString('prize');

                client.giveawaysManager.start(gchannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                }).then(async () => {
                    successEmbed.setDescription(`Giveaway start in ${gchannel}`)
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                }).catch((err) => {
                    errorEmbed.setDescription(`Error \n\`${err}\``)
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                })




            }
                break;
            case 'actions': {
                const choice = options.getString('options');
                const messageid = options.getString('message_id');
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageid);

                if (!giveaway) {
                    errorEmbed.setDescription(`The giveaway with the messageid ${messageid} could not be found.`);
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
                switch (choice) {
                    case 'end': {
                        client.giveawaysManager.end(messageid).then(() => {
                            successEmbed.setDescription('Giveaway ended.');
                            return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                        }).catch((err) => {
                            errorEmbed.setDescription(`Error \n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        });
                    }
                        break;
                    case 'pause': {
                        client.giveawaysManager.pause(messageid).then(() => {
                            successEmbed.setDescription('Giveaway paused');
                            return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                        }).catch((err) => {
                            errorEmbed.setDescription(`Error \n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        });
                    }
                        break;
                    case 'unpause': {
                        client.giveawaysManager.unpause(messageid).then(() => {
                            successEmbed.setDescription('Giveaway unpaused');
                            return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                        }).catch((err) => {
                            errorEmbed.setDescription(`Error \n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        });
                    }
                        break;
                    case 'reroll': {
                        client.giveawaysManager.reroll(messageid).then(() => {
                            successEmbed.setDescription('Giveaway rerolled');
                            return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                        }).catch((err) => {
                            errorEmbed.setDescription(`Error \n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        });
                    }
                        break;
                    case 'delete': {
                        client.giveawaysManager.delete(messageid).then(() => {
                            successEmbed.setDescription('Giveaway deleted');
                            return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                        }).catch((err) => {
                            errorEmbed.setDescription(`Error \n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        });
                    }
                        break;
                }
            }
                break;
            default: {
                console.log('Error in giveaway Command');
            }
        }
    }
}