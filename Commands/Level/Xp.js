const {
    EmbedBuilder
  } = require('discord.js')
  
  const levelSchema = require("../../Schemas/Leveling");
  const setupSchema = require("../../Schemas/LevelingSetup");
  
  module.exports = {
    name: 'xp',
    description: 'Gérer l\'xp d\'un utilisateur.',
    options: [
      {
        name: 'manage',
        description: 'Manage a users xp and level',
        type: 1,
        options: [
          {
            name: 'action',
            description: 'L\'action à exécuter',
            type: 3,
            required: true,
            choices: [{
              name: 'Ajouter',
              value: 'add'
            },
            {
              name: 'Définir',
              value: 'set',
            },
            ],
          },
          {
            name: 'type',
            description: 'Choisissez de définir le niveau ou l\'xp',
            type: 3,
            required: true,
            choices: [
              {
                name: 'level',
                value: 'level'
              },
              {
                name: 'xp',
                value: 'xp'
              },
            ],
          },
          {
            name: 'user',
            description: 'L\'utilisateur à gérer',
            type: 6,
            required: true,
          },
          {
            name: 'amount',
            description: 'La quantité d\'xp',
            type: 10,
            required: true,
          },
        ],
      },
    ],
  
  
    async execute(interaction) {
  
      const user = interaction.options.getUser('user');
      let amountAdd = interaction.options.getNumber('amount')
      const type = interaction.options.getString('type')
  
      if (interaction.options.getSubcommand() === 'manage') {
        if (type === 'xp') {
          if (interaction.options.getString('action') === 'add') {
  
            const data = await levelSchema.findOne({
              guildId: interaction.guild.id,
              userId: user.id
            });
  
            let walletBalOg;
  
            if (!data) {
              const newData = await levelSchema.create({
                guildId: interaction.guild.id,
                userId: user.id,
                xp: 0,
                level: 0
              });
  
              newData.save();
            } else {
              walletBal = data.xp;
              data.xp += amountAdd;
              data.save();
            }
  
            const embed = new EmbedBuilder()
              .setTitle(`${user.username}'s XP`)
              .setFields({
                name: 'Avant:',
                value: `\`${walletBal}\``,
                inline: true
              }, /*{
                  name: 'New Value:',
                  value: `\`${data.xp}\``,
                  inline: true
                },*/ {
                  name: 'Nombre ajouté:',
                  value: `\`${amountAdd}\``,
                  inline: true,
                })
              .setColor("Green")
  
            interaction.reply({ embeds: [embed] })
  
  
  
          } else if (interaction.options.getString('action') === 'set') {
  
            const data = await levelSchema.findOne({
              guildId: interaction.guild.id,
              userId: user.id
            });
  
            let walletBalOg;
  
            if (!data) {
              const newData = await levelSchema.create({
                guildId: interaction.guild.id,
                userId: user.id,
                xp: 0,
                level: 0
              });
  
              newData.save();
            } else {
              walletBal = data.xp;
              data.xp = amountAdd;
              data.save();
            }
  
            const embed = new EmbedBuilder()
              .setTitle(`${user.username}'s XP`)
              .setFields({
                name: 'Avant:',
                value: `\`${walletBal}\``,
                inline: true
              }, {
                  name: 'Après:',
                  value: `\`${data.xp}\``,
                  inline: true
                })
              .setColor('Green')
  
            interaction.reply({ embeds: [embed] })
  
  
          }
        } else {
          if (interaction.options.getString('action') === 'add') {
  
            const data = await levelSchema.findOne({
              guildId: interaction.guild.id,
              userId: user.id
            });
  
            let walletBalOg;
  
            if (!data) {
              const newData = await levelSchema.create({
                guildId: interaction.guild.id,
                userId: user.id,
                xp: 0,
                level: 0
              });
  
              newData.save();
            } else {
              walletBal = data.level;
              data.level += amountAdd;
              data.save();
            }
  
            const embed = new EmbedBuilder()
              .setTitle(`${user.username}'s level`)
              .setFields({
                name: 'Avant:',
                value: `\`${walletBal}\``,
                inline: true
              }, {
                  name: 'Après:',
                  value: `\`${data.level}\``,
                  inline: true
                }, {
                  name: 'Nombre ajouté:',
                  value: `\`${amountAdd}\``,
                  inline: true,
                })
              .setColor("Green")
  
            interaction.reply({ embeds: [embed] })
  
  
  
          } else if (interaction.options.getString('action') === 'set') {
  
            const data = await levelSchema.findOne({
              guildId: interaction.guild.id,
              userId: user.id
            });
  
            let walletBalOg;
  
            if (!data) {
              const newData = await levelSchema.create({
                guildId: interaction.guild.id,
                userId: user.id,
                xp: 0,
                level: 0
              });
  
              newData.save();
            } else {
              walletBal = data.level;
              data.level = amountAdd;
              data.save();
            }
  
            const embed = new EmbedBuilder()
              .setTitle(`${user.username}'s level`)
              .setFields({
                name: 'Avant:',
                value: `\`${walletBal}\``,
                inline: true
              }, {
                  name: 'Après:',
                  value: `\`${data.level}\``,
                  inline: true
                })
              .setColor('Green')
  
  
            interaction.reply({ embeds: [embed] })
  
          }
        }
      }
    }
  }