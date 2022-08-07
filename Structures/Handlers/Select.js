const { Client } = require("discord.js")
/**
 * @param {Client} client
 */

module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Select Menu")

    const SelectFiles = await PG(`${process.cwd().replace(/\\/g, "/")}/Select/*/*.js`)
    SelectFiles.map(async (file) => {
        const selectFile = require(file);

        if(!selectFile.id) return;
        
        client.selects.set(selectFile.id, selectFile);
        await Table.addRow(`${selectFile.id} - ${selectFile.value}.js`, "✅");
        
    });
    console.log(Table.toString());
}