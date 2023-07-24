const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');

const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Ver carteira')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const userData = await userModel.findOne({ user_id: interaction.targetUser.id });

		if (!userData) return interaction.reply('Este user não possui uma carteira!');

		const adverts = userData.adverts;

		const userInventory = userData.inventory;

		const walletColor = parseInt(userData.wallet_color.replace(/^#/, '0x'));

		const walletButton = new ButtonBuilder({
			style: ButtonStyle.Primary,
			label: 'Carteira',
			emoji: '💰',
			customId: 'carteira',
			disabled: true,
		});

		const inventoryButton = new ButtonBuilder({
			style: ButtonStyle.Primary,
			label: 'Inventário',
			emoji: '🎒',
			customId: 'inventario',
		});

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
					inline: true,
				},
				{
					name: 'Advertências',
					value: `:warning: ${adverts.length}`,
					inline: true,
				},
				{
					name: 'Banco',
					value: `:coin: BR ${userData.bank}`,
				},
				{
					name: 'Multiplicador',
					value: `:chart_with_upwards_trend: ${userData.maceta_multiplier}x (max: 5x)`,
				},
				{
					name: 'Macetadas',
					value: `:monkey: ${userData.maceta_counter}`,
					inline: true,
				},
			],
		});

		const inventoryEmbed = new EmbedBuilder({
			title: 'Inventário',
			color: walletColor,
			thumbnail: {
				url: interaction.targetUser.avatarURL({ dynamic: true }),
			},
		});

		if (userInventory || userInventory.length > 0) {
			inventoryEmbed.setFields(await Promise.all(
				userInventory.map(async item => ({
					name: item.item_name.charAt(0).toUpperCase() + item.item_name.slice(1),
					value: `Quantia : \`${item.amount}\`\nID : \`${item.item_id}\``,
				})),
			));
		}

		const buttonRow = new ActionRowBuilder({
			components: [walletButton, inventoryButton],
		});

		const interactionReply = await interaction.reply({
			embeds: [walletEmbed],
			components: [buttonRow],
		});

		const buttonCollector = await interactionReply.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter: i => i.user.id === interaction.user.id,
		});

		buttonCollector.on('collect', async i => {
			if (i.customId == 'inventario') {
				walletButton.setDisabled(false);
				inventoryButton.setDisabled(true);
				await i.update({
					embeds: [inventoryEmbed],
					components: [buttonRow],
				});
			}
			else {
				walletButton.setDisabled(true);
				inventoryButton.setDisabled(false);
				await i.update({
					embeds: [walletEmbed],
					components: [buttonRow],
				});
			}
		});
	},
};
