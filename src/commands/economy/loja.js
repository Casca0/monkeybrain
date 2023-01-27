const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ActionRowBuilder, inlineCode, ComponentType, ButtonStyle } = require('discord.js');
const shop = require('../../database/models/ShopItems').items;
const { UserItems } = require('../../utils/db-objects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loja')
		.setDescription('Comandos relacionados a loja do bot!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('mostrar')
				.setDescription('Mostra os itens da loja!'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('comprar')
				.setDescription('Compre um item da loja!')
				.addIntegerOption(option =>
					option
						.setName('id')
						.setDescription('ID do item que deseja comprar.')
						.setRequired(true),
				)
				.addIntegerOption(option =>
					option
						.setName('quantidade')
						.setDescription('Quantidade do item.')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('vender')
				.setDescription('Venda um item!')
				.addIntegerOption(option =>
					option
						.setName('id')
						.setDescription('ID do item que deseja vender')
						.setRequired(true),
				)
				.addIntegerOption(option =>
					option
						.setName('quantidade')
						.setDescription('Quantidade do item.')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Mostrar informações sobre um item da loja!')
				.addIntegerOption(option =>
					option
						.setName('id')
						.setDescription('ID do item.')
						.setRequired(true),
				),
		)
		.setDMPermission(false),
	async execute(interaction, profileData) {
		const command = interaction.options.getSubcommand();

		if (command == 'info') {
			const itemId = interaction.options.getInteger('id');
			const item = shop.filter(items => { return items.itemID == itemId; });

			if (!item) return await interaction.reply('Informe um item válido!');

			const itemUseDescription = item[0].useDescription || 'Não possui uso.';

			const infoCard = new EmbedBuilder({
				title: ':information_source: Info',
				color: 0xfff,
				fields: [
					{
						name: 'Nome do item',
						value: inlineCode(item[0].name),
					},
					{
						name: 'Uso do item',
						value: inlineCode(itemUseDescription),
					},
					{
						name: 'Custo do item',
						value: ':coin: ' + inlineCode(item[0].cost),
					},
				],
				timestamp: new Date().toISOString(),
			});

			return await interaction.reply({ embeds: [infoCard] });
		}

		if (command == 'comprar') {
			const itemId = interaction.options.getInteger('id');
			const itemQuantity = interaction.options.getInteger('quantidade');

			const item = shop.filter(items => { return items.itemID == itemId; });

			if (!item) return await interaction.reply('Informe um item válido!');

			const itemCost = item[0].cost * itemQuantity;

			const getItemInInventory = await UserItems.findOne({
				where: {
					user_id: interaction.user.id,
					item_name: item[0].name,
				},
			});

			const transactionReceipt = new EmbedBuilder({
				title: 'Recibo',
				color: 0xffffff,
				image: {
					url: 'https://media.tenor.com/jJKcXYqft4AAAAAC/hehehe.gif',
				},
				fields: [
					{
						name: 'Item',
						value: inlineCode(item[0].name),
						inline: true,
					},
					{
						name: 'Quantidade',
						value: inlineCode(itemQuantity),
						inline: true,
					},
					{
						name: 'Custo',
						value: ':coin: ' + inlineCode(itemCost),
					},
				],
				timestamp: new Date().toISOString(),
				footer: {
					text: 'Muito obrigado por sua compra!',
				},
			});

			if (itemCost > profileData.coins) {
				return await interaction.reply('Você não tem moedas suficientes para comprar este item!');
			}

			if (getItemInInventory) {
				getItemInInventory.amount += itemQuantity;
				getItemInInventory.save();

				profileData.coins -= itemCost;
				profileData.save();

				return interaction.reply({ embeds: [transactionReceipt] });
			}
			else {
				try {
					await UserItems.create({
						user_id: interaction.user.id,
						item_id: item[0].itemID,
						item_name: item[0].name,
						amount: itemQuantity,
					});

					profileData.coins -= itemCost;
					profileData.save();

					return interaction.reply({ embeds: [transactionReceipt] });
				}
				catch (err) {
					console.error(err);
					return interaction.reply('Ocorreu um erro ao criar o inventário!');
				}
			}
		}

		if (command == 'vender') {
			const itemId = interaction.options.getInteger('id');
			const itemQuantity = interaction.options.getInteger('quantidade');

			const item = shop.filter(items => { return items.itemID == itemId; });

			if (!item) return await interaction.reply('Informe um item válido!');

			const sellCost = (item[0].cost * itemQuantity) * (75 / 100);

			const getItemInInventory = await UserItems.findOne({
				where: {
					user_id: interaction.user.id,
					item_name: item[0].name,
				},
			});

			if (!getItemInInventory) return await interaction.reply('Você não possui este item!');

			if (itemQuantity > getItemInInventory.amount) return await interaction.reply('Você não possui essa quantia deste item!');

			if (getItemInInventory.amount == 1 || getItemInInventory.amount - itemQuantity <= 0) {
				getItemInInventory.destroy();
			}
			else {
				getItemInInventory.amount -= itemQuantity;
				getItemInInventory.save();
			}

			profileData.coins += sellCost;
			profileData.save();

			const transactionReceipt = new EmbedBuilder({
				title: 'Comprovante de venda',
				color: 0xffffff,
				fields: [
					{
						name: 'Item',
						value: inlineCode(item[0].name),
						inline: true,
					},
					{
						name: 'Quantidade',
						value: inlineCode(itemQuantity),
						inline: true,
					},
					{
						name: 'Custo',
						value: ':coin: ' + inlineCode(sellCost),
					},
				],
				timestamp: new Date().toISOString(),
			});

			return await interaction.reply({ embeds: [transactionReceipt] });
		}

		if (command == 'mostrar') {
			try {
				const backButtonId = 'back';
				const forwardButtonId = 'forward';

				// Shop buttons

				const backButton = new ButtonBuilder({
					style: ButtonStyle.Secondary,
					label: 'Voltar',
					emoji: '⬅️',
					customId: backButtonId,
				});

				const forwardButton = new ButtonBuilder({
					style: ButtonStyle.Secondary,
					label: 'Seguir',
					emoji: '➡️',
					customId: forwardButtonId,
				});

				// Generate shop

				const generateShopEmbed = async start => {
					const currentPage = shop.slice(start, start + 5);

					return new EmbedBuilder({
						title: 'Loja do Negão!',
						color: 0xfcba03,
						image: {
							url: 'https://media.tenor.com/h_j-gA2isIcAAAAC/residentevil-merchant.gif',
						},
						fields: await Promise.all(
							currentPage.map(async (shopItem) => ({
								name: `${shopItem.itemID} - ` + shopItem.name.charAt(0).toUpperCase() + shopItem.name.slice(1),
								value: `:coin: ${inlineCode(shopItem.cost)}`,
							})),
						),
						timestamp: new Date().toISOString(),
					});
				};

				const canFitInOnePage = shop.length <= 5;

				const interactionReply = await interaction.reply({
					embeds: [await generateShopEmbed(0)],
					components: canFitInOnePage ? [] : [new ActionRowBuilder({
						components: [forwardButton],
					})],
				});

				if (canFitInOnePage) return;

				const buttonCollector = interactionReply.createMessageComponentCollector({
					componentType: ComponentType.Button,
				});

				let currentIndex = 0;

				buttonCollector.on('collect', async intr => {
					if (intr.user.id != interaction.user.id) return;

					intr.customId === backButtonId ? (currentIndex -= 5) : (currentIndex += 5);

					await intr.update({
						embeds: [await generateShopEmbed(currentIndex)],
						components: [
							new ActionRowBuilder({
								components: [
									...(currentIndex ? [backButton] : []),
									...(currentIndex + 5 < shop.length ? [forwardButton] : []),
								],
							}),
						],
					});
				});
			}
			catch (err) {
				console.error(err);
				return await interaction.reply('Ocorreu um erro ao gerar a loja!');
			}
		}
	},
};
