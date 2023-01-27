const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { Users } = require('../../utils/db-objects');

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

			const userData = await Users.findOne({
				where: {
					user_id: user.id,
				},
			});

			const userInventory = await userData.getItems();

			if (!userInventory || userInventory.length == 0) return await interaction.reply(`${user} não possui nenhum item!`);

			const inventoryCard = new EmbedBuilder({
				title: 'Inventário',
				color: 0x0da31c,
				thumbnail: {
					url: user.avatarURL(),
				},
				fields: await Promise.all(
					userInventory.map(async item => ({
						name: item.item_name.charAt(0).toUpperCase() + item.item_name.slice(1) + ` - Quantia : \`${item.amount}\``,
						value: item.item_useDescription == '' ? 'Não possui uso.' : item.item_useDescription,
					})),
				),
			});

			return await interaction.reply({ embeds: [inventoryCard] });
		}

		if (command == 'mostrar') {
			const userInventory = await profileData.getItems();

			if (!userInventory || userInventory.length == 0) return await interaction.reply('Você não possui nenhum item!');

			const inventoryCard = new EmbedBuilder({
				title: 'Inventário',
				color: 0x0da31c,
				thumbnail: {
					url: interaction.user.avatarURL(),
				},
				fields: await Promise.all(
					userInventory.map(async item => ({
						name: item.item_name.charAt(0).toUpperCase() + item.item_name.slice(1),
						value: `Quantia : \`${item.amount}\``,
					})),
				),
			});

			return await interaction.reply({ embeds: [inventoryCard] });
		}
	},
};
