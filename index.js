const { Client, Intents, MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton } = require("discord.js");
const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"]});
const { PermissionFlagsBits } = require('discord-api-types/v10');
require("dotenv").config();
const { createTranscript } = require("discord-html-transcripts")
const fs = require('fs')
const bdd = require("./bdd.json")
const InvitesTracker = require('@androz2091/discord-invites-tracker');
const tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true
});
let { sendLogs } = require("./functions")

tracker.on('guildMemberAdd', (member, type, invite) => {

    const welcomeChannel = member.guild.channels.cache.find((ch) => ch.id === '991780665324474548');

    if(type === 'normal'){
        welcomeChannel.send(`Bienvenue ${member}! Tu a été invité par ${invite.inviter.tag} (${invite.uses} Invitations)!`);
        sendLogs(member.guild, "Member", `${member.user.tag} vient de rejoindre le serveur`)
        sendLogs(member.guild, "Member", `${invite.inviter.tag} vient d'inviter ${member.user.tag} sur le serveur, il a ${invite.uses} invitations`)
    }

    else if(type === 'vanity'){
        welcomeChannel.send(`Bienvenue ${member}! Vous avez rejoint en utilisant une invitation personnalisée !`);
        sendLogs(member.guild, "Member", `${member.user.tag} vient de rejoindre le serveur`)
    }

    else if(type === 'permissions'){
        welcomeChannel.send(`Bienvenue ${member}! Je n'arrive pas à comprendre comment vous vous avez rejoint parce que je n'ai pas l'autorisation de "Manage Server" !`);
        sendLogs(member.guild, "Member", `${member.user.tag} vient de rejoindre le serveur`)
    }

    else if(type === 'unknown'){
        welcomeChannel.send(`Bienvenue ${member}! Je n'arrive pas à comprendre comment vous avez rejoint le serveur...`);
        sendLogs(member.guild, "Member", `${member.user.tag} vient de rejoindre le serveur`)
    }

});

client.on("guildMemberRemove", (member) => {
    const welcomeChannel = member.guild.channels.cache.find((ch) => ch.id === '991780665324474548');
    welcomeChannel.send(`Dommage ${member.user.tag} vient de quitter le serveur !`)
    sendLogs(member.guild, "Member", `${member.user.tag} vient de quitté le serveur`)
})

client.on("ready", () => {
    console.log("Ready !");
    //Slash Commands
    let g = client.guilds.cache.get("868564194235142145")
    g.commands.set([
        {
            name: "verify",
            description: "send a verify menu",
        },
        {
            name: "roles",
            description: "send roles button"
        },
        {
            name: "panel",
            description: "send panel for tickets",
            options: [
                {
                    name: "channel",
                    description: "channel of ticket panel is send",
                    type: "CHANNEL",
                    required: true
                },
                {
                    name: "title",
                    description: "title of embed for panel",
                    type: "STRING",
                    required: false
                },
                {
                    name: "color",
                    description: "color of embed for panel",
                    type: "STRING",
                    required: false
                }
            ]
        },
        {
            name: "stats",
            description: "Show player tickets created number",
            options: [
                {
                    name: "user",
                    description: "Player for show ticket number",
                    type: "USER",
                    required: true
                }  
            ]
        },
        {
            name: "shop",
            description: "shop command"
        },
        {
            name: "close",
            description: "close commande",
        },
        {
            name: "emit",
            description: "Emit event",
            options: [
                {
                    name: "event",
                    description: "Select a event for emit",
                    type: "STRING",
                    choices: [
                        {
                            name: "guildMemberAdd",
                            value: "guildMemberAdd"
                        },
                        {
                            name: "guildMemberRemove",
                            value: "guildMemberRemove"
                        }
                    ]
                }
            ]
        }
    ])
})

client.on("interactionCreate", async interaction => {
    //Slash Commands
    if(interaction.isCommand()) {
        if(interaction.commandName === "verify") {
            if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: ":x: | Tu n'a pas la permissions", ephemeral: true})
            let button = new MessageButton().setCustomId("verify").setLabel("Verifier").setStyle("SUCCESS").setEmoji("✅")
            let verifyButtons = new MessageActionRow()
                .addComponents([button])
            let embed = new MessageEmbed()
            .setTitle(`😀 Bienvenue sur ${interaction.guild.name}`)
            .setDescription("Ce serveur est le serveur communautaire de Wuzax\n\nPour vous verifiez veuillez cliquer sur le boutton `✅ Verifier` !")
            .setFooter("Wuzax | © 2022", interaction.guild.iconURL())
            interaction.reply({content: "Panel envoyé !", ephemeral: true})
            interaction.channel.send({embeds: [embed], components: [verifyButtons]})
        }
        if(interaction.commandName === "roles") {
            if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: ":x: | Tu n'a pas la permissions", ephemeral: true})
            let giveawayButton = new MessageButton().setLabel("Giveaway").setCustomId("giveaway").setStyle("PRIMARY").setEmoji("🎉")
            let annonceButton = new MessageButton().setLabel("Annonce").setCustomId("annonce").setStyle("PRIMARY").setEmoji("📌")
            let rolesButtons = new MessageActionRow()
                .addComponents([giveawayButton, annonceButton])
            interaction.reply({content: "Panel envoyé !", ephemeral: true})
            interaction.channel.send({components: [rolesButtons]})
        }
        if(interaction.commandName === "panel") {
            let channel = interaction.options.getChannel("channel")
            let title = interaction.options.getString("title")
            let color = interaction.options.getString("color")
            let button = new MessageButton().setLabel("Create Ticket").setCustomId("ticket.panel").setStyle("SECONDARY").setEmoji("📩")
            let panelButton = new MessageActionRow()
                .addComponents([button])

            let embed = new MessageEmbed()
            .setTitle(title ? title : "Wuzax | Ticket")
            .setDescription("Pour ouvrir un ticket, Merci de cliquer sur le bouton `📩 Create Ticket`\n\nTout abus sera sanctionné !")
            .setColor(color ? color : "WHITE")
            .setFooter("© Copyright 2022 - Wuzax - Community")
            interaction.reply({content: "Panel envoyé !", ephemeral: true })
            channel.send({embeds: [embed], components: [panelButton]})
        }
        if(interaction.commandName === "stats") {
            let user = interaction.options.getUser("user")
            if(!bdd["statistique"][user.id]) {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle("Wuzax | Stats")
                        .setDescription(`**${user.tag}** n'a **jamais** ouvert de ticket !`)
                        .setFooter("© Copyright 2022 - Wuzax - Community")
                        .setColor("WHITE")
                    ], ephemeral: true
                })
            } else {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle("Wuzax | Stats")
                        .setDescription(`**${user.tag}** a déja ouvert **${bdd["statistique"][user.id]}** ticket(s) !`)
                        .setFooter("© Copyright 2022 - Wuzax - Community")
                        .setColor("WHITE")
                    ], ephemeral: true
                })
            }
        }
        if(interaction.commandName === "shop") {
            let buttonShop = new MessageButton().setLabel("Commander").setCustomId("shop.cmd").setStyle("PRIMARY").setEmoji("🛒")
            let shopButton = new MessageActionRow()
                .addComponents([buttonShop])
            let embed = new MessageEmbed()
            .setTitle("Wuzax - Boutique")
            .setDescription("Vous voulez votre propre bot discord ? Vous etes au bonne endroit.\nTous les codes peuvent etre choisi en slash comamnd ou commande normal avec prefix, avec boutton ou réaction !\nLe paiement se fait **uniquement par paypal** !")
            .addField("➤ Codes", "> `Reaction Role (Button/Reaction)` ✪ **1€**\n> `Giveaway` ✪ **2€**\n> `Economy Bot` ✪ **2€**\n> `Ticket Bot (Panel/Commandes)` ✪ **4€**\n> `Music` ✪ **5€**\n> `Manage Invite` ✪ **8€**")
            .addField("➤ Custom Bot", "Vous pouvez commander un bot custom, **le prix sera en fonction de la commande**.")
            .setColor("RED")
            .setFooter("© Copyright 2022 - Wuzax - Community")
            interaction.channel.send({embeds: [embed], components: [shopButton]})
            interaction.reply({content: "Message envoyé !", ephemeral: true })
        }
        if(interaction.commandName === "close") {
            if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: ":x: | Tu n'a pas la permissions", ephemeral: true})
            if(interaction.channel.name.includes("boutique")) {
                await interaction.channel.delete()
            } else {
                interaction.reply({content: ":x: | Ce n'est pas un channel boutique", ephemeral: true})
            }
        }
        if(interaction.commandName === "emit") {
            let event = interaction.options.getString("event")
            if(event === "guildMemberAdd") {
                client.emit("guildMemberAdd", interaction.member)
                interaction.reply({content: `${event} a bien été émit !`, ephemeral: true })
            } else if(event === "guildMemberRemove") {
                client.emit("guildMemberRemove", interaction.member)
                interaction.reply({content: `${event} a bien été émit !`, ephemeral: true })
            }
        }
    }
    // BUTTONS REACTIONS
    if(interaction.isButton()) {
        //Verify Button
        if(interaction.customId === "verify") {
            if(interaction.member.roles.cache.some(role => role.id === "868564194235142147")) {
                await interaction.reply({content: ":x: | Tu es deja vérifier !", ephemeral: true})
                return;
            } else {
                await interaction.member.roles.add("868564194235142147")
                await interaction.reply({content: ":white_check_mark: | Tu es désormais verifier !", ephemeral: true})
                let logsC = interaction.guild.channels.cache.get("868564195350806602")
                logsC.send({embeds: [new MessageEmbed().setAuthor(interaction.user.tag, interaction.user.avatarURL()).addFields({
                    name: "✅ Verification",
                    value: `**${interaction.user.tag}** (${interaction.user.id}) vient de passer la vérification !`
                }).setFooter(interaction.guild.name, interaction.guild.iconURL()).setTimestamp().setColor("GREEN")]})
            }
        }
        /*                  Roles Button                    */
        //Giveaway
        if(interaction.customId === "giveaway") {
            if(interaction.member.roles.cache.some(role => role.id === "990563902343487528")) {
                await interaction.member.roles.remove("990563902343487528")
                await interaction.reply({content: "🎉 | Tu avais déjà le rôle notification des Giveaway, je te les donc enlever !", ephemeral: true})
                let logsC = interaction.guild.channels.cache.get("868564195350806602")
                logsC.send({embeds: [new MessageEmbed().setAuthor(interaction.user.tag, interaction.user.avatarURL()).addFields({
                    name: "🎉 Role Giveaway",
                    value: `**${interaction.user.tag}** (${interaction.user.id}) vient de s'enlever le role giveaway !`
                }).setFooter(interaction.guild.name, interaction.guild.iconURL()).setTimestamp().setColor("RED")]})
            } else {
                await interaction.member.roles.add("990563902343487528")
                await interaction.reply({content: "🎉 | Tu viens d'obtenir le rôle notification des Giveaway !", ephemeral: true})
                let logsC = interaction.guild.channels.cache.get("868564195350806602")
                logsC.send({embeds: [new MessageEmbed().setAuthor(interaction.user.tag, interaction.user.avatarURL()).addFields({
                    name: "🎉 Role Giveaway",
                    value: `**${interaction.user.tag}** (${interaction.user.id}) vient de s'ajouter le role giveaway !`
                }).setFooter(interaction.guild.name, interaction.guild.iconURL()).setTimestamp().setColor("GREEN")]})
            }
        }
        //Annonce
        if(interaction.customId === "annonce") {
            if(interaction.member.roles.cache.some(role => role.id === "990564185291235359")) {
                await interaction.member.roles.remove("990564185291235359")
                await interaction.reply({content: "📌 | Tu avais déjà le rôle notification des Annonces, je te les donc enlever !", ephemeral: true})
                let logsC = interaction.guild.channels.cache.get("868564195350806602")
                logsC.send({embeds: [new MessageEmbed().setAuthor(interaction.user.tag, interaction.user.avatarURL()).addFields({
                    name: "📌 Role Annonce",
                    value: `**${interaction.user.tag}** (${interaction.user.id}) vient de s'enlever le role annonce !`
                }).setFooter(interaction.guild.name, interaction.guild.iconURL()).setTimestamp().setColor("RED")]})
            } else {
                await interaction.member.roles.add("990564185291235359")
                await interaction.reply({content: "📌 | Tu viens d'obtenir le rôle notification des Annonces !", ephemeral: true})
                let logsC = interaction.guild.channels.cache.get("868564195350806602")
                logsC.send({embeds: [new MessageEmbed().setAuthor(interaction.user.tag, interaction.user.avatarURL()).addFields({
                    name: "📌 Role Annonce",
                    value: `**${interaction.user.tag}** (${interaction.user.id}) vient de s'ajouter le role annonce !`
                }).setFooter(interaction.guild.name, interaction.guild.iconURL()).setTimestamp().setColor("GREEN")]})
            }
        }
        //Ticket Button
        if(interaction.customId === "ticket.panel") {
            if(interaction.guild.channels.cache.find((c) => c.name === `ticket-${interaction.user.discriminator}`)) return interaction.reply({content: ":x: | Vous avez déja un ticket ouvert !", ephemeral: true })
            let channel = await interaction.guild.channels.create(`ticket - ${interaction.user.discriminator}`, {
                parent: "992548603409211442",
                reason: `${interaction.user.tag} créé un ticket`,
                type: "GUILD_TEXT"
            });
            if(bdd["statistique"][interaction.user.id]) {
                bdd["statistique"][interaction.user.id]++
                await savebdd()
            } else {
                bdd["statistique"][interaction.user.id] = 1
                await savebdd()
            }
            bdd["ticket"][channel.name] = {}
            bdd["ticket"][channel.name]["user"] = interaction.user.id
            await savebdd()
            channel.permissionOverwrites.edit(interaction.user.id, {
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            }, `ticket créé par ${interaction.user.tag}`)
            channel.permissionOverwrites.edit(interaction.guild.id, {
                VIEW_CHANNEL: false
            }, `ticket créé par ${interaction.user.tag}`)
            channel.permissionOverwrites.edit("868564194537119826", {
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            }, `ticket créé par ${interaction.user.tag}`)
            let cID = channel.id
            let ticket_close_button = new MessageButton().setLabel("Close").setCustomId(`ticket.close.${cID}`).setStyle("DANGER").setEmoji("⛔")
            let ticket_claim_button = new MessageButton().setLabel("Claim").setCustomId(`ticket.claim.${cID}`).setStyle("SECONDARY").setEmoji("📨")
            let ticket_unclaim_button = new MessageButton().setLabel("Unclaim").setCustomId(`ticket.unclaim.${cID}`).setStyle("SECONDARY").setEmoji("📨")
            let ticket_close = new MessageActionRow()
                .addComponents([ticket_close_button, ticket_claim_button, ticket_unclaim_button])
            let embed = new MessageEmbed()
            .setTitle("Wuzax | Ticket")
            .setDescription(`Bienvenue ${interaction.user} dans votre ticket !\n\nMerci de décrire un maximum la raison du pourquoi vous créé ce ticket.\nPour fermer ce ticket cliquer sur le bouton \`⛔ Close\``)
            .setFooter("© Copyright 2022 - Wuzax - Community")
            .setColor("WHITE")
            channel.send({content: `${interaction.user} voici votre ticket !`, embeds: [embed], components: [ticket_close]})
            interaction.reply({content: `Votre ticket a été créé <#${cID}>`, ephemeral: true })
        } else
        if(interaction.customId === `ticket.claim.${interaction.channel.id}`) {
            if(interaction.channel.name.includes("claimed")) return interaction.reply({content: "Ticket deja claim !", ephemeral: true })
            interaction.reply({content: `Vous avez bien claim le ticket ${interaction.channel.name} !`, ephemeral: true })
            interaction.channel.send({content: `Votre ticket a été claim par ${interaction.user} !`})
            interaction.channel.permissionOverwrites.edit("868564194537119826", { VIEW_CHANNEL: false })
            interaction.channel.permissionOverwrites.edit(interaction.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true })
            interaction.channel.setName(`claimed-${interaction.channel.name}`)
        } else
        if(interaction.customId === `ticket.unclaim.${interaction.channel.id}`) {
            interaction.reply({content: `Vous avez bien unclaim le ticket ${interaction.channel.name} !`, ephemeral: true })
            interaction.channel.send({content: `Votre ticket a été unclaim !`})
            interaction.channel.permissionOverwrites.edit("868564194537119826", { VIEW_CHANNEL: true, SEND_MESSAGES: true })
            interaction.channel.permissionOverwrites.edit(interaction.user.id, { VIEW_CHANNEL: null })
            interaction.channel.setName(interaction.channel.name.replace("claimed", ""))
        } else
        if(interaction.customId === `ticket.close.${interaction.channel.id}`) {
            let yesButton = new MessageButton().setLabel("Oui").setCustomId(`ticket.yes.${interaction.channel.id}`).setStyle("SUCCESS").setEmoji("✅")
            let noButton = new MessageButton().setLabel("Non").setCustomId(`ticket.no.${interaction.channel.id}`).setStyle("DANGER").setEmoji("❌")
            let confirmButtons = new MessageActionRow()
                .addComponents([yesButton, noButton])
            let confirmEmbed = new MessageEmbed()
            .setTitle("Wuzax | Ticket")
            .setDescription(`${interaction.user} êtes vous sur de vouloir fermer ce ticket ?\nCliquer sur \`✅ Oui\` pour accepter\nCliquer sur \`❌ Non\` pour refusé`)
            .setFooter("© Copyright 2022 - Wuzax - Community")
            .setColor("WHITE")
            interaction.reply({embeds: [confirmEmbed], components: [confirmButtons], ephemeral: true })
        } else
        if(interaction.customId === `ticket.no.${interaction.channel.id}`) {
            interaction.reply({content: "✅ | Annulation de la supprésion du ticket !", ephemeral: true })
        } else

        if(interaction.customId === `ticket.yes.${interaction.channel.id}`) {
            if(interaction.channel.name.includes("claimed")) {
                interaction.channel.setName(interaction.channel.name.replace("claimed", ""))
            }
            setTimeout(async () => {
                if(bdd["ticket"][interaction.channel.name]) {
                    let userID = bdd["ticket"][interaction.channel.name]["user"]
                    let user = interaction.guild.members.cache.get(userID)
                    const attachments = await createTranscript(interaction.channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${interaction.channel.name} Transcript.html`,
                    })
                    let EMBED = new MessageEmbed()
                    .setColor("WHITE")
                    .setTitle(`${interaction.channel.name} - Fermeture`)
                    .setDescription(`Le ticket **${interaction.channel.name}** de **${user.user.tag}** a été fermé par **${interaction.user.tag}** !`)
                    .setFooter("© Copyright 2022 - Wuzax - Community")
                    let Message = await interaction.guild.channels.cache.get("868564195350806602").send({
                        embeds: [
                            EMBED
                        ],
                        files: [attachments]
                    })
        
                    await interaction.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor("WHITE")
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTitle("Wuzax | Ticket")
                            .setDescription("Ce ticket a été fermé.\nLe canal sera supprimé dans 5 secondes.")
                            .addField("Transcript", `Le transcript a été sauvegarder [Transcript](${Message.url})`)
                            .setFooter("© Copyright 2022 - Wuzax - Community")
                        ]
                    })
                    bdd["ticket"] = {}
                    await savebdd()
                    setTimeout(async () => {
                        await interaction.channel.delete(`Ticket fermé par ${interaction.user.tag}`)
                    }, 5000)
                }
            }, 2000)
        } else
        //SHOP
        if(interaction.customId === "shop.cmd") {
            if(interaction.guild.channels.cache.find((c) => c.name === `boutique-${interaction.user.username}`)) return interaction.reply({content: ":x: | Vous avez déja une commande d'ouverte !", ephemeral: true })
            let channel = await interaction.guild.channels.create(`boutique - ${interaction.user.username}`, {
                parent: "993816901497126973",
                reason: `${interaction.user.tag} créé une commande`,
                type: "GUILD_TEXT"
            });
            channel.permissionOverwrites.edit(interaction.user.id, {
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            }, `commande créé par ${interaction.user.tag}`)
            channel.permissionOverwrites.edit(interaction.guild.id, {
                VIEW_CHANNEL: false
            }, `commande créé par ${interaction.user.tag}`)
            let cID = channel.id
            let code = new MessageButton().setCustomId("shop.code.panel").setLabel("Codes").setStyle("PRIMARY").setEmoji("⚙️")
            let custom = new MessageButton().setCustomId("shop.custom.panel").setLabel("Custom").setStyle("PRIMARY").setEmoji("🛠️")
            let button = new MessageActionRow()
                .addComponents([code, custom])
            let embed = new MessageEmbed()
            .setTitle("Wuzax | Boutique")
            .setDescription(`Bienvenue ${interaction.user} dans votre commande !\n\nMerci de chosir si vous souhaitez commander un code ou un bot custom en cliquant sur les boutton:\n\`⚙️ Codes\` pour choisir de commandes un codes\n\`🛠️ Custom\` pour soumettre une demande de bot custom\nPour fermer cette commande cliquer sur le bouton \`⛔ Close\``)
            .setFooter("© Copyright 2022 - Wuzax - Community")
            .setColor("WHITE")
            channel.send({content: `${interaction.user} voici votre commande !`, embeds: [embed], components: [button]})
            interaction.reply({content: `Votre commande a été créé <#${cID}>`, ephemeral: true })
        }
        if(interaction.customId === "shop.custom.panel") {
            await interaction.channel.bulkDelete(1)
            let embed = new MessageEmbed()
            .setTitle("Wuzax | Boutique")
            .addField("Author", `${interaction.user.tag} (${interaction.user.id})`)
            .addField("Commande", "Custom")
            .setFooter("© Copyright 2022 - Wuzax - Community")
            .setColor("WHITE")
            await interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            await interaction.reply({content: "Veuillez décrire un maximum le bot que vous souhaitez, en cas de problème ou de question un administrateur vous en fera part!", ephemeral: true })
        }
        if(interaction.customId === "shop.code.panel") {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                    .setCustomId("shop.code.select")
                    .setPlaceholder("Choisir un code")
                    .addOptions([
                        {
                            label: "Reaction Role (Button/Reaction) ✪ 1€",
                            description: "Permet d'ajouté un roles en cliquant sur un boutton",
                            value: "code.reactrole"
                        },
                        {
                            label: "Giveaway ✪ 2€",
                            description: "Permet de faire un giveaway (complet)",
                            value: "code.giveaway"
                        },
                        {
                            label: "Economy Bot ✪ 2€",
                            description: "Permet de faire un bot d'economie",
                            value: "code.economy",
                        },
                        {
                            label: "Ticket Bot (Panel/Commandes) ✪ 4€",
                            description: "Permet de faire un bot de ticket",
                            value: "code.ticket"
                        },
                        {
                            label: "Music ✪ 5€",
                            description: "Permet de faire un bot de musique",
                            value: "code.music"
                        },
                        {
                            label: "Manage Invite ✪ 8€",
                            description: "Permet de gérer les invites",
                            value: "code.invite"
                        }
                    ])
                )
            let embed = new MessageEmbed()
            .setTitle("Wuzax | Codes")
            .setDescription("Merci de choisir un code en cliquant sur le boutton correspondant")
            .setFooter("© Copyright 2022 - Wuzax - Community")
            .setColor("WHITE")
            interaction.reply({content: "Veuillez patienter...", ephemeral: true })
            setTimeout(() => {
                interaction.channel.send({embeds: [embed], components: [row]})
            }, 500)
        }
    }
    if(interaction.isSelectMenu()) {
        if(interaction.customId === "shop.code.select") {
            if(interaction.values == "code.reactrole") {
                await interaction.channel.bulkDelete(3)
                let embed = new MessageEmbed()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addField("Author", `${interaction.user.tag} (${interaction.user.id})`)
                .addField("Commande", "Code")
                .addField("Code", "Reaction Role")
                .addField("Prix", "1€")
                .setFooter("© Copyright 2022 - Wuzax - Community")
                .setColor("WHITE")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
            if(interaction.values == "code.giveaway") {
                await interaction.channel.bulkDelete(3)
                let embed = new MessageEmbed()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addField("Author", `${interaction.user.tag} (${interaction.user.id})`)
                .addField("Commande", "Code")
                .addField("Code", "Giveaway")
                .addField("Prix", "2€")
                .setFooter("© Copyright 2022 - Wuzax - Community")
                .setColor("WHITE")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
            if(interaction.values == "code.economy") {
                await interaction.channel.bulkDelete(3)
                let embed = new MessageEmbed()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addField("Author", `${interaction.user.tag} (${interaction.user.id})`)
                .addField("Commande", "Code")
                .addField("Code", "Economy Bot")
                .addField("Prix", "2€")
                .setFooter("© Copyright 2022 - Wuzax - Community")
                .setColor("WHITE")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
            if(interaction.values == "code.ticket") {
                await interaction.channel.bulkDelete(3)
                let embed = new MessageEmbed()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addField("Author", `${interaction.user.tag} (${interaction.user.id})`)
                .addField("Commande", "Code")
                .addField("Code", "Ticket Bot")
                .addField("Prix", "4€")
                .setFooter("© Copyright 2022 - Wuzax - Community")
                .setColor("WHITE")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
            if(interaction.values == "code.music") {
                await interaction.channel.bulkDelete(3)
                let embed = new MessageEmbed()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addField("Author", `${interaction.user.tag} (${interaction.user.id})`)
                .addField("Commande", "Code")
                .addField("Code", "Music")
                .addField("Prix", "5€")
                .setFooter("© Copyright 2022 - Wuzax - Community")
                .setColor("WHITE")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
            if(interaction.values == "code.invite") {
                await interaction.channel.bulkDelete(3)
                let embed = new MessageEmbed()
                .setTitle("Wuzax | Codes")
                .setDescription(`Veuillez patienter un administateur.`)
                .addField("Author", `${interaction.user.tag} (${interaction.user.id})`)
                .addField("Commande", "Code")
                .addField("Code", "Manage Invite")
                .addField("Prix", "8€")
                .setFooter("© Copyright 2022 - Wuzax - Community")
                .setColor("WHITE")
                interaction.channel.send({content: "<@&994265592687251476>", embeds: [embed]})
            }
        }
    }
})
//Login
client.login(process.env.TOKEN)

function savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if(err) console.log("erreur survenue")
    })
}