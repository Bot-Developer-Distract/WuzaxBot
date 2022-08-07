const { Client, Partials, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const ms = require("ms")
const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "users", "roles"] },
    rest: { timeout: ms("1m") }
})

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selects = new Collection();

require("dotenv").config()
require("../Structures/Handlers/Database")
require("../Captcha/captcha")(client)
require("./System/Giveawaysys")(client)
const Handlers = ["Events", "Errors", "Commands", "Buttons", "Modals", "Select"]
Handlers.forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, Ascii)
})

client.login(process.env.TOKEN)