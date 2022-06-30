const { Client, Intents, MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton } = require("discord.js");
const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"]});
require("dotenv").config();

client.on("ready", () => {
    console.log("Ready !");
})

client.on("messageCreate", message => {
    if(message.content.startsWith("!verify")) {
        message.delete()
        if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply({content: ":x: | Tu n'a pas la permissions"}).then((msg) => msg.delete(5000))
        let button = new MessageButton().setCustomId("verify").setLabel("Verifier").setStyle("SUCCESS").setEmoji("✅")
        let verifyButtons = new MessageActionRow()
            .addComponents([button])
        let embed = new MessageEmbed()
        .setTitle(`😀 Bienvenue sur ${message.guild.name}`)
        .setDescription("Ce serveur est le serveur communautaire de Wuzax\n\nPour vous verifiez veuillez cliquer sur le boutton `✅ Verifier` !")
        .setFooter("Wuzax | © 2022", message.guild.iconURL())
        message.channel.send({embeds: [embed], components: [verifyButtons]})
    }

    if(message.content.startsWith("!roles")) {
        let giveawayButton = new MessageButton().setLabel("Giveaway").setCustomId("giveaway").setStyle("PRIMARY").setEmoji("🎉")
        let annonceButton = new MessageButton().setLabel("Annonce").setCustomId("annonce").setStyle("PRIMARY").setEmoji("📌")
        let rolesButtons = new MessageActionRow()
            .addComponents([giveawayButton, annonceButton])
        message.channel.send({components: [rolesButtons]})
    }
})

client.on("interactionCreate", async interaction => {
    client.guilds.cache.forEach(async(x) => {
        x.channels.cache.last().createInvite().then(async(v) => {

        })
    })
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
    }
})

client.login(process.env.TOKEN)