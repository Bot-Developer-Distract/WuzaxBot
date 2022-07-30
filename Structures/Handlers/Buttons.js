const { Client } = require("discord.js")
/**
 * @param {Client} client
 */

module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Buttons")

    const ButtonFiles = await PG(`${process.cwd().replace(/\\/g, "/")}/Buttons/*/*.js`)
    ButtonFiles.map(async (file) => {
        const buttonFile = require(file);

        if(!buttonFile.id) return;
        
        client.buttons.set(buttonFile.id, buttonFile);
        await Table.addRow(`${buttonFile.id}.js`, "✅");
        
    });
    console.log(Table.toString());
}