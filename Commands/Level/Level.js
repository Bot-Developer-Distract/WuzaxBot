const { EmbedBuilder, InteractionWebhook, AttachmentBuilder } = require('discord.js')
const canvacord = require('canvacord')
const levelSchema = require("../../Schemas/Leveling");
const setupSchema = require("../../Schemas/LevelingSetup");

module.exports = {
  name: 'level',
  description: 'View levels and the leaderboard.',
  options: [
    {
      name: 'view',
      description: 'View the level of you or someone else',
      type: 1,
      options: [
        {
          name: 'user',
          description: 'The user to view',
          type: 6,
          required: false,
        },
      ],
    },
    {
      name: 'leaderboard',
      description: 'Get the top 15 users',
      type: 1,
      options: [
        {
          name: 'type',
          description: 'Choose how to rank the leaderboard',
          type: 3,
          required: true,
          choices: [
            {
              name: 'xp',
              value: 'xp',
            },
            {
              name: 'level',
              value: 'level',
            },
          ],
        },
      ],
    },
  ],

  async execute(interaction) {
    const setup = await setupSchema.findOne({ guildId: interaction.guild.id })
    if (interaction.options.getSubcommand() === 'view') {
      if (interaction.options.getUser('user')) {
        const user = interaction.options.getUser('user')

        const userBal = levelSchema.findOne({ userId: user.id }, async (err, bal) => {
          if (!bal) {
            return `I could not find the user in my database`
          }

        });
        const walletBal = await levelSchema.findOne({
          userId: user.id,
          guildId: interaction.guild.id,
        })

        if (!walletBal) {

          const balEmbed = new EmbedBuilder()
            .setTitle(`${user.username}'s level`)
            .setDescription(`${user.tag} does not have a rank. Send some messages to get one`)
            .setColor('Yellow')
          interaction.reply({ embeds: [balEmbed] })

        } else {
          const required = walletBal.level * walletBal.level * 100 + 100
          if (setup.rankCard === false) {
            const balEmbed = new EmbedBuilder()
              .setTitle(`${user.username}'s level`)
              .setDescription(`**XP:** \`${walletBal.xp}/${required}\` (${Math.round(walletBal.xp / required * 100)}%)\n**Level:** \`${walletBal.level}\``)
              .setColor('Yellow')
            interaction.reply({ embeds: [balEmbed] })

          } else {
            const rankCard = new canvacord.Rank()
              .setAvatar(user.displayAvatarURL({ dynamic: false, format: 'prng' }))
              .setCurrentXP(walletBal.xp)
              .setRequiredXP(walletBal.level * walletBal.level * 100 + 100)
              .setProgressBar('#FFA500', 'COLOR', true)
              .setUsername(user.username)
              .setLevel(walletBal.level)
              .setDiscriminator(user.discriminator)
              .setRank(1, 'none', false)
              .setCustomStatusColor('#FFA500')
            rankCard.build().then(data => {
              const attactment = new AttachmentBuilder(data, 'level.png')
              interaction.reply({ files: [attactment] })
            })
          }
        }
      } else {
        const user = interaction.user

        const userBal = levelSchema.findOne({ userId: user.id }, async (err, bal) => {
          if (!bal) {
            return `I could not find the user in my database`
          }

        });
        const walletBal = await levelSchema.findOne({
          userId: user.id,
          guildId: interaction.guild.id,
        })

        if (!walletBal) {
          const balEmbed = new EmbedBuilder()
            .setTitle(`${user.username}'s level`)
            .setDescription(`${user.tag} does not have a rank. Send some messages to get one`)
            .setColor('Yellow')
          interaction.reply({ embeds: [balEmbed] })

        } else {
          const required = walletBal.level * walletBal.level * 100 + 100
          if (setup.rankCard === false) {
            const balEmbed = new EmbedBuilder()
              .setTitle(`${user.username}'s level`)
              .setDescription(`**XP:** \`${walletBal.xp}/${required}\` (${Math.round(walletBal.xp / required * 100)}%)\n**Level:** \`${walletBal.level}\``)
              .setColor('Yellow')
            interaction.reply({ embeds: [balEmbed] })
          } else {
            const rankCard = new canvacord.Rank()
              .setAvatar(user.displayAvatarURL({ dynamic: false, format: 'png' }))
              .setCurrentXP(walletBal.xp)
              .setRequiredXP(walletBal.level * walletBal.level * 100 + 100)
              .setProgressBar('#FFA500', 'COLOR', true)
              .setLevel(walletBal.level)
              .setUsername(user.username)
              .setDiscriminator(user.discriminator)
              .setRank(1, 'none', false)
              .setCustomStatusColor('#FFA500')
            rankCard.build().then(data => {
              const attactment = new AttachmentBuilder(data, 'level.png')
              interaction.reply({ files: [attactment] })
            })
          }
        }
      }
    } else if (interaction.options.getSubcommand() === 'leaderboard') {
      if (interaction.options.getString('type') === 'xp') {
        let text = ''
        const results = await levelSchema.find({
          guildId: interaction.guild.id,

        }).sort({
          xp: -1
        }).limit(15)

        for (let counter = 0; counter < results.length; ++counter) {
          const { userId, xp = 0 } = results[counter]

          text += `**#${counter + 1}** <@${userId}> - \`${xp}\`\n`
        }
        const lbEmbed = new EmbedBuilder()
          .setTitle('XP Leaderboard')
          .setColor('Yellow')
          .setDescription(text)
        interaction.reply({ embeds: [lbEmbed] })

      } else {
        let text = ''
        const results = await levelSchema.find({
          guildId: interaction.guild.id,

        }).sort({
          level: -1
        }).limit(15)

        for (let counter = 0; counter < results.length; ++counter) {
          const { userId, level = 0 } = results[counter]

          text += `**#${counter + 1}** <@${userId}> - \`${level}\`\n`
        }
        const lbEmbed = new EmbedBuilder()
          .setTitle('Level Leaderboard')
          .setColor('Yellow')
          .setDescription(text)
        interaction.reply({ embeds: [lbEmbed] })

      }
    }
  }
}