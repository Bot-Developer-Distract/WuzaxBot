const { SelectMenuInteraction, Client, InteractionType, ImageFormat, EmbedBuilder } = require("discord.js");
const { Perms } = require("../../Structures/Validation/Permissions")

module.exports = {
    name: "interactionCreate",
    id: "select",
    /**
     * 
     * @param {SelectMenuInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(!interaction.isSelectMenu()) return;

        if(interaction.customId === "shop.code.select") {
            if(interaction.values == "code.reactrole") {
                await interaction.channel.bulkDelete(3)
                let embed = new EmbedBuilder()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addFields([
                    {
                        name: "Author",
                        value: `${interaction.user.tag} (${interaction.user.id})`
                    },
                    {
                        name: "Commande",
                        value: "Code"
                    },
                    {
                        name: "Code",
                        value: "Reaction Role"
                    },
                    {
                        name: "Prix",
                        value: "1€"
                    }
                ])
                .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
                .setColor("White")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
            if(interaction.values == "code.giveaway") {
                await interaction.channel.bulkDelete(3)
                let embed = new EmbedBuilder()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addFields([
                    {
                        name: "Author",
                        value: `${interaction.user.tag} (${interaction.user.id})`
                    },
                    {
                        name: "Commande",
                        value: "Code"
                    },
                    {
                        name: "Code",
                        value: "Giveaway"
                    },
                    {
                        name: "Prix",
                        value: "2€"
                    }
                ])
                .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
                .setColor("White")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
            if(interaction.values == "code.economy") {
                await interaction.channel.bulkDelete(3)
                let embed = new EmbedBuilder()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addFields([
                    {
                        name: "Author",
                        value: `${interaction.user.tag} (${interaction.user.id})`
                    },
                    {
                        name: "Commande",
                        value: "Code"
                    },
                    {
                        name: "Code",
                        value: "Economy Bot"
                    },
                    {
                        name: "Prix",
                        value: "2€"
                    }
                ])
                .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
                .setColor("White")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
            if(interaction.values == "code.ticket") {
                await interaction.channel.bulkDelete(3)
                let embed = new EmbedBuilder()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addFields([
                    {
                        name: "Author",
                        value: `${interaction.user.tag} (${interaction.user.id})`
                    },
                    {
                        name: "Commande",
                        value: "Code"
                    },
                    {
                        name: "Code",
                        value: "Ticket Bot"
                    },
                    {
                        name: "Prix",
                        value: "4€"
                    }
                ])
                .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
                .setColor("White")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
            if(interaction.values == "code.music") {
                await interaction.channel.bulkDelete(3)
                let embed = new EmbedBuilder()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addFields([
                    {
                        name: "Author",
                        value: `${interaction.user.tag} (${interaction.user.id})`
                    },
                    {
                        name: "Commande",
                        value: "Code"
                    },
                    {
                        name: "Code",
                        value: "Music"
                    },
                    {
                        name: "Prix",
                        value: "5€"
                    }
                ])
                .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
                .setColor("White")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
            if(interaction.values == "code.invite") {
                await interaction.channel.bulkDelete(3)
                let embed = new EmbedBuilder()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addFields([
                    {
                        name: "Author",
                        value: `${interaction.user.tag} (${interaction.user.id})`
                    },
                    {
                        name: "Commande",
                        value: "Code"
                    },
                    {
                        name: "Code",
                        value: "Manage Invite"
                    },
                    {
                        name: "Prix",
                        value: "8€"
                    }
                ])
                .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
                .setColor("White")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
        }
    }
}