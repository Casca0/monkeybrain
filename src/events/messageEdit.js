const { Events, EmbedBuilder, inlineCode } = require('discord.js');
const { logChannelId, devLogChannelId } = require('../config.json');

module.exports = {
	name: Events.MessageUpdate,
	async execute(message) {
		if (!message.guild) return;

		if (message.author.bot) return;

		const logChannel = message.guild.channels.cache.get(logChannelId) || message.guild.channels.cache.get(devLogChannelId);

		const newMessageContent = message.reactions.message.content;
		const oldMessageContent = message.content;

		const editEmbed = new EmbedBuilder({
			color: 0x49fc03,
			title: 'Mensagem editada',
			thumbnail: {
				url: message.author.avatarURL(),
			},
			fields: [
				{
					name: 'Conteúdo antes da alteração',
					value: message.attachments.first() ? `Imagem | ${inlineCode(oldMessageContent)}` : inlineCode(oldMessageContent),
				},
				{
					name: 'Conteúdo depois da alteração',
					value: message.attachments.first() ? `Imagem | ${inlineCode(newMessageContent)}` : inlineCode(newMessageContent),
				},
				{
					name: 'Autor da mensagem',
					value: message.author.tag,
				},
				{
					name: 'Canal da mensagem',
					value: `<#${message.channelId}>`,
				},
				{
					name: 'Link da mensagem',
					value: `[link](${message.url})`,
				},
			],
			timestamp: new Date().toISOString(),
			image: {
				url: message.attachments.first() ? message.attachments.first().url : '',
			},
		});

		logChannel.send({ embeds: [editEmbed] });

	},
};
