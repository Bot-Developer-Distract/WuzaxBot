const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, Client, ChannelType, ApplicationCommandOptionType } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "giveaway",
    description: "Giveaways !",
    options: [
        {
            name: "start",
            description: "Lancer un giveaway",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "duration",
                    description: "Definir un temps (1m, 1h, 1d)",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "winners",
                    description: "Definir le nombre de gagnants",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                },
                {
                    name: "prize",
                    description: "Definir un prix pour le giveaway",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "channel",
                    description: "Definir le channel ou le giveaway sera envoyé",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText]
                }
            ]
        },
        {
            name: "actions",
            description: "Options pour les giveaway",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "options",
                    description: "Options pour les giveaway",
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        {
                            name: "Fin",
                            value: "end"
                        },
                        {
                            name: "Pause",
                            value: "pause"
                        },
                        {
                            name: "Reprendre",
                            value: "unpause"
                        },
                        {
                            name: "Reroll",
                            value: "reroll"
                        },
                        {
                            name: "Supprimer",
                            value: "delete"
                        }
                    ],
                    required: true
                },
                {
                    name: "message_id",
                    description: "Definir l'id d'un giveaway",
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
                    successEmbed.setDescription(`Giveaway lancé dans ${gchannel}`)
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                }).catch((err) => {
                    errorEmbed.setDescription(`Erreur \n\`${err}\``)
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                })
            }
                break;
            case 'actions': {
                const choice = options.getString('options');
                const messageid = options.getString('message_id');
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageid);

                if (!giveaway) {
                    errorEmbed.setDescription(`Le giveaway avec l'id ${messageid} n'a pas pu être trouvé.`);
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
                switch (choice) {
                    case 'end': {
                        client.giveawaysManager.end(messageid).then(() => {
                            successEmbed.setDescription('Giveaway Fini.');
                            return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                        }).catch((err) => {
                            errorEmbed.setDescription(`Erreur \n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        });
                    }
                        break;
                    case 'pause': {
                        client.giveawaysManager.pause(messageid).then(() => {
                            successEmbed.setDescription('Giveaway Mit en Pause');
                            return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                        }).catch((err) => {
                            errorEmbed.setDescription(`Erreur \n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        });
                    }
                        break;
                    case 'unpause': {
                        client.giveawaysManager.unpause(messageid).then(() => {
                            successEmbed.setDescription('Giveaway Reprit');
                            return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                        }).catch((err) => {
                            errorEmbed.setDescription(`Erreur \n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        });
                    }
                        break;
                    case 'reroll': {
                        client.giveawaysManager.reroll(messageid).then(() => {
                            successEmbed.setDescription('Giveaway Reroll');
                            return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                        }).catch((err) => {
                            errorEmbed.setDescription(`Erreur \n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        });
                    }
                        break;
                    case 'delete': {
                        client.giveawaysManager.delete(messageid).then(() => {
                            successEmbed.setDescription('Giveaway Supprimer');
                            return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                        }).catch((err) => {
                            errorEmbed.setDescription(`Erreur \n\`${err}\``)
                            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        });
                    }
                        break;
                }
            }
                break;
            default: {
                console.log('Erreur dans la commande des giveaway');
            }
        }
    }
}