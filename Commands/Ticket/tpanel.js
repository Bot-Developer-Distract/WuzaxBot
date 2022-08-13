const { ButtonBuilder, ChannelType, ApplicationCommandOptionType, ActionRowBuilder, EmbedBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const DB = require("../../Schemas/TicketSetup");
const { SlashCommand } = require("discord-commands-params")

module.exports = new SlashCommand({
    name: "tpanel",
    description: "Configurer votre système de tickets",
    options: [
        {
            name: "channel", 
            description: "Choisir un channel ou le panel sera envoyé", 
            required: true, 
            type: ApplicationCommandOptionType.Channel, 
            channelTypes: [ChannelType.GuildText]
        },
        {
            name: "category", 
            description: "Choisir la catégorie du channel du ticket", 
            required: true, 
            type: ApplicationCommandOptionType.Channel, 
            channelTypes: [ChannelType.GuildCategory]
        },
        {
            name: "transcripts", 
            description: "Sélectionnez un channel de transcription des tickets", 
            required: true, 
            type: ApplicationCommandOptionType.Channel, 
            channelTypes: [ChannelType.GuildText]
        },
        {
            name: "helpers", 
            description: "Sélectionnez le rôle d'aide pour les billets",
            required: true, 
            type: ApplicationCommandOptionType.Role,
        },
        {
            name: "description", 
            description: "Définir une description du système de tickets",
            required: true, 
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "button", 
            description: "Choisissez un nom pour votre bouton", 
            required: true, 
            type: ApplicationCommandOptionType.String, 
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute({client, interaction}) {
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({content: ":x: | Vous n'avez pas le droit d'utiliser cette commande.", ephemeral: true })
        const { guild, options } = interaction;

        try {
            const Channel = options.getChannel("channel");
            const Category = options.getChannel("category");
            const Transcripts = options.getChannel("transcripts");

            const Handlers = options.getRole("helpers");
            const Everyone = guild.roles.everyone;
            const Description = options.getString("description");

            const Button1 = options.getString("button");

            await DB.findOneAndUpdate(
                {GuildID: guild.id},
                {
                    ChannelID: Channel.id,
                    Category: Category.id,
                    Transcripts: Transcripts.id,
                    Handlers: Handlers.id,
                    Everyone: Everyone.id,
                    Description: Description,
                    IDs: 0
                },
                {
                    new: true,
                    upsert: true,
                }
            )

                const Buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("Ticket")
                        .setLabel(Button1)
                        .setStyle(ButtonStyle.Secondary),
                );

                const Embed = new EmbedBuilder()
                    .setAuthor({name: `${guild.name} | Système de tickets`, iconURL: `${guild.iconURL({dynamic: true})}`})
                    .setDescription(Description)
                    .setColor("White");
            
                guild.channels.cache.get(Channel.id).send({embeds: [Embed], components: [Buttons]});
                interaction.reply({content: `Panel envoyé !`, ephemeral: true});

        } catch (err) {
            const ErrorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                    `❌ | Une erreur s'est produite lors de l'utilisation de votre système de tickets.
                    1. Assurez-vous qu'aucun des noms de vos boutons n'est dupliqué.
                    2. Assurez-vous que les noms de vos boutons ne dépassent pas 200 caractères.
                    `
                );
            interaction.reply({embeds: [ErrorEmbed]});
            console.error(err);
        }
    }
})