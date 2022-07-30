const { Client, InteractionType } = require("discord.js");
const { Perms } = require("../../Structures/Validation/Permissions")

module.exports = {
    name: "interactionCreate",
    id: "buttons",
    /**
     * 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        if(!interaction.type === InteractionType.MessageComponent) return;

        
        const i = interaction;
        const button = client.buttons.get(interaction.customId);
        
        if(button == undefined) return;

        button.execute(interaction, client);
    
    }
}