const { Message, Client, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { Perms } = require("../../Structures/Validation/Permissions")

module.exports = {
    name: "messageCreate",
    id: "messageCreate",
    /**
     * 
     * @param {Message} message
     * @param {Client} client 
     */
    async execute(message, client) {
        if(message.channel.id === "1003717856950763590") {
            setTimeout(async() => {
                if(message.embeds[0].title === "✅ CAPTCHA Solved!") {
                    await message.channel.bulkDelete(20)
                    let logsC = client.channels.cache.get("868564195350806602")
                    logsC.send({
                        embeds: [new EmbedBuilder()
                            .setTitle("Wuzax | Logs System")
                            .addFields({
                                name: "User",
                                value: `I delete messages in <#1003717856950763590> !`
                            })
                            .setColor("White")
                        ]
                    })
                }
            }, 20000)
        } else if(message.channel.id === "1003353034883076096") {
            if(message.author.bot) return;
            let suggestions = message.content
            let embed = new EmbedBuilder()
            .setTitle("Wuzax Community - Suggestions")
            .addFields([
                { name: "Nom", value: `<@${message.author.id}> - ${message.author.tag}`},
                { name: "Suggestions", value: `${message.content}`}
            ])
            .setColor("White")
            try {
                await message.channel.send({embeds: [embed], components: [new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId(`suggest-yes`)
                    .setLabel("Oui")
                    .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                    .setCustomId("suggest-no")
                    .setLabel("Non")
                    .setStyle(ButtonStyle.Danger)
                )]}).then(async(msg) => {
                    await msg.react("✅")
                    await msg.react("⏸️")
                    await msg.react("❌")
                })
                await message.delete()
            } catch(e) {
                console.log(e)
            }
        }
    }
}