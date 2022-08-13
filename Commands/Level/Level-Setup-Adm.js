const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");
const levelrewardSchema = require("../../Schemas/LevelReward");
const setupSchema = require("../../Schemas/LevelingSetup");
const { SlashCommand } = require("discord-commands-params")

module.exports = new SlashCommand({
  name: 'level-adm',
  description: 'Configurez le bot.',
  options: [
    {
      name: 'view',
      description: 'Afficher la configuration actuelle',
      type: 1,
    },
    {
      name: 'reset',
      description: 'Réinitialiser la configuration',
      type: 1,
    },
    {
      name: 'rankcard',
      description: 'Modifier l\'affichage des niveaux sur le serveur',
      type: 1,
      options: [
        {
          name: 'enabled',
          description: 'La carte de rang est-elle activée',
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
          description: 'Le niveau requis pour obtenir ce rôle',
          type: 10,
          required: true,
        },
        {
          name: 'reward',
          description: 'La récompense pour avoir atteint ce niveau',
          type: 8,
          required: true,
        },
      ],
    },
    {
      name: 'remove-reward',
      description: 'Supprimer une récompense de niveau',
      type: 1,
      options: [
        {
          name: 'role',
          description: 'Le rôle à supprimer',
          type: 8,
          required: true,
        },
      ],
    },
  ],

  /**
 * @param {ChatInputCommandInteraction} interaction
 */
   async execute({client, interaction}) {
    const { options } = interaction;

    try {
      switch (options.getSubcommand()) {
        case "view":
          let docs = await setupSchema.findOne({
            guildId: interaction.guild.id
          })
          if (!docs) {
            setupSchema.create({ guildId: interaction.guild.id })
            return interaction.reply({ content: "Je n'ai pas pu trouver ce serveur dans ma base de données. Veuillez réessayer" })

          }
          const rewards = await levelrewardSchema.find({ guildId: interaction.guild.id })
          if (!rewards) {
            levelrewardSchema.create({ guildId: interaction.guild.id })
            return interaction.reply({ content: "Je n'ai pas pu trouver ce serveur dans ma base de données. Veuillez réessayer" })
          }

          var description = `**Récompenses des niveaux**\n`
          for (const reward of rewards) {
            description += `Niveau ${reward.level} - ${reward.role}\n`
          }

          const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle('Paramètres du Bot')
            .setDescription(description)
            .setFields(
              { name: 'Carte de rang activée', value: docs.rankCard ? 'Oui' : 'Non', inline: true },
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
            content: `Carte de rang défini sur: ${interaction.options.getBoolean('enabled')}`,
            ephemeral: true,
          })
          break;
        case "reset":
          const reset = await setupSchema.findOne({ guildId: interaction.guild.id })
          if (reset) {
            reset.delete()
            levelrewardSchema.collection.deleteMany({ guildId: interaction.guild.id })
            return interaction.reply({ content: "Réinitialiser les données de configuration" })
          } else {
            return interaction.reply({ content: "Il n'y avait pas de configuration" })
          }
          break;
        case "add-reward":
          levelrewardSchema.create({
            guildId: interaction.guild.id,
            level: interaction.options.getNumber('level'),
            role: interaction.options.getRole('reward')
          })
          interaction.reply({ content: `Le niveau ${interaction.options.getNumber('level')} a pour récompense ${interaction.options.getRole('reward')}`, ephemeral: true })
          break;
        case "remove-reward":
          const result = await levelrewardSchema.findOne({ guildId: interaction.guild.id, role: interaction.options.getRole('role') })
          if (!result) {
            interaction.reply({content: "Impossible de trouver une récompense de niveau avec ce rôle", ephemeral: true })
          }
          result.delete()
          interaction.reply({content: "Supprimé ce niveau de récompense", ephemeral: true })
          break;
      }
    } catch (err) {
      console.log(err)
    }
  },
});