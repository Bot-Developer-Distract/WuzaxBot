const { SelectMenuInteraction, Client, InteractionType, ImageFormat, EmbedBuilder } = require("discord.js");
const { Perms } = require("../../Structures/Validation/Permissions")

module.exports = {
    name: "interactionCreate",
    id: "select",
    /**
     * 
     * @param {SelectMenuInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(!interaction.isSelectMenu()) return;

        const select = client.selects.get(interaction.customId)
        
        if(select == undefined) return;

        select.execute(interaction, client)
    }
}