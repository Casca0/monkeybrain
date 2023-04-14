const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventario')
		.setDescription('Comandos relacionados ao inventário de itens!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('ver')
				.setDescription('Ver o inventário de alguém.')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('Selecione algúem para ver o inventário.')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('mostrar')
				.setDescription('Mostrar o seu inventário.'),
		)
		.setDMPermission(false),
	async execute(interaction, profileData) {
		const command = interaction.options.getSubcommand();

		if (command == 'ver') {
			const user = interaction.options.getUser('user');

			const userData = await userModel.findOne({ user_id: user.id });

			const userInventory = userData.inventory;

			if (!userInventory || userInventory.length == 0) return interaction.followUp(`${user} não possui nenhum item!`);

			const inventoryCard = new EmbedBuilder({
				title: 'Inventário',
				color: 0x0da31c,
				thumbnail: {
					url: user.avatarURL({ dynamic: true }),
				},
				fields: await Promise.all(
					userInventory.map(async item => ({
						name: item.item_name.charAt(0).toUpperCase() + item.item_name.slice(1),
						value: `Quantia : \`${item.amount}\`\nID:${item.item_id}`,
					})),
				),
			});

			return interaction.followUp({ embeds: [inventoryCard] });
		}

		if (command == 'mostrar') {
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
		}
	},
};
