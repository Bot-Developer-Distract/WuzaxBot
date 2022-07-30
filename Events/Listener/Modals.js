const { ModalSubmitInteraction, Client, InteractionType } = require("discord.js");
const { Perms } = require("../../Structures/Validation/Permissions")

module.exports = {
    name: "interactionCreate",
    id: "modals",
    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        if(!interaction.type === InteractionType.ModalSubmit) return;

        
        const i = interaction;
        const modal = client.modals.get(interaction.customId);
        
        if(modal == undefined) return;

        modal.execute(interaction, client);
    
    }
}