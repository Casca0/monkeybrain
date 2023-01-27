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
	async execute(interaction, profileData) {
		let quantity = interaction.options.getString('quantia');

		if (quantity == 'tudo') quantity = profileData.bank;

		if (quantity % 1 != 0 || quantity <= 0) return await interaction.reply('Informe um número inteiro!');

		if (quantity > profileData.bank) return await interaction.reply('Você não tem essa quantia de moedas!');

		profileData.coins += quantity;
		profileData.bank -= quantity;
		profileData.save();

		return await interaction.reply(`Você retirou :coin: ${inlineCode(quantity)} Bananinhas Reais do seu banco!`);
	},
};
