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
        let buttons = new MessageActionRow()
            .addComponents([button])
        let embed = new MessageEmbed()
        .setTitle(`😀 Bienvenue sur ${message.guild.name}`)
        .setDescription("Ce serveur est le serveur communautaire de Wuzax\n\nPour vous verifiez veuillez cliquer sur le boutton `✅ Verifier` !")
        .setFooter("Wuzax | © 2022", message.guild.iconURL())
        message.channel.send({embeds: [embed], components: [buttons]})
    }
})

client.on("interactionCreate", async interaction => {
    if(interaction.isButton()) {
        if(interaction.customId === "verify") {
            if(interaction.member.roles.cache.some(role => role.id === "868564194235142147")) {
                await interaction.reply({content: ":x: | Tu es deja vérifier !", ephemeral: true})
                return;
            } else {
                await interaction.member.roles.add("868564194235142147")
                await interaction.reply({content: ":white_check_mark: | Tu es désormais verifier !", ephemeral: true})
            }
        }
    }
})

client.login(process.env.TOKEN)
