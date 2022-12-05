const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const { UserAdverts, Users } = require('../../utils/db-objects');
const { devLogChannelId, logChannelId } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('advertencia')
		.setDescription('Comandos relacionados a advertências (ADM)')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('criar')
				.setDescription('Adverta algúem! (ADM)')
				.addUserOption((option) =>
					option.setName('user')
						.setDescription('Selecione um usuário para advertir')
						.setRequired(true))
				.addStringOption((option) =>
					option.setName('motivo')
						.setDescription('Motivo da advertência (Opcional)')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('limpar')
				.setDescription('Limpe as advertências de alguém! (ADM)')
				.addUserOption((option) =>
					option.setName('user')
						.setDescription('Selecione um usuário para limpar')
						.setRequired(true)),
		)
		.setDMPermission(false),
	async execute(interaction) {
		const command = interaction.options.getSubcommand();
		const user = interaction.options.getUser('user');
		const resolvedUser = interaction.guild.members.resolve(user);
		const logChannel = interaction.guild.channels.cache.get(logChannelId) || interaction.guild.channels.cache.get(devLogChannelId);

		const userData = await Users.findOne({
			where: {
				user_id: user.id,
			},
		});

		if (command == 'criar') {
			const reason = interaction.options.getString('motivo') || 'Sem motivo';

			await UserAdverts.create({
				user_id: user.id,
				reason: reason,
			});

			const adverts = await userData.getAdverts();

			if (adverts.length >= 5) {
				const timeoutAmount = ((adverts.length * 5) * 60000) + Date.now();
				await resolvedUser.disableCommunicationUntil(timeoutAmount, `Excesso de advertências!
				\nAdvertência mais recente:
				\n${reason}`);
			}

			const logMessage = new EmbedBuilder({
				color: 0x6734eb,
				title: 'Membro Advertido',
				thumbnail: {
					url: interaction.user.avatarURL(),
				},
				fields: [
					{
						name: 'Membro',
						value: user.tag,
						inline: true,
					},
					{
						name: 'Responsável',
						value: interaction.user.tag,
						inline: true,
					},
					{
						name: 'Motivo',
						value: reason,
					},
				],
				timestamp: new Date().toISOString(),
			});

			logChannel.send({ embeds: [logMessage] });

			const advertMessage = new EmbedBuilder({
				color: 0xde542a,
				title: 'Advertência',
				thumbnail: {
					url: user.avatarURL(),
				},
				fields: [
					{
						name: 'Membro',
						value: `${user}`,
					},
					{
						name: 'Motivo',
						value: inlineCode(reason),
					},
				],
				timestamp: new Date().toISOString(),
			});

			return await interaction.reply({ embeds: [advertMessage] });
		}

		if (command == 'limpar') {
			if (resolvedUser.isCommunicationDisabled()) {
				await resolvedUser.disableCommunicationUntil(null);
			}

			const advertsAmount = await userData.cleanAdverts();

			return await interaction.reply(`Foram excluídas ${inlineCode(advertsAmount)} advertências de ${user}!`);
		}
	},
};
