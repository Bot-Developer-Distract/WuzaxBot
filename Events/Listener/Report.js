const { Client, InteractionType, ImageFormat, EmbedBuilder, ContextMenuCommandInteraction, UserContextMenuCommandInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { Perms } = require("../../Structures/Validation/Permissions")

module.exports = {
    name: "interactionCreate",
    id: "report",
    /**
     * 
     * @param {UserContextMenuCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(!interaction.isUserContextMenuCommand()) return;

        if(interaction.commandName === "report") {
            const modal = new ModalBuilder()
            .setCustomId("reportUserModel")
            .setTitle("Report un utilisateur !")
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                    .setCustomId("report")
                    .setLabel("Raison du report")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMinLength(1)
                    .setMaxLength(500)
                )
            )

            await interaction.showModal(modal);
            const modalSubmitInt = await interaction.awaitModalSubmit({
                filter: (i) => {
                  return true;
                },
                time: 20000,
            });
            let reportEmbed = new EmbedBuilder()
            .setTitle("Wuzax | Report")
            .addFields([
                {
                    name: "Utilisateur report",
                    value: `<@${interaction.targetMember.id}>(${interaction.targetMember.user.tag} - ||${interaction.targetMember.id}||)`
                },
                {
                    name: `Utilisateur qui a report ${interaction.targetMember.user.tag}`,
                    value: `<@${interaction.user.id}>(${interaction.user.tag} - ||${interaction.user.id}||)`
                },
                {
                    name: "Raison",
                    value: `\`${modalSubmitInt.fields.getTextInputValue("report")}\``
                }
            ])
            .setColor("Red")
            await client.channels.cache
            .get("1007724153371111446")
            .send({
                embeds: [reportEmbed]
            })
            await interaction.followUp({
                content: `${interaction.targetMember.user.tag} a bien été report !`,
                ephemeral: true
            })
        }
    }
}