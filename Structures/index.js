const { Client, Partials, Collection, EmbedBuilder, ThreadManager, ThreadChannel } = require("discord.js")
const ms = require("ms")
const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")
const { Captcha } = require("discord.js-captcha");
require("dotenv").config()
require("../Structures/Handlers/Database")
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "users", "roles"] },
    rest: { timeout: ms("1m") }
})


client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.select = new Collection();
const captcha = new Captcha(client, {
    roleID: "868564194235142147",
    sendToTextChannel: false,
    addRoleOnSuccess: true,
    kickOnFailure: true,
    caseSensitive: true,
    attempts: 3,
    timeout: 60000,
    showAttemptCount: true
})
client.captcha = captcha

client.on("guildMemberAdd", (member) => {
    captcha.present(member)
})

captcha.on("prompt", async(data) => {
    if(!data.member.guild.id === "868564194235142145") return;
    let logsC = client.channels.cache.get("868564195350806602")
    let embed = new EmbedBuilder()
    .setTitle("Wuzax | Captcha System")
    .setDescription(`Joined at <t:${parseInt(data.member.joinedTimestamp / 1000)}:R>`)
    .setColor("White")
    .addFields([
        { name: `User`, value: `**\`•\` Username**: ${data.member.user.username}\n**\`•\` Tag**: ${data.member.user.username}#${data.member.user.discriminator}\n**\`•\` ID**: ||${data.member.user.id}||\n**\`•\` Bot**: ${data.member.user.bot ? "Oui" : "Non"}`},
        { name: "Captcha", value: `**\`•\` Code**: ||${data.captchaText}||\n**\`•\` Role**: <@&${data.captchaOptions.roleID}>`}
    ])
    .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
    logsC.send({embeds: [embed]})
    await logsC.send({
        embeds: [new EmbedBuilder()
            .setTitle("Wuzax | Logs System")
            .addFields({
                name: "User",
                value: 
                `
                **\`•\` Username:** ${data.member.user.username}
                **\`•\` Tag:** ${data.member.user.tag}
                **\`•\` Bot:** ${data.member.user.bot ? "Oui" : "Non"}
                **\`•\` Account Date:** <t:${parseInt(data.member.user.createdTimestamp / 1000)}:R>
                **\`•\` ID:** ||${data.member.id}||
                `
            })
            .setImage(data.member.user.banner ? data.member.user.banner : data.member.user.avatarURL({size: 1024}))
            .setThumbnail(data.member.user.avatarURL({size: 1024}))
            .setColor("Green")
        ]
    })
})

captcha.on("success", async data => {
    if(!data.member.guild.id === "868564194235142145") return;
    let logsC = client.channels.cache.get("868564195350806602")
    let embed = new EmbedBuilder()
    .setTitle("Wuzax | Captcha System")
    .setDescription(`Joined at <t:${parseInt(data.member.joinedTimestamp / 1000)}:R>`)
    .setColor("Green")
    .addFields([
        { name: `User`, value: `**\`•\` Username**: ${data.member.user.username}\n**\`•\` Tag**: ${data.member.user.username}#${data.member.user.discriminator}\n**\`•\` ID**: ||${data.member.user.id}||\n**\`•\` Bot**: ${data.member.user.bot ? "Oui" : "Non"}`},
        { name: "Captcha", value: `**\`•\` Response Code**: ||${data.response}||\n**\`•\` Code**: ||${data.captchaText}||\n**\`•\` Role**: <@&${data.captchaOptions.roleID}>\n**\`•\` Attempts**: ${data.attempts}`}
    ])
    .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
    logsC.send({embeds: [embed]})
    await client.channels.cache.get("991780665324474548").send({
        embeds: [
            new EmbedBuilder()
            .setColor("#36393F")
            .setDescription(`Bienvenue ${data.member.user.username} sur ${data.member.guild.name}, tu es le ${data.member.guild.memberCount} Membres !`)
        ]
    })
})

captcha.on("failure", data => {
    if(!data.member.guild.id === "868564194235142145") return;
    let logsC = client.channels.cache.get("868564195350806602")
    let embed = new EmbedBuilder()
    .setTitle("Wuzax | Captcha System")
    .setDescription(`Joined at <t:${parseInt(data.member.joinedTimestamp / 1000)}:R>`)
    .setColor("Red")
    .addFields([
        { name: `User`, value: `**\`•\` Username**: ${data.member.user.username}\n**\`•\` Tag**: ${data.member.user.username}#${data.member.user.discriminator}\n**\`•\` ID**: ||${data.member.user.id}||\n**\`•\` Bot**: ${data.member.user.bot ? "Oui" : "Non"}`},
        { name: "Captcha", value: `**\`•\` Response Code**: ||${data.response}||\n**\`•\` Code**: ||${data.captchaText}||\n**\`•\` Role**: <@&${data.captchaOptions.roleID}>\n**\`•\` Attempts**: ${data.attempts}`}
    ])
    .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
    logsC.send({embeds: [embed]})
})

captcha.on("timeout", data => {
    if(!data.member.guild.id === "868564194235142145") return;
    let logsC = client.channels.cache.get("868564195350806602")
    let embed = new EmbedBuilder()
    .setTitle("Wuzax | Captcha System")
    .setDescription(`Joined at <t:${parseInt(data.member.joinedTimestamp / 1000)}:R>`)
    .setColor("DarkPurple")
    .addFields([
        { name: `User`, value: `**\`•\` Username**: ${data.member.user.username}\n**\`•\` Tag**: ${data.member.user.username}#${data.member.user.discriminator}\n**\`•\` ID**: ||${data.member.user.id}||\n**\`•\` Bot**: ${data.member.user.bot ? "Oui" : "Non"}`},
        { name: "Captcha", value: `**\`•\` Response Code**: ||${data.response ? data.response : "No Response"}||\n**\`•\` Code**: ||${data.captchaText}||\n**\`•\` Role**: <@&${data.captchaOptions.roleID}>\n**\`•\` Attempts**: ${data.attempts}`}
    ])
    .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
    logsC.send({embeds: [embed]})
})

captcha.on("answer", data => {
    if(!data.member.guild.id === "868564194235142145") return;
    let logsC = client.channels.cache.get("868564195350806602")
    let embed = new EmbedBuilder()
    .setTitle("Wuzax | Captcha System")
    .setDescription(`Joined at <t:${parseInt(data.member.joinedTimestamp / 1000)}:R>`)
    .setColor("Orange")
    .addFields([
        { name: `User`, value: `**\`•\` Username**: ${data.member.user.username}\n**\`•\` Tag**: ${data.member.user.username}#${data.member.user.discriminator}\n**\`•\` ID**: ||${data.member.user.id}||\n**\`•\` Bot**: ${data.member.user.bot ? "Oui" : "Non"}`},
        { name: "Captcha", value: `**\`•\` Response Code**: ||${data.response}||\n**\`•\` Code**: ||${data.captchaText}||\n**\`•\` Role**: <@&${data.captchaOptions.roleID}>\n**\`•\` Attempts**: ${data.attempts}`}
    ])
    .setFooter({text: "© Copyright 2022 - Wuzax - Community"})
    logsC.send({embeds: [embed]})
})

const Handlers = ["Events", "Errors", "Commands", "Buttons", "Modals"]

Handlers.forEach(handler => {

    require(`./Handlers/${handler}`)(client, PG, Ascii)

})

module.exports = client

client.on("guildMemberRemove", async(member) => {
    await client.channels.cache.get("991780665324474548").send({
        embeds: [
            new EmbedBuilder()
            .setColor("#36393F")
            .setDescription(`Dommage ${member.user.tag} vient de quitté ${member.guild.name}, nous somme plus que ${member.guild.memberCount} Membres !`)
        ]
    })
    let logsC = client.channels.cache.get("868564195350806602")
    logsC.send({
        embeds: [new EmbedBuilder()
            .setTitle("Wuzax | Logs System")
            .addFields({
                name: "User",
                value: 
                `
                **\`•\` Username:** ${member.user.username}
                **\`•\` Tag:** ${member.user.tag}
                **\`•\` Bot:** ${member.user.bot ? "Oui" : "Non"}
                **\`•\` Account Date:** <t:${parseInt(member.user.createdTimestamp / 1000)}:R>
                **\`•\` ID:** ||${member.id}||
                `
            })
            .setImage(member.user.banner ? member.user.banner : member.user.avatarURL({size: 1024}))
            .setThumbnail(member.user.avatarURL({size: 1024}))
            .setColor("Red")
        ]
    })
})

client.login(process.env.TOKEN)