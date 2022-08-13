const { ButtonBuilder, ChannelType, ApplicationCommandOptionType, ActionRowBuilder, EmbedBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const DB = require("../../Schemas/TicketSetup");
const { SlashCommand } = require("discord-commands-params")

module.exports = new SlashCommand({
    name: "tpanel",
    description: "Setup your ticket system",
    options: [
        {
            name: "channel", 
            description: "Select a ticket creation channel", 
            required: true, 
            type: ApplicationCommandOptionType.Channel, 
            channelTypes: [ChannelType.GuildText]
        },
        {
            name: "category", 
            description: "Select the ticket channels parent category", 
            required: true, 
            type: ApplicationCommandOptionType.Channel, 
            channelTypes: [ChannelType.GuildCategory]
        },
        {
            name: "transcripts", 
            description: "Select a ticket transcripts channel", 
            required: true, 
            type: ApplicationCommandOptionType.Channel, 
            channelTypes: [ChannelType.GuildText]
        },
        {
            name: "helpers", 
            description: "Select the ticket helpers role",
            required: true, 
            type: ApplicationCommandOptionType.Role,
        },
        {
            name: "description", 
            description: "Set a description of the ticket system",
            required: true, 
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "button", 
            description: "Select a name for your first button", 
            required: true, 
            type: ApplicationCommandOptionType.String, 
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({content: ":x: | You do not have permissions for use this command", ephemeral: true })
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
                        .setCustomId("Ticket-1")
                        .setLabel(Button1)
                        .setStyle(ButtonStyle.Secondary),
                );

                const Embed = new EmbedBuilder()
                    .setAuthor({name: `${guild.name} | Ticket System`, iconURL: `${guild.iconURL({dynamic: true})}`})
                    .setDescription(Description)
                    .setColor("White");
            
                guild.channels.cache.get(Channel.id).send({embeds: [Embed], components: [Buttons]});
                interaction.reply({content: `Done`, ephemeral: true});

        } catch (err) {
            const ErrorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                    `❌ | An error ocurred while up your ticket system\n**What should I make sure of?**
                    1. Make sure none of your buttons' names are duplicated.
                    2. Make sure your button names do not exceed 200 characters
                    `
                );
            interaction.reply({embeds: [ErrorEmbed]});
            console.error(err);
        }
    }
})