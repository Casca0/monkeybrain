const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ceifar')
		.setDescription('Ceifa alguém! (ADM)')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers || PermissionFlagsBits.Administrator)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Selecione um usuário para ser ceifado')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('motivo')
				.setDescription('Motivo (Opcional)'))
		.setDMPermission(false),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('motivo') || 'Sem motivo';
		const resolvedUser = interaction.guild.members.resolve(user);

		const banMessage = new EmbedBuilder({
			color: 0xfc1e1e,
			title: 'CEIFADO',
			description: `Macaco ceifou ${user}!`,
			thumbnail: {
				url: user.avatarURL(),
			},
			image: {
				url: 'https://media.tenor.com/dQ7r9eRygAwAAAAd/grim-reaper-scary.gif',
			},
		});

		try {
			interaction.reply({ embeds: [banMessage] });
			return await resolvedUser.ban({ reason: `${reason}` });
		}
		catch (err) {
			console.error(err);
			return interaction.reply('O user que você selecionou provavelmente não pode ser banido!');
		}
	},
};
