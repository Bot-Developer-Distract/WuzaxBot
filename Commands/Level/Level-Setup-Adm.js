const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");
const levelrewardSchema = require("../../Schemas/LevelReward");
const setupSchema = require("../../Schemas/LevelingSetup");

module.exports = {
  name: 'level-adm',
  description: 'Setup the bot.',
  options: [
    {
      name: 'view',
      description: 'View the current setup',
      type: 1,
    },
    {
      name: 'reset',
      description: 'Reset the config',
      type: 1,
    },
    {
      name: 'rankcard',
      description: 'Change the servers levelling display',
      type: 1,
      options: [
        {
          name: 'enabled',
          description: 'Is the rank card enabled',
          type: 5,
          required: true,
        },
      ],
    },
    {
      name: 'add-reward',
      description: 'Add a levelling reward',
      type: 1,
      options: [
        {
          name: 'level',
          description: 'The level required to get this role',
          type: 10,
          required: true,
        },
        {
          name: 'reward',
          description: 'The reward for reaching this level',
          type: 8,
          required: true,
        },
      ],
    },
    {
      name: 'remove-reward',
      description: 'Remove a leveling reward',
      type: 1,
      options: [
        {
          name: 'role',
          description: 'The role to remove',
          type: 8,
          required: true,
        },
      ],
    },
  ],

  /**
 * @param {ChatInputCommandInteraction} interaction
 */
  execute: async (interaction) => {
    const { options } = interaction;

    try {
      switch (options.getSubcommand()) {
        case "view":
          let docs = await setupSchema.findOne({
            guildId: interaction.guild.id
          })
          if (!docs) {
            setupSchema.create({ guildId: interaction.guild.id })
            return interaction.reply({ content: "I couldn't find this server in my database. Please try again" })

          }
          const rewards = await levelrewardSchema.find({ guildId: interaction.guild.id })
          if (!rewards) {
            levelrewardSchema.create({ guildId: interaction.guild.id })
            return interaction.reply({ content: "I couldn't find this server in my database. Please try again" })
          }

          var description = `**Level Rewards**\n`
          for (const reward of rewards) {
            description += `Level ${reward.level} - ${reward.role}\n`
          }

          const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle('Bot Settings')
            .setDescription(description)
            .setFields(
              { name: 'Rank Card Enabled', value: docs.rankCard ? 'Yes' : 'No', inline: true },
            )
          interaction.reply({ embeds: [embed] })
          break;
        case "rankcard":
          let doc = await setupSchema.findOneAndUpdate({
            guildId: interaction.guild.id
          }, {
              rankCard: interaction.options.getBoolean('enabled')
            })
          if (!doc) {
            await setupSchema.create({ guildId: interaction.guild.id })
          }
          interaction.reply({
            content: `Rank card set to: ${interaction.options.getBoolean('enabled')}`,
            ephemeral: true,
          })
          break;
        case "reset":
          const reset = await setupSchema.findOne({ guildId: interaction.guild.id })
          if (reset) {
            reset.delete()
            levelrewardSchema.collection.deleteMany({ guildId: interaction.guild.id })
            return interaction.reply({ content: "Reset the config data" })
          } else {
            return interaction.reply({ content: "There was no config set" })
          }
          break;
        case "add-reward":
          levelrewardSchema.create({
            guildId: interaction.guild.id,
            level: interaction.options.getNumber('level'),
            role: interaction.options.getRole('reward')
          })
          interaction.reply({ content: `Level ${interaction.options.getNumber('level')} will reward ${interaction.options.getRole('reward')}`, ephemeral: true })
          break;
        case "remove-reward":
          const result = await levelrewardSchema.findOne({ guildId: interaction.guild.id, role: interaction.options.getRole('role') })
          if (!result) {
            interaction.reply({content: "Could not find a level reward with that role", ephemeral: true })
          }
          result.delete()
          interaction.reply({content: "Deleted that level reward", ephemeral: true })
          break;
      }
    } catch (err) {
      console.log(err)
    }
  },
};