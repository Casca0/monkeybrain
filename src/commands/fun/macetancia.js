const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { macetaVisions } = require('./macetaInfo.json');

const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('macetancia')
		.setDescription('Macete um usuário aleatório!')
		.setDMPermission(false),
	cooldown: 180,
	async execute(interaction, profileData) {
		await interaction.guild.members.fetch();

		const user = interaction.guild.members.cache.random().user;

		// If user doesn't have profileData, create it

		let userData;
		try {
			userData = await userModel.findOne({ user_id: user.id });
			if (!userData) {
				await userModel.create({
					user_id: interaction.user.id,
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

		const macetaMessage = new EmbedBuilder({
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
			macetaMessage.setTitle('Você se macetou, parabéns! :banana:');
			macetaMessage.setDescription('');

			profileData.maceta_counter += 1;
			profileData.save();

			return interaction.followUp({ embeds: [macetaMessage] });

			// Case ID from admin

		case '380198082811396097':
			macetaMessage.setTitle('Você macetou o ADM');
			macetaMessage.setDescription('E ganhou 600 Bananinhas Reais :coin::banana: por isso!');
			macetaMessage.setImage('https://media1.tenor.com/images/1d78b613692b7cfe01c2f2a4a0b2f6fc/tenor.gif?itemid=5072717');

			profileData.coins += 600;
			profileData.save();

			userData.maceta_counter += 1;
			userData.save();

			return interaction.followUp({ embeds: [macetaMessage] });

			// Case ID from client

		case '840221907622166579':
			macetaMessage.setTitle('VOCÊ TENTOU ME MACETAR?');
			macetaMessage.setDescription('ENTÃO SEJA MACETADO!');
			macetaMessage.setImage('https://i.imgur.com/mWw7OIa.gif');

			profileData.maceta_counter += 1;
			profileData.save();

			return interaction.followUp({ embeds: [macetaMessage] });

		default:
			if (user.bot == true) {
				macetaMessage.setTitle('MACETOU UM BOT');
				macetaMessage.setDescription(`TCHU TCHU | ${user}`);
				macetaMessage.setImage('https://c.tenor.com/ebTWNO6KmNYAAAAC/picapau-puchapenas.gif');

				return interaction.followUp({ embeds: [macetaMessage] });
			}
			else {
				profileData.coins += bananinhasAmount;
				profileData.save();

				userData.maceta_counter += 1;
				userData.save();

				return interaction.followUp({ embeds: [macetaMessage] });
			}
		}
	},
};
