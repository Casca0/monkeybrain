const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('verinventario')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const userData = await userModel.findOne({ user_id: interaction.targetUser.id });

		const userInventory = userData.inventory;

		if (!userInventory.length) return interaction.followUp(`${interaction.targetUser} não possui nenhum item!`);

		const inventoryCard = new EmbedBuilder({
			title: 'Inventário',
			color: 0x0da31c,
			thumbnail: {
				url: interaction.targetUser.avatarURL({ dynamic: true }),
			},
			fields: await Promise.all(
				userInventory.map(async item => ({
					name: item.item_name.charAt(0).toUpperCase() + item.item_name.slice(1),
					value: `Quantia : \`${item.amount}\`\nID:${item.item_id}`,
				})),
			),
		});

		return interaction.followUp({ embeds: [inventoryCard] });
	},
};
