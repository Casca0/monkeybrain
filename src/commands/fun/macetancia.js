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
		if (!user.bot) {
			try {
				userData = await userModel.findOne({ user_id: user.id });
				if (!userData) {
					await userModel.create({
						user_id: user.id,
					}).then(res => userData = res);
				}
			}
			catch (err) {
				console.error(err);
			}
		}
		// Get random gif from JSON

		const macetaGif = macetaVisions[Math.round(Math.random() * (macetaVisions.length - 1))];

		// Generate coins amount

		let bananinhasAmount = Math.round((Math.floor(Math.random() * 450) + 1) * profileData.maceta_multiplier);

		// Create embed message

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

		// Generate random number for bank withdraw

		const bankMaceta = Math.floor(Math.random() * 250) + 1;
		let macetaBankAmount = bananinhasAmount + 1000 * 2;

		// Switch

		switch (user.id) {

		// Case ID from author

		case interaction.user.id:
			macetaMessage.setTitle('Você se macetou, parabéns! :banana:');
			macetaMessage.setDescription(`${user}`);

			profileData.maceta_counter += 1;
			profileData.save();

			interaction.reply({ embeds: [macetaMessage] });

			break;

			// Case ID from admin

		case '380198082811396097':
			macetaMessage.setTitle('Você macetou o ADM');
			macetaMessage.setDescription(`E ganhou ${bananinhasAmount} Bananinhas Reais :coin::banana: por isso!`);
			macetaMessage.setImage('https://media1.tenor.com/images/1d78b613692b7cfe01c2f2a4a0b2f6fc/tenor.gif?itemid=5072717');

			profileData.coins += bananinhasAmount;
			profileData.save();

			if (userData.coins > bananinhasAmount) {
				userData.coins -= bananinhasAmount;
			}

			userData.maceta_counter += 1;
			userData.save();

			interaction.reply({ embeds: [macetaMessage] });

			break;

			// Case ID from client

		case '840221907622166579':
			macetaMessage.setTitle('VOCÊ TENTOU ME MACETAR?');
			macetaMessage.setDescription('ENTÃO SEJA MACETADO!');
			macetaMessage.setImage('https://i.imgur.com/mWw7OIa.gif');

			profileData.maceta_counter += 1;
			profileData.save();

			interaction.reply({ embeds: [macetaMessage] });

			break;
		default:
			if (user.bot) {
				macetaMessage.setTitle('MACETOU UM BOT');
				macetaMessage.setDescription(`TCHU TCHU | ${user}`);
				macetaMessage.setImage('https://c.tenor.com/ebTWNO6KmNYAAAAC/picapau-puchapenas.gif');

				return interaction.reply({ embeds: [macetaMessage] });
			}
			else if (bankMaceta === 20 && userData.bank >= 0) {
				macetaMessage.setTitle('VOCÊ MACETOU ESTE USER TÃO FORTE QUE TIROU DINHEIRO DO BANCO DELE');
				macetaMessage.setDescription(`Você tirou :coin: BR ${macetaBankAmount} do banco de ${user}`);
				macetaMessage.setImage('https://media.tenor.com/tEMIpAruG6sAAAAd/mucalol.gif');

				if (userData.bank === 0) {
					if (userData.coins < macetaBankAmount) {
						macetaBankAmount = userData.coins;
						userData.coins -= macetaBankAmount;
					}
					else {
						userData.coins -= macetaBankAmount;
					}
				}
				else if (userData.bank < macetaBankAmount) {
					macetaBankAmount = userData.bank;
					userData.bank -= macetaBankAmount;
				}
				else {
					userData.bank -= macetaBankAmount;
				}

				profileData.coins += macetaBankAmount;
				profileData.save();

				userData.maceta_counter += 1;
				userData.save();

				return interaction.reply({ embeds: [macetaMessage] });
			}
			else {
				profileData.coins += bananinhasAmount;
				profileData.save();

				if (bananinhasAmount > userData.coins) {
					bananinhasAmount = userData.coins;
				}

				userData.maceta_counter += 1;
				userData.coins -= bananinhasAmount;
				userData.save();

				return interaction.reply({ embeds: [macetaMessage] });
			}
		}
	},
};
