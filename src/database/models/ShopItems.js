const { userModel } = require('./UserData.js');
const { inlineCode } = require('discord.js');

module.exports = {
	items: [
		{
			'name': 'banana',
			'itemID': 1,
			'cost': 1000,
			'useDescription': 'Use este item para jogar uma banana em alguém.',
			'use': async (interaction) => {
				await interaction.guild.members.fetch();

				const user = interaction.guild.members.cache.random().user;

				const userData = await userModel.findOne({ user_id: user.id });

				if (!userData) return interaction.reply('Você jogou uma banana e errou!');

				const itemValidation = userData.inventory.find(it => it.item_name == 'banana');

				if (!itemValidation) {
					userData.inventory.push({
						item_id: 1,
						item_name: 'banana',
						amount: 1,
					});

					userData.save();

					return interaction.reply(`Você jogou uma banana no(a) ${user}!`);
				}

				itemValidation.amount += 1;
				userData.save();

				return interaction.reply(`Você jogou uma banana no(a) ${user}!`);
			},
		},
		{
			'name': 'banana abençoada',
			'itemID': 2,
			'cost': 20000,
			'useDescription': 'Use este item para aumentar seu multiplicador de bananinhas!',
			'use': (interaction, profileData) => {
				profileData.maceta_multiplier += 0.4;

				return interaction.reply(`Seu multiplicador: ${inlineCode(profileData.maceta_multiplier)} :chart_with_upwards_trend:`);
			},
		},
		{
			'name': 'fruta estrela',
			'itemID': 3,
			'cost': 5000,
			'useDescription': 'Use este item para poder macetar sem pausas por 10 segundos!',
			'use': (interaction, profileData) => {
				profileData.maceta_starPower = true;

				return interaction.reply('FRUTA ESTRELA ATIVADA!');
			},
		},
	],
};
