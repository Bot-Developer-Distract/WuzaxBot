const { ChatInputCommandInteraction, Client, EmbedBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, PermissionsBitField, TextInputStyle, ButtonStyle } = require("discord.js");
const DB = require("../../Schemas/GiveawayDB");
const { endGiveaway } = require("../../Structures/Utils/GiveawayFunctions");
const { SlashCommand } = require("discord-commands-params")

module.exports = new SlashCommand({
    name: "giveaway",
    description: "Créé ou Géré un giveaway",
    defaultMemberPermissions: PermissionsBitField.Flags.ManageGuild,
    dmPermission: false,
    botPermissions: ["SendMessages"],
    options: [
        {
            name: "create",
            description: "Créé un giveaway",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "manage",
            description: "Géré un giveaway",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "toggle",
                    description: "Fournir une option pour gérer",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: "End", value: "end" },
                        { name: "Pause", value: "pause" },
                        { name: "Unpause", value: "unpause" },
                        { name: "Reroll", value: "reroll" },
                        { name: "Delete", value: "delete" },
                    ]
                },
                {
                    name: "message_id",
                    description: "Fournir l'ID du message du giveaway",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "create": {
                const prize = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("giveaway-prize")
                        .setLabel("Prix")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(256)
                        .setRequired(true)
                );

                const winners = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("giveaway-winners")
                        .setLabel("Nombre de gagnants")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                );

                const duration = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("giveaway-duration")
                        .setLabel("Durée")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Example: 1 day")
                        .setRequired(true)
                );
                
                const modal = new ModalBuilder()
                    .setCustomId("giveaway-options")
                    .setTitle("Créé un giveaway")
                    .setComponents(prize, winners, duration);

                await interaction.showModal(modal);
            }
            break;

            case "manage": {
                const embed = new EmbedBuilder();
                const messageId = interaction.options.getString("message_id");
                const toggle = interaction.options.getString("toggle");

                const data = await DB.findOne({
                    GuildID: interaction.guild.id,
                    MessageID: messageId
                });
                if (!data) {
                    embed
                        .setColor("Red")
                        .setDescription(`Je n'ai pas trouvé de giveaway avec ce message ID`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const message = (await interaction.guild.channels.cache.get(data.ChannelID).messages.fetch(messageId));
                if (!message) {
                    embed
                        .setColor("Red")
                        .setDescription(`Ce giveaway n'existe pas.`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (["end", "reroll"].includes(toggle)) {
                    if (data.Ended === (toggle === "end" ? true : false)) {
                        embed
                            .setColor("Red")
                            .setDescription(`Ce giveaway a ${toggle === "end" ? "déjà terminé" : "non terminé"}`);
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                    endGiveaway(message, DB, (toggle === "end" ? false : true));

                    embed
                        .setColor("Green")
                        .setDescription(`Ce giveaway est ${toggle === "end" ? "fini" : "ont été relancés"}`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (["pause", "unpause"].includes(toggle)) {
                    if (data.Paused === (toggle === "pause" ? true : false)) {
                        embed
                            .setColor("Red")
                            .setDescription(`Ce giveaway est déja ${toggle === "pause" ? "en pause" : "en cours"}`);
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                    const button = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId("giveaway-join")
                            .setEmoji("🎉")
                            .setStyle(ButtonStyle.Success)
                            .setLabel("Rejoindre ici")
                            .setDisabled(toggle === "pause" ? true : false)
                    );

                    const giveawayEmbed = new EmbedBuilder()
                        .setColor(toggle === "pause" ? "Yellow" : "#156789")
                        .setTitle(`${data.Prize}`)
                        .setDescription(`**Créé par**: <@${data.HostedBy}>\n**Gagnant(s)**: ${data.Winners}\n**Fini dans**: <t:${data.EndTime}:R> (<t:${data.EndTime}>)`)
                        .setTimestamp(parseInt(data.EndTime) * 1000);

                    await DB.findOneAndUpdate({
                        GuildID: interaction.guild.id,
                        MessageID: message.id
                    }, {
                        Paused: toggle === "pause" ? true : false
                    });
                    
                    await message.edit({ content: `🎉 **Giveaway ${toggle === "pause" ? "En Pause" : "En cours"}** 🎉`, embeds: [giveawayEmbed], components: [button] });

                    embed
                        .setColor("Green")
                        .setDescription(`Ce giveaway est déja ${toggle === "pause" ? "en pause" : "en cours"}`);
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (toggle === "delete") {
                    await DB.deleteOne({
                        GuildID: interaction.guild.id,
                        MessageID: message.id
                    });

                    message.delete();
                    embed
                        .setColor("Green")
                        .setDescription(`Le giveaway a été supprimé`);
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }
            break;
        }
    },
})