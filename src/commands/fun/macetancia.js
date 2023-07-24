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

		if (profileData.maceta_failed) {
			setTimeout(() => {
				profileData.maceta_failed = false;
				profileData.save();
				return;
			}, 120000);

			const failedMacetaMessage = new EmbedBuilder({
				color: 0xebe41c,
				title: 'Você ainda está desnorteado por macetar um bot!',
				image: {
					url: 'https://media.tenor.com/nFcwQTScDg8AAAAd/monkey-shocked-monkey.gif',
				},
				timestamp: new Date().toISOString(),
				footer: {
					text: interaction.user.username,
					icon_url: interaction.user.avatarURL(),
				},
			});

			return interaction.reply({ embeds: [failedMacetaMessage] });
		}

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

		if (user.id == interaction.user.id) {
			macetaMessage.setTitle('Você se macetou, parabéns! :banana:');
			macetaMessage.setDescription(`${user}`);

			profileData.maceta_counter += 1;
			profileData.save();

			return interaction.reply({ embeds: [macetaMessage] });
		}

		else if (user.id == interaction.guild.ownerId) {
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

			return interaction.reply({ embeds: [macetaMessage] });
		}

		else if (user.id == interaction.client.application.id) {
			macetaMessage.setTitle('Tem dinheiro não.');
			macetaMessage.setDescription(`${user}`);
			macetaMessage.setImage('https://media.tenor.com/eZjQ5C2jwU8AAAAC/monkey-money.gif');

			return interaction.reply({ embeds: [macetaMessage] });
		}

		else if (user.bot) {
			macetaMessage.setTitle('Foi de cabeça na lata.');
			macetaMessage.setDescription(`Perde a próxima macetada | ${user}`);
			macetaMessage.setImage('https://c.tenor.com/ebTWNO6KmNYAAAAC/picapau-puchapenas.gif');

			profileData.maceta_failed = true;
			profileData.save();

			return interaction.reply({ embeds: [macetaMessage] });
		}

		if (bankMaceta === 20 && userData.bank > 0) {
			macetaMessage.setTitle('VOCÊ MACETOU ESTE USER TÃO FORTE QUE TIROU DINHEIRO DO BANCO DELE');
			macetaMessage.setDescription(`Você tirou :coin: BR ${macetaBankAmount} do banco de ${user}`);
			macetaMessage.setImage('https://media.tenor.com/tEMIpAruG6sAAAAd/mucalol.gif');

			if (macetaBankAmount > userData.bank) {
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
			if (userData.coins > 0 && bananinhasAmount > userData.coins) {
				bananinhasAmount = userData.coins;
			}

			else if (userData.coins > bananinhasAmount) {
				userData.coins -= bananinhasAmount;
			}

			profileData.coins += bananinhasAmount;
			profileData.save();

			userData.maceta_counter += 1;
			userData.save();

			return interaction.reply({ embeds: [macetaMessage] });
		}
	},
};
