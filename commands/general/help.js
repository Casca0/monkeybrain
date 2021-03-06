/* eslint-disable no-unused-vars */
const commandPrefix = require('../../models/prefix');

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: 'Mostra todos os comandos.',
  usage: '?help <command>',
  async execute(message, profileData, args, Discord, client) {
    const prefix = await commandPrefix.findOne().then(result => result.prefix);
    if (args[0]) {
      const command = client.help.find(cmd => cmd.name === args[0]);
      if (command) {
        const alias = command.aliases ? command.aliases.join(', ') : 'Não tem alias';

        const embed = new Discord.MessageEmbed({
          title: 'Ajuda ❔',
          description: command.description,
          fields : [{
            name: 'Alias',
            value: `\`${alias}\``,
          },
          {
            name: 'Uso',
            value: `\`${command.usage ? command.usage : 'Não possui uso específico.'}\``,
          },
          ],
          color: '#0f12bd',
        });
        message.channel.send({ embeds: [embed] });
      }
      else {
        message.reply('Esse comando não existe, verifique a sua solicitação.');
      }
    }
    else {
      const commands = client.help.map((cmds) => {return cmds;});
      const backId = 'back';
      const forwardId = 'forward';

      const backButton = new Discord.MessageButton({
        style: 'SECONDARY',
        label: 'Voltar',
        emoji: '⬅️',
        customId: backId,
      });
      const forwardButton = new Discord.MessageButton({
        style: 'SECONDARY',
        label: 'Seguir',
        emoji: '➡️',
        customId: forwardId,
      });

      const generateEmbed = async start => {
        const current = commands.slice(start, start + 10);

        return new Discord.MessageEmbed({
          title: `Ajuda ❔\n(Prefixo : ${prefix})`,
          fields: await Promise.all(
            current.map(async cmdName => ({
              name: cmdName.name,
              value: cmdName.description ? cmdName.description : 'Não possui descrição.',
            })),
          ),
          color: '#0f12bd',
        });
      };

      const canFitOnOnePage = commands.length <= 10;
      const embedMessage = await message.channel.send({
        embeds:[await generateEmbed(0)],
        components: canFitOnOnePage
        ? []
        : [new Discord.MessageActionRow({ components: [forwardButton] })],
      });
      if (canFitOnOnePage) return;
      const collector = embedMessage.createMessageComponentCollector({
        filter: ({ user }) => user.id === message.author.id,
      });
      let currentIndex = 0;
      collector.on('collect', async interaction => {
        interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10);
        await interaction.update({
          embeds: [await generateEmbed(currentIndex)],
          components: [
            new Discord.MessageActionRow({
              components: [
                ...(currentIndex ? [backButton] : []),
                ...(currentIndex + 10 < commands.length ? [forwardButton] : []),
              ],
            }),
          ],
        });
      });
    }
  },
};
