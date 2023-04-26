const { SlashCommandBuilder, inlineCode } = require('discord.js');
const { userModel } = require('../../database/models/UserData.js');

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

		if (quantity === 'tudo') quantity = profileData.coins;

		if (quantity % 1 != 0 || quantity <= 0) return interaction.followUp('O depósito tem que ser um número inteiro!');

		if (quantity > profileData.coins) return interaction.followUp('Você não tem essa quantia de moedas!');

		await userModel.findOneAndUpdate(
			{
				user_id: interaction.user.id,
			},
			{
				$inc: {
					coins: -quantity,
					bank: quantity,
				},
			},
		);

		return interaction.followUp(`Você depositou :coin:${inlineCode(quantity)} Bananinhas Reais no seu banco!`);
	},
};
