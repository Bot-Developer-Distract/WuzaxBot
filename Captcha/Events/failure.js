module.exports = async(client) => {
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
}