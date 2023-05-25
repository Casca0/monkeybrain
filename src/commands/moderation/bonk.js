const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bonk')
		.setDescription('Dê um bonk em alguém! (ADM)')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers || PermissionFlagsBits.Administrator)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Selecione um usuário para dar bonk')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('motivo')
				.setDescription('Motivo do bonk (Opcional)'))
		.setDMPermission(false),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('motivo') || 'Sem motivo';
		const resolvedUser = interaction.guild.members.resolve(user);

		const bonkMessage = new EmbedBuilder({
			color: 0xf21beb,
			title: 'BONK!',
			description: `Macaco jogou uma banana em ${user}!\nACERTO CRÍTICO`,
			image: {
				url: 'https://media.tenor.com/Xr8J9quvUHgAAAAC/bonk.gif',
			},
			timestamp: new Date().toISOString(),
		});

		try {
			interaction.reply({ embeds: [bonkMessage] });
			return await resolvedUser.kick(reason);
		}
		catch (err) {
			console.error(err);
			return interaction.reply('O user que você selecionou provavelmente não pode ser kickado!');
		}
	},
};
