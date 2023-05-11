const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Ver advertências')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const userData = await userModel.findOne({ user_id: interaction.targetUser.id });

		if (!userData) return interaction.followUp('Este user não possui uma carteira.');

		const adverts = userData.adverts;

		if (!adverts.length) return interaction.followUp('Este user não tem advertências.');

		const advertsEmbed = new EmbedBuilder({
			title: 'Advertências',
			description: `${interaction.targetUser}`,
			thumbnail: {
				url: interaction.targetUser.avatarURL({ dynamic: true }),
			},
			fields: adverts.map((advert, position) => ({
				name: `${position + 1} - ${advert.reason}`,
				value: `<t:${(advert.date / 1000).toFixed(0)}:d>`,
			})),
		});

		return interaction.followUp({ embeds: [advertsEmbed] });
	},
};
