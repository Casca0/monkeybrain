const { SlashCommandBuilder } = require('discord.js');

const shop = require('../../database/models/ShopItems').items;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('usar')
		.setDescription('Use um item do seu inventário!')
		.addBooleanOption(option =>
			option.setName('use').setDescription('usar tudo?').setRequired(true),
		)
		.addIntegerOption(option =>
			option.setName('id').setDescription('ID do item.').setRequired(true),
		)
		.setDMPermission(false),
	async execute(interaction, profileData) {
		const itemID = interaction.options.getInteger('id');

		const item = shop.find(items => items.itemID == itemID);

		if (!item) return interaction.reply('Informe um item válido!');

		const getItemInInventory = profileData.inventory.find(it => it.item_name == item.name);

		if (!getItemInInventory) return interaction.reply('Você não tem este item no inventário.');

		if (interaction.options.getBoolean('use') && getItemInInventory.amount > 1) {
			for (let index = 0; index <= getItemInInventory.amount; index++) {
				await item.use(interaction, profileData);
			}
			return;
		}

		item.use(interaction, profileData);

		if (getItemInInventory.amount == 1) {
			const index = profileData.inventory.findIndex(it => it.item_name == item.name);
			profileData.inventory.splice(index, 1);
		}
		else {
			getItemInInventory.amount -= 1;
		}

		profileData.save();

		return;
	},
};
