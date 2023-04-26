const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventario')
		.setDescription('Veja o seu inventário!')
		.setDMPermission(false),
	async execute(interaction, profileData) {
		const userInventory = profileData.inventory;

		if (!userInventory || userInventory.length == 0) return interaction.followUp('Você não possui nenhum item!');

		const inventoryCard = new EmbedBuilder({
			title: 'Inventário',
			color: 0x0da31c,
			thumbnail: {
				url: interaction.user.avatarURL({ dynamic: true }),
			},
			fields: await Promise.all(
				userInventory.map(async item => ({
					name: item.item_name.charAt(0).toUpperCase() + item.item_name.slice(1),
					value: `Quantia : \`${item.amount}\`\nID : \`${item.item_id}\``,
				})),
			),
		});

		return interaction.followUp({ embeds: [inventoryCard] });
	},
};
