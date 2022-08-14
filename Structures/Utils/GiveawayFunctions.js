const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");

function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return [...new Set(shuffled.slice(0, num))];
}

async function endGiveaway(message, DB, reroll = false) {
    const data = await DB.findOne({
        GuildID: message.guild.id,
        MessageID: message.id
    });
    if (!data) return;

    if (data.Ended === true && !reroll) return;
    if (data.Paused === true) return;

    let winnerIdArray = [];
    if (data.Entered.length > data.Winners) {
        winnerIdArray.push(...getMultipleRandom(data.Entered, data.Winners));
        while (winnerIdArray.length < data.Winners) winnerIdArray.push(getMultipleRandom(data.Entered, data.Winners - winnerIdArray.length));
    } else winnerIdArray.push(...data.Entered);

    const disableButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("giveaway-join")
            .setEmoji("🎉")
            .setStyle(ButtonStyle.Success)
            .setLabel("Rejoindre ici")
            .setDisabled(true)
    );
    
    const endGiveawayEmbed = new EmbedBuilder()
        .setColor("NotQuiteBlack")
        .setTitle(`${data.Prize}`)
        .setDescription(`**Créé par**: <@${data.HostedBy}>\n**Gagnant(s)**: ${winnerIdArray.map((user) => `<@${user}>`).join(", ") || "None"} \n**Fini**: <t:${data.EndTime}:R> (<t:${data.EndTime}>)`)
        .setTimestamp(data.EndTime * 1000);
    
    await DB.findOneAndUpdate({
        GuildID: data.GuildID,
        ChannelID: data.ChannelID,
        MessageID: message.id
    }, { Ended: true });
    
    await message.edit({ content: "🎊 **Giveaway Terminée** 🎊", embeds: [endGiveawayEmbed], components: [disableButton] });
    message.reply({ content: winnerIdArray.length > 0 ? `Bien jouer ${winnerIdArray.map((user) => `<@${user}>`).join(", ")}! Vous avez gagnée **${data.Prize}**` : "Aucun gagnant n'a été désigné car personne n'a participé au concours." });
}

module.exports = {
    endGiveaway
};