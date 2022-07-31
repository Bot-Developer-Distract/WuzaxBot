const { Client, GuildMember, EmbedBuilder } = require("discord.js")

module.exports = {
    name: "guildMemberAdd",
    id: "guildMemberAdd",

    /**
    * @param {Client} client
    * @param {GuildMember} member
    */
    async execute(client, member) {
        await client.channels.cache.get("991780665324474548").send({
            embeds: [
                new EmbedBuilder()
                .setColor("#36393F")
                .setDescription(`Bienvenue ${member} sur ${member.guild.name}, tu es le ${member.guild.memberCount} Membres !`)
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
                .setColor("Green")
            ]
        })
    }
}