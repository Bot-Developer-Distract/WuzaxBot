const { Client } = require("discord.js")
/**
 * @param {Client} client
 */

module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Modals")

    const ModalFiles = await PG(`${process.cwd().replace(/\\/g, "/")}/Modals/*/*.js`)
    ModalFiles.map(async (file) => {
        const modalFile = require(file);

        if(!modalFile.id) return;
        
        client.modals.set(modalFile.id, modalFile);
        await Table.addRow(`${modalFile.id}.js`, "✅");
        
    });
    console.log(Table.toString());
}