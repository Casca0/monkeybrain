const { Events, EmbedBuilder, inlineCode } = require('discord.js');
const { logChannelId, devLogChannelId } = require('../config.json');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
		if (!message.guild) return;

		await message.channel.messages.fetch();

		const fetchedMessage = message.channel.messages.cache.fetch(message.id);

		const logChannel = message.guild.channels.cache.get(logChannelId) || message.guild.channels.cache.get(devLogChannelId);

		const deletionEmbed = new EmbedBuilder({
			color: 0xfc7303,
			title: 'Mensagem excluída',
			thumbnail: {
				url: fetchedMessage.author.avatarURL(),
			},
			fields: [
				{
					name: 'Conteúdo da mensagem',
					value: fetchedMessage.attachments.first() ? `Imagem | ${inlineCode(fetchedMessage.content)}` : inlineCode(fetchedMessage.content),
				},
				{
					name: 'Autor da mensagem',
					value: fetchedMessage.author.tag,
				},
				{
					name: 'Canal da mensagem',
					value: `<#${fetchedMessage.channelId}>`,
				},
			],
			timestamp: new Date().toISOString(),
			image: {
				url: fetchedMessage.attachments.first() ? fetchedMessage.attachments.first().url : '',
			},
		});

		logChannel.send({ embeds: [deletionEmbed] });

	},
};
