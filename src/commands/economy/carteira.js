const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('carteira')
		.setDescription('Comandos relacionados a carteira!')
		.setDMPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ver')
				.setDescription('Veja a sua carteira!'),
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
				.setName('imagem')
				.setDescription('Adicione uma imagem ou GIF na sua carteira!')
				.addStringOption(option =>
					option
						.setName('url')
						.setDescription('URL da image (imgur) ou GIF (tenor).')
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

		if (command === 'ver') {

			const walletColor = parseInt(profileData.wallet_color.replace(/^#/, '0x'));

			const adverts = profileData.adverts;

			const walletEmbed = new EmbedBuilder({
				title: `${profileData.wallet_name}`,
				color: walletColor,
				thumbnail: {
					url: interaction.user.avatarURL({ dynamic: true }),
				},
				image: {
					url: profileData.wallet_image,
				},
				fields: [
					{
						name: 'Carteira',
						value: `:dollar: BR ${profileData.coins}`,
					},
					{
						name: 'Banco',
						value: `:coin: BR ${profileData.bank}`,
					},
					{
						name: 'Macetadas',
						value: `:monkey: ${profileData.maceta_counter}`,
						inline: true,
					},
					{
						name: 'Advertências',
						value: `:warning: ${adverts.length}`,
						inline: true,
					},
				],
			});

			return interaction.followUp({ embeds: [walletEmbed] });
		}

		if (command === 'nome') {
			const newName = interaction.options.getString('nome');

			profileData.wallet_name = newName;
			profileData.save();

			return interaction.followUp(`O nome da sua carteira foi alterado para : ${inlineCode(newName)}`);
		}

		if (command === 'imagem') {
			const newImage = interaction.options.getString('url');
			const urlRegex = /^(https?|ftp):\/\/[^ "]+$/;
			const urlTest = urlRegex.test(newImage);

			if (!urlTest) {
				return interaction.followUp('Informe um link válido!');
			}

			profileData.wallet_image = newImage;
			profileData.save();

			const imageCard = new EmbedBuilder({
				title: 'Sua imagem',
				color: 0x42f584,
				image: {
					url: newImage,
				},
			});

			return interaction.followUp({ embeds: [imageCard], ephemeral: true });
		}

		if (command === 'cor') {
			const newColor = interaction.options.getString('cor');
			const regexForColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
			const testColor = regexForColor.test(newColor);

			if (!testColor) {
				return interaction.followUp('Informe um código HEX válido para uma cor!');
			}

			profileData.wallet_color = newColor;
			profileData.save();

			return interaction.followUp(`A cor da sua carteira foi alterada para : ${inlineCode(newColor)}`);
		}
	},
};
