const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { macetaVisions } = require('./macetaInfo.json');

const { Users } = require('../../utils/db-objects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('macetancia')
		.setDescription('Macete um usuário aleatório!')
		.setDMPermission(false),
	cooldown: 300,
	async execute(interaction, profileData) {
		await interaction.guild.members.fetch();

		const user = interaction.guild.members.cache.random().user;

		// If user doesn't have profileData, create it

		let userData;

		try {
			userData = await Users.findOne({
				where: {
					user_id: user.id,
				},
			});

			if (!userData && !user.bot) {
				await Users.create({
					user_id: user.id,
					server_id: interaction.guildId,
				}).then(res => userData = res);
			}
		}
		catch (err) {
			console.error(err);
		}

		// Get random gif from JSON

		const macetaGif = macetaVisions[Math.round(Math.random() * (macetaVisions.length - 1))];

		// Generate coins amount

		const bananinhasAmount = Math.floor(Math.random() * 450) + 1;

		// Create default embed message

		const defaultMacetaMessage = new EmbedBuilder({
			color: 0xebe41c,
			title: `Você ganhou ${bananinhasAmount} Bananinhas Reais :coin::banana:`,
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

		// Switch

		switch (user.id) {

		// Case ID from author

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

			profileData.maceta_counter += 1;
			profileData.save();

			await interaction.reply({ embeds: [selfMacetaMessage] });

			break;

			// Case ID from admin

		case '380198082811396097':
			const adminMessage = new EmbedBuilder({
				color: 0x1ad94d,
				title: 'Você macetou o ADM',
				description: 'E ganhou 600 Bananinhas Reais :coin::banana: por isso!',
				image: {
					url: 'https://media1.tenor.com/images/1d78b613692b7cfe01c2f2a4a0b2f6fc/tenor.gif?itemid=5072717',
				},
				timestamp: new Date().toISOString(),
				footer: {
					text: interaction.user.username,
					icon_url: interaction.user.avatarURL(),
				},
			});

			profileData.coins += 600;
			profileData.save();

			userData.maceta_counter += 1;
			userData.save();

			await interaction.reply({ embeds: [adminMessage] });

			break;

			// Case ID from client

		case '840221907622166579':
			const monkeyMessage = new EmbedBuilder({
				color: 0xd91a43,
				title: 'VOCÊ TENTOU ME MACETAR?',
				description: 'ENTÃO SEJA MACETADO!',
				image: {
					url: 'https://i.imgur.com/mWw7OIa.gif',
				},
				timestamp: new Date().toISOString(),
				footer: {
					text: interaction.user.username,
					icon_url: interaction.user.avatarURL(),
				},
			});

			profileData.maceta_counter += 1;
			profileData.save();

			await interaction.reply({ embeds: [monkeyMessage] });

			break;
		default:
			if (user.bot == true) {
				const botMessage = new EmbedBuilder({
					color: 0x8d9696,
					title: 'MACETOU UM BOT',
					description: `TCHU TCHU | ${user}`,
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
				profileData.coins += bananinhasAmount;
				profileData.save();

				userData.maceta_counter += 1;
				userData.save();

				await interaction.reply({ embeds: [defaultMacetaMessage] });
			}
		}
	},
};
