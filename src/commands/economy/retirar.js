const { SlashCommandBuilder, inlineCode } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('retirar')
		.setDescription('Retire suas moedas do banco!')
		.addStringOption(option =>
			option
				.setName('quantia')
				.setDescription('Quantidade à ser retirada. (Informe "tudo" para selecionar todas as moedas)')
				.setRequired(true),
		)
		.setDMPermission(false),
	execute(interaction, profileData) {
		let quantity = interaction.options.getString('quantia');

		if (quantity == 'tudo') quantity = profileData.bank;

		if (quantity % 1 != 0 || quantity <= 0) return interaction.followUp('Informe um número inteiro!');

		if (quantity > profileData.bank) return interaction.followUp('Você não tem essa quantia de moedas!');

		if (isFinite(quantity)) {
			profileData.coins += parseInt(quantity);
			profileData.bank -= parseInt(quantity);
			profileData.save();

			return interaction.followUp(`Você retirou :coin: ${inlineCode(quantity)} Bananinhas Reais do seu banco!`);
		}
		else {
			return interaction.followUp('Informe um valor válido!');
		}
	},
};
