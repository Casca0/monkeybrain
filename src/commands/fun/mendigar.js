const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mendigar')
		.setDescription('Mendige por bananinhas')
		.setDMPermission(false),
	cooldown: 60,
	async execute(interaction, profileData) {
		const randomNumber = Math.floor(Math.random() * 50) + 1;

		const begEmbed = new EmbedBuilder(
			{
				color: 0x32a2a8,
			},
		);

		switch (true) {
		case (randomNumber <= 20):
			begEmbed.setTitle('Pedindo dinheiro,\nvocê tropeça e senta num mendigo!');
			begEmbed.setDescription('Ele acaba pegando algumas moedas suas. :coin: -100 Bananinhas Reais');
			begEmbed.setImage('https://media.tenor.com/WErxJdvQO04AAAAM/mucalol-smurfdomuca.gif');

			if (profileData.coins < 100) {
				profileData.bank -= 100;
			}
			else {
				profileData.coins -= 100;
			}
			profileData.save();

			return interaction.followUp({ embeds: [begEmbed] });

		case (randomNumber <= 40):
			begEmbed.setTitle('Pedindo dinheiro,\nvocê recebe um lanche de terra e algumas bananinhas!');
			begEmbed.setDescription(':coin: +150 Bananinhas Reais');
			begEmbed.setImage('https://media.tenor.com/sGSCcUOJt8QAAAAM/sand-eat.gif');

			profileData.coins += 150;
			profileData.save();

			return interaction.followUp({ embeds: [begEmbed] });

		case (randomNumber <= 50):
			begEmbed.setTitle('Um rosto familiar te dá algumas moedas\ne você escuta um resmungo atrás do seu sorriso\n"Pobre asqueroso"');
			begEmbed.setDescription(':coin: +200 Bananinhas Reais');
			begEmbed.setImage('https://media.tenor.com/S5JsObbTvW0AAAAd/geno-fnbr.gif');

			profileData.coins += 200;
			profileData.save();

			return interaction.followUp({ embeds: [begEmbed] });
		}
	},
};
