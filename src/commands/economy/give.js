const { SlashCommandBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const { Users } = require('../../utils/db-objects');

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
			const userWallet = await Users.findOne({
				where: {
					user_id: user.id,
				},
			});

			userWallet.coins += quantity;
			userWallet.save();

			return await interaction.reply({ content: `Você deu :coin: ${inlineCode(quantity)} Bananinhas Reais para ${user}!`, ephemeral: true });
		}

		profileData.coins += quantity;
		profileData.save();

		return await interaction.reply({ content: `Você deu para si :coin: ${inlineCode(quantity)} Bananinhas Reais!`, ephemeral: true });
	},
};
