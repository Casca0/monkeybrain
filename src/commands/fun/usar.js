const { SlashCommandBuilder } = require('discord.js');

const shop = require('../../database/models/ShopItems').items;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('usar')
		.setDescription('Use um item do seu inventário!')
		.addIntegerOption(option =>
			option.setName('id').setDescription('ID do item.').setRequired(true),
		)
		.setDMPermission(false),
	execute(interaction, profileData) {
		const itemID = interaction.options.getInteger('id');

		const item = shop.find(items => items.itemID == itemID);

		if (!item) return interaction.followUp('Informe um item válido!');

		item.use(interaction, profileData);

		const getItemInInventory = profileData.inventory.find(it => it.item_name == item.name);

		if (!getItemInInventory) return interaction.followUp('Você não tem este item no inventário.');

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
