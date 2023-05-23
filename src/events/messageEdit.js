const { Events, EmbedBuilder, inlineCode } = require('discord.js');

module.exports = {
	name: Events.MessageUpdate,
	execute(oldMessage, newMessage) {
		if (!oldMessage.guild) return;

		if (oldMessage.author.bot) return;

		const logChannel = oldMessage.guild.publicUpdatesChannel;

		const newMessageContent = newMessage.content;
		const oldMessageContent = oldMessage.content;

		const editEmbed = new EmbedBuilder({
			color: 0xfa2550,
			title: 'Mensagem editada',
			thumbnail: {
				url: oldMessage.author.avatarURL(),
			},
			fields: [
				{
					name: 'Conteúdo antes da alteração',
					value: oldMessage.attachments.first() ? `Imagem | ${inlineCode(oldMessageContent)}` : inlineCode(oldMessageContent),
				},
				{
					name: 'Conteúdo depois da alteração',
					value: newMessage.attachments.first() ? `Imagem | ${inlineCode(newMessageContent)}` : inlineCode(newMessageContent),
				},
				{
					name: 'Autor da mensagem',
					value: oldMessage.author.tag,
				},
				{
					name: 'Canal da mensagem',
					value: `<#${oldMessage.channelId}>`,
				},
				{
					name: 'Link da mensagem',
					value: `[link](${oldMessage.url})`,
				},
			],
			timestamp: new Date().toISOString(),
			image: {
				url: oldMessage.attachments.first() ? oldMessage.attachments.first().url : '',
			},
		});

		return logChannel.send({ embeds: [editEmbed] });

	},
};
