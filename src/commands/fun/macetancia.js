const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { macetaVisions } = require('./macetaInfo.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('macetancia')
		.setDescription('Macete um usuário aleatório!')
		.setDMPermission(false),
	cooldown: 160,
	async execute(interaction) {
		await interaction.guild.members.fetch();

		const user = interaction.guild.members.cache.random().user;

		const macetaGif = macetaVisions[Math.round(Math.random() * (macetaVisions.length - 1))];

		const defaultMacetaMessage = new EmbedBuilder({
			color: 0xebe41c,
			title: 'WIP',
			description: `VOCÊ ACABA DE MACETAR ${user}!`,
			image: {
				url: macetaGif,
			},
			timestamp: new Date().toISOString(),
			footer: {
				text: interaction.user.username,
				icon_url: interaction.user.avatarURL(),
			},
		});

		switch (user.id) {
		case interaction.user.id:
			const selfMacetaMessage = new EmbedBuilder({
				color: 0x1ce8e1,
				title: 'Você se macetou, parabéns! :banana:',
				description: 'WIP',
				image: {
					url: macetaGif,
				},
				timestamp: new Date().toISOString(),
				footer: {
					text: interaction.user.username,
					icon_url: interaction.user.avatarURL(),
				},
			});

			await interaction.reply({ embeds: [selfMacetaMessage] });

			break;
		case '380198082811396097':
			const adminMessage = new EmbedBuilder({
				color: 0x1ad94d,
				title: 'Você macetou o ADM!',
				description: 'WIP',
				image: {
					url: 'https://media1.tenor.com/images/1d78b613692b7cfe01c2f2a4a0b2f6fc/tenor.gif?itemid=5072717',
				},
				timestamp: new Date().toISOString(),
				footer: {
					text: interaction.user.username,
					icon_url: interaction.user.avatarURL(),
				},
			});

			await interaction.reply({ embeds: [adminMessage] });

			break;
		case '840221907622166579':
			const monkeyMessage = new EmbedBuilder({
				color: 0xd91a43,
				title: 'VOCÊ TENTOU ME MACETAR?',
				description: 'WIP',
				image: {
					url: 'https://i.imgur.com/mWw7OIa.gif',
				},
				timestamp: new Date().toISOString(),
				footer: {
					text: interaction.user.username,
					icon_url: interaction.user.avatarURL(),
				},
			});

			await interaction.reply({ embeds: [monkeyMessage] });

			break;
		default:
			if (user.bot == true) {
				const botMessage = new EmbedBuilder({
					color: 0x8d9696,
					title: `TCHU TCHU | ${user}`,
					description: 'WIP',
					image: {
						url: 'https://c.tenor.com/ebTWNO6KmNYAAAAC/picapau-puchapenas.gif',
					},
					timestamp: new Date().toISOString(),
					footer: {
						text: interaction.user.username,
						icon_url: interaction.user.avatarURL(),
					},
				});

				await interaction.reply({ embeds: [botMessage] });
			}
			else {
				await interaction.reply({ embeds: [defaultMacetaMessage] });
			}
		}

	},
};
