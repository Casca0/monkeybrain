const { SlashCommandBuilder, inlineCode } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('depositar')
		.setDescription('Deposite suas moedas no banco!')
		.addStringOption(option =>
			option
				.setName('quantia')
				.setDescription('Quantidade à ser depositada. (Informe "tudo" para selecionar todas as moedas)')
				.setRequired(true),
		)
		.setDMPermission(false),
	async execute(interaction, profileData) {
		let quantity = interaction.options.getString('quantia');

		if (quantity == 'tudo') quantity = profileData.coins;

		if (quantity % 1 != 0 || quantity <= 0) return await interaction.reply('O depósito tem que ser um número inteiro!');

		if (quantity > profileData.coins) return await interaction.reply('Você não tem essa quantia de moedas!');

		profileData.coins -= quantity;
		profileData.bank += quantity;
		profileData.save();

		return await interaction.reply(`Você depositou :coin: ${inlineCode(quantity)} Bananinhas Reais no seu banco!`);
	},
};
