const levelrewardSchema = require("../../Schemas/LevelReward");
const levelSchema = require("../../Schemas/Leveling");
const today = new Date()

module.exports = {
  name: "messageCreate",
  id: "level",
  /**
 *
 * @param {Message} message
 * @param {Client} client
 */
  async execute(message) {
    if (message.channel.type === 1) return;
    if (message.author.bot) return;

    levelSchema.findOne({ guildId: message.guild.id, userId: message.author.id }, async (err, result) => {
      if (!result) {
        levelSchema.create({
          guildId: message.guild.id,
          userId: message.author.id,
          xp: 0,
          level: 0
        })
      }

    });

    if (today.getDay() == 6 || today.getDay() == 0) {
      const rand = Math.round(Math.random() * 3)
      if (rand === 0) {
        const give = Math.floor(Math.random() * 75) * 2
        //console.log(give, `mult`)
        const data = await levelSchema.findOne({
          guildId: message.guild.id,
          userId: message.author.id
        });

        const requiredXp = data.level * data.level * 100 + 100
        if (data.xp + give >= requiredXp) {
          data.xp += give;
          data.level += 1
          data.save()
          message.channel.send(`${message.author}, You have leveled up to **Level ${data.level}** (Since its the weekend you get double xp. You are also more likely to get some)`)
        } else {
          data.xp += give;
          data.save();
        }
        const nextRoleCheck = await levelrewardSchema.findOne({ guildId: message.guild.id, level: data.level })
        if (nextRoleCheck) {
          const levelRole = nextRoleCheck.role.replace(/[<@!&>]/g, '')
          message.member.roles.add(levelRole)
        }

      }
    } else {
      const rand = Math.round(Math.random() * 4)
      if (rand === 0) {
        const give = Math.floor(Math.random() * 75)
        //console.log(give, `norm`)
        const data = await levelSchema.findOne({
          guildId: message.guild.id,
          userId: message.author.id
        });

        const requiredXp = data.level * data.level * 100 + 100
        if (data.xp + give >= requiredXp) {
          data.xp += give;
          data.level += 1
          data.save()
          message.channel.send(`${message.author}, You have leveled up to **Level ${data.level}**`)
        } else {
          data.xp += give;
          data.save();
        }
        const nextRoleCheck = await levelrewardSchema.findOne({ guildId: message.guild.id, level: data.level })
        if (nextRoleCheck) {
          const levelRole = nextRoleCheck.role.replace(/[<@!&>]/g, '')
          message.member.roles.add(levelRole)
        }

      }
    }
  },
};