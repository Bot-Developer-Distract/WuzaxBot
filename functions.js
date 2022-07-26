const { MessageEmbed } = require("discord.js")

module.exports = {
    sendLogs(guild, type, description) {
        let embed = new MessageEmbed()
        .setTitle(`${guild.name} | ${type} Logs`)
        .setFooter("Wuzax | 2022")
        .setDescription(description)
        .setColor("RED")
        guild.channels.cache.get("868564195350806602").send({embeds: [embed]})
    }
}