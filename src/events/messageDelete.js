const { Events, EmbedBuilder, inlineCode } = require('discord.js');
const { logChannelId, devLogChannelId } = require('../config.json');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
		if (!message.guild) return;

		const logChannel = message.guild.channels.cache.get(logChannelId) || message.guild.channels.cache.get(devLogChannelId);

		const deletionEmbed = new EmbedBuilder({
			color: 0xfc7303,
			title: 'Mensagem excluída',
			thumbnail: {
				url: message.author.avatarURL(),
			},
			fields: [
				{
					name: 'Conteúdo da mensagem',
					value: message.attachments.first() ? `Imagem | ${inlineCode(message.content)}` : inlineCode(message.content),
				},
				{
					name: 'Autor da mensagem',
					value: message.author.tag,
				},
				{
					name: 'Canal da mensagem',
					value: `<#${message.channelId}>`,
				},
			],
			timestamp: new Date().toISOString(),
			image: {
				url: message.attachments.first() ? message.attachments.first().url : '',
			},
		});

		logChannel.send({ embeds: [deletionEmbed] });

	},
};
