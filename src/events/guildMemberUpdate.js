// const { Events } = require('discord.js');

// module.exports = {
// 	name: Events.GuildMemberUpdate,
// 	async execute(member) {
// 		console.log('teste evento', member);

// 		const logChannel = message.guild.channels.cache.get('1007389408313475196');

// 		const deletionEmbed = new EmbedBuilder({
// 			color: 0xfc7303,
// 			title: 'Mensagem excluída',
// 			thumbnail: {
// 				url: message.author.avatarURL(),
// 			},
// 			fields: [
// 				{
// 					name: 'Conteúdo da mensagem',
// 					value: message.attachments.first() ? `Imagem | ${inlineCode(message.content)}` : inlineCode(message.content),
// 				},
// 				{
// 					name: 'Autor da mensagem',
// 					value: message.author.tag,
// 				},
// 				{
// 					name: 'Canal da mensagem',
// 					value: `<#${message.channelId}>`,
// 				},
// 			],
// 			timestamp: new Date().toISOString(),
// 			image: {
// 				url: message.attachments.first() ? message.attachments.first().url : '',
// 			},
// 		});

// 		logChannel.send({ embeds: [deletionEmbed] });

// 	},
// };
