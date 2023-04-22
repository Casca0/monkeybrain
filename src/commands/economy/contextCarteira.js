const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('vercarteira')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const userData = await userModel.findOne({ user_id: interaction.targetUser.id });

		if (!userData) return interaction.followUp('Este user não possui uma carteira!');

		const adverts = userData.adverts;

		const walletColor = parseInt(userData.wallet_color.replace(/^#/, '0x'));

		const walletEmbed = new EmbedBuilder({
			title: `${userData.wallet_name}`,
			color: walletColor,
			thumbnail: {
				url: interaction.targetUser.avatarURL({ dynamic: true }),
			},
			fields: [
				{
					name: 'Carteira',
					value: `:dollar: BR ${userData.coins}`,
				},
				{
					name: 'Banco',
					value: `:coin: BR ${userData.bank}`,
				},
				{
					name: 'Macetadas',
					value: `:monkey: ${userData.maceta_counter}`,
					inline: true,
				},
				{
					name: 'Advertências',
					value: `:warning: ${adverts.length}`,
					inline: true,
				},
			],
		});

		return interaction.followUp({ embeds: [walletEmbed] });
	},
};
