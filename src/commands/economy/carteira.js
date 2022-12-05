const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require('discord.js');
const { Users } = require('../../utils/db-objects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('carteira')
		.setDescription('Comandos relacionados a carteira!')
		.setDMPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('mostrar')
				.setDescription('Mostra a sua carteira!'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ver')
				.setDescription('Ver a carteira de alguém!')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('Caso queira ver a carteira de alguém, selecione o user!')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('nome')
				.setDescription('Mude o nome da sua carteira!')
				.addStringOption(option =>
					option
						.setName('nome')
						.setDescription('Caso queira mudar o nome da sua carteira, digite aqui o novo nome!')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('cor')
				.setDescription('Mude a cor da sua carteira!')
				.addStringOption(option =>
					option
						.setName('cor')
						.setDescription('Caso queira mudar a cor da sua carteira, digite aqui a cor!')
						.setRequired(true),
				),
		),
	async execute(interaction, profileData) {

		const command = interaction.options.getSubcommand();

		if (command == 'mostrar') {

			const walletColor = parseInt(profileData.wallet_color.replace(/^#/, ''), 16);

			const walletEmbed = new EmbedBuilder({
				title: `${profileData.wallet_name}`,
				color: walletColor,
				thumbnail: {
					url: interaction.user.avatarURL({ dynamic: true }),
				},
				fields: [
					{
						name: 'Carteira',
						value: `:dollar: BR ${profileData.coins}`,
						inline: true,
					},
					{
						name: 'Banco',
						value: `:coin: BR ${profileData.bank}`,
						inline: true,
					},
					{
						name: 'Contador Macetância',
						value: `:monkey: ${profileData.maceta_counter}`,
					},
				],
			});

			return await interaction.reply({ embeds: [walletEmbed] });
		}

		if (command == 'ver') {
			const member = interaction.options.getUser('user');
			const userData = await Users.findOne({
				where: {
					user_id: member.id,
				},
			});

			if (!userData) return await interaction.reply('Este user não possui uma carteira!');

			const walletColor = parseInt(userData.wallet_color.replace(/^#/, ''), 16);

			const walletEmbed = new EmbedBuilder({
				title: `${userData.wallet_name}`,
				color: walletColor,
				thumbnail: {
					url: member.avatarUrl({ dynamic: true }),
				},
				fields: [
					{
						name: 'Carteira',
						value: `:dollar: BR ${userData.coins}`,
						inline: true,
					},
					{
						name: 'Banco',
						value: `:coin: BR ${userData.bank}`,
						inline: true,
					},
					{
						name: 'Contador Macetância',
						value: `:monkey: BR ${userData.maceta_counter}`,
						inline: true,
					},
				],
			});

			return await interaction.reply({ embeds: [walletEmbed] });
		}

		if (command == 'nome') {
			const newName = interaction.options.getString('nome');
			profileData.wallet_name = newName;
			profileData.save();

			return await interaction.reply(`O nome da sua carteira foi alterado para : ${inlineCode(newName)}`);
		}

		if (command == 'cor') {
			const newColor = interaction.options.getString('cor');
			const regexForColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
			const testColor = regexForColor.test(newColor);

			if (!testColor) {
				return await interaction.reply('Informe um código HEX válido para uma cor!');
			}

			profileData.wallet_color = newColor;
			profileData.save();

			return await interaction.reply(`A cor da sua carteira foi alterada para : ${inlineCode(newColor)}`);
		}
	},
};
