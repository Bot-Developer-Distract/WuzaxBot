const { MessageEmbed } = require("discord.js")
module.exports = (client) => {
    console.log("Logged Logs Module")
    client.on("guildChannelPermissionsUpdate", (channel, oldPermissions, newPermissions) => {
        logsEmbed(channel.guild, "Channel", `Les permissions du channel ${channel.name}(<#${channel.id}>) ont été modifié!`)
    });

    client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {
        logsEmbed(channel.guild, "Channel", `Le topic du channel ${channel.name}(<#${channel.id}>) a été modifié!\n**Ancien Topic:**\n${oldTopic ? oldTopic : "Pas d'ancien Topic"}\n**Nouveau Topic:**\n${newTopic ? newTopic : "Pas de nouveau Topic"}`)
    });

    client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {
        logsEmbed(oldChannel.guild, "Channel", `Le channel ${oldChannel.name}(<#${oldChannel.id}>) a été modifié mais je n'ai pas trouvé quoi`)
    });

    client.on("guildMemberBoost", (member) => {
        logsEmbed(member.guild, "Member", `Le membre ${member.user.tag}(<@${member.user.id}> - ${member.user.id}) vient de commencé a booster le serveur`)
    });

    client.on("guildMemberUnboost", (member) => {
        logsEmbed(member.guild, "Member", `Le membre ${member.user.tag}(<@${member.user.id}> - ${member.user.id}) vient d'arrété de booster le serveur`)
    });

    client.on("guildMemberRoleAdd", (member, role) => {
        logsEmbed(member.guild, "Member", `Le membre ${member.user.tag}(<@${member.user.id}> - ${member.user.id}) vient d'obtenir le role ${role.name}(<@&${role.id}> - ${role.id})`)
    });

    client.on("guildMemberRoleRemove", (member, role) => {
        logsEmbed(member.guild, "Member", `Le membre ${member.user.tag}(<@${member.user.id}> - ${member.user.id}) vient de perdre le role ${role.name}(<@&${role.id}> - ${role.id})`)
    });

    client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
        logsEmbed(member.guild, "Member", `Le nom du membre ${member.user.tag}(<@${member.user.id}> - ${member.user.id}) a été modifié!\n**Ancien Nom:**\n\`\`\`${oldNickname}\`\`\`\n**Ancien Nom:**\n\`\`\`${newNickname}\`\`\``)
    });

    client.on("guildMemberEntered", (member) => {
        logsEmbed(member.guild, "Member", `Le membre ${member.user.tag}(<@${member.user.id}> - ${member.user.id}) vient de passer la vérification`)
    });

    client.on("unhandledGuildMemberUpdate", (oldMember, newMember) => {
        logsEmbed(member.guild, "Member", `Le membre ${oldMember.user.tag}(<@${oldMember.user.id}> - ${oldMember.user.id}) a fait/modifier quelque chose mais je n'ai pas trouvé quoi`)
    });
}

function logsEmbed(guild, type, description) {
    let embed = new MessageEmbed()
    .setTitle(`${guild.name} | ${type} Logs`)
    .setFooter("Wuzax | 2022")
    .setDescription(description)
    .setColor("RED")
    guild.channels.cache.get("868564195350806602").send({embeds: [embed]})
}