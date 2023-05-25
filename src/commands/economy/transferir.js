const { SlashCommandBuilder, inlineCode } = require('discord.js');
const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transferir')
		.setDescription('Transfira uma quantia para um user!')
		.addStringOption(option =>
			option
				.setName('quantia')
				.setDescription('Quantidade à ser trasferida. (Informe "tudo" para selecionar todas as moedas)')
				.setRequired(true),
		)
		.addUserOption(option =>
			option
				.setName('membro')
				.setDescription('Escolha o membro que irá receber.')
				.setRequired(true),
		)
		.setDMPermission(false),
	async execute(interaction, profileData) {
		let quantity = interaction.options.getString('quantia');

		const user = interaction.options.getUser('membro');

		const userWallet = await userModel.findOne({ user_id: user.id });

		if (quantity == 'tudo') quantity = profileData.coins;

		if (quantity % 1 != 0 || quantity <= 0) return interaction.reply('Informe um número inteiro!');

		if (quantity > profileData.coins) return interaction.reply('Você não tem essa quantia de moedas!');

		profileData.coins -= quantity;
		userWallet.coins += quantity;

		profileData.save();
		userWallet.save();

		return interaction.reply(`Você transferiu :coin: ${inlineCode(quantity)} Bananinhas Reais para ${user}!`);
	},
};
