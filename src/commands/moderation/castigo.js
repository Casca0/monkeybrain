const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('castigo')
		.setDescription('Coloque alguém de castigo (ADM)')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers || PermissionFlagsBits.Administrator)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Selecione um usuário')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('tempo')
				.setDescription('Tempo do castigo (Tempo padrão de 5 minutos)')
				.addChoices(
					{ name: '5min', value: 5 },
					{ name: '10min', value: 10 },
					{ name: '15min', value: 15 },
					{ name: '20min', value: 20 },
					{ name: '25min', value: 25 },
				),
		)
		.addStringOption(option =>
			option.setName('motivo')
				.setDescription('Motivo do castigo (Opcional)'),
		)
		.setDMPermission(false),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const time = interaction.options.getInteger('tempo') || 5;
		const reason = interaction.options.getString('motivo') || 'Sem motivo';
		const resolvedUser = interaction.guild.members.resolve(user);
		const formattedTime = time * 60000;

		const timeoutMessage = new EmbedBuilder({
			color: 0x2d9c91,
			title: 'PRESO!',
			description: `${user} foi preso na árvore do\nmacaco por ${time} minuto(s)!`,
			image: {
				url: 'https://media.tenor.com/sfjmw3A0qjUAAAAM/monkey-door-jumping.gif',
			},
			thumbnail: {
				url: user.avatarURL(),
			},
		});

		try {
			if (resolvedUser.isCommunicationDisabled()) {
				await resolvedUser.disableCommunicationUntil(null);
				return interaction.followUp(`${user} foi solto da árvore do macaco.`);
			}
			await resolvedUser.disableCommunicationUntil(Date.now() + formattedTime, reason);
			return interaction.followUp({ embeds: [timeoutMessage] });
		}
		catch (err) {
			console.error(err);
			return interaction.followUp('O user que você selecionou provavelmente não pode ser mutado!');
		}
	},
};
