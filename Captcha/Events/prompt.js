module.exports = async(client) => {
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
}