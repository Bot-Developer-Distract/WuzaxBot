const { Captcha } = require("discord.js-captcha");
module.exports = async(client) => {
    const captcha = new Captcha(client, {
        roleID: "868564194235142147",
        sendToTextChannel: false,
        addRoleOnSuccess: true,
        kickOnFailure: true,
        caseSensitive: true,
        attempts: 3,
        timeout: 60000,
        showAttemptCount: true,
        channelID: "1003717856950763590"
    })
    const CaptchaH = ["answer", "failure", "prompt", "success", "timeout"]
    CaptchaH.forEach(e => {
        require(`./Events/${e}`)(client, captcha)
    })
    client.on("guildMemberAdd", (member) => {
        captcha.present(member)
    })
}