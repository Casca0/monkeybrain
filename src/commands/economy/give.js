const { SlashCommandBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Dê moedas a um membro (ADM)')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addIntegerOption(option =>
			option
				.setName('quantia')
				.setDescription('Quantidade à ser dada.')
				.setRequired(true),
		)
		.addUserOption(option =>
			option
				.setName('membro')
				.setDescription('Selecione um membro que vai receber as moedas, deixe vazio caso seja para si mesmo.'),
		)
		.setDMPermission(false),
	async execute(interaction, profileData) {
		const quantity = interaction.options.getInteger('quantia');
		const user = interaction.options.getUser('membro');

		if (user) {
			const userWallet = await userModel.findOne({ user_id: user.id });

			userWallet.coins += quantity;
			userWallet.save();

			return interaction.followUp({ content: `Você deu :coin: ${inlineCode(quantity)} Bananinhas Reais para ${user}!`, ephemeral: true });
		}

		profileData.coins += quantity;
		profileData.save();

		return interaction.followUp({ content: `Você deu para si :coin: ${inlineCode(quantity)} Bananinhas Reais!`, ephemeral: true });
	},
};
