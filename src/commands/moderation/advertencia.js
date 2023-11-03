const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('advertencia')
		.setDescription('Comandos relacionados a advertências (ADM)')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers || PermissionFlagsBits.BanMembers || PermissionFlagsBits.Administrator)
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

		const logChannel = interaction.guild.publicUpdatesChannel;

		let record;
		try {
			record = await userModel.findOne({ user_id: user.id });
			if (!record) {
				await userModel.create({
					user_id: user.id,
				}).then(res => record = res);
			}
		}
		catch (err) {
			console.error(err);
		}

		if (command == 'criar') {
			const reason = interaction.options.getString('motivo') || 'Sem motivo';

			record.adverts.push({
				reason: reason,
			});

			record.save();

			const adverts = record.adverts;

			if (adverts.length >= 5) {
				const timeoutAmount = ((adverts.length * 5) * 60000) + Date.now();
				await resolvedUser.disableCommunicationUntil(timeoutAmount, `Excesso de advertências. Advertência mais recente: ${reason}`);
			}

			const logMessage = new EmbedBuilder({
				color: 0x6734eb,
				title: 'Membro Advertido',
				thumbnail: {
					url: user.avatarURL({ dynamic: true }),
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

			return interaction.reply({ embeds: [advertMessage] });
		}

		if (command == 'limpar') {
			if (resolvedUser.isCommunicationDisabled()) {
				await resolvedUser.disableCommunicationUntil(null);
			}

			const advertsLength = record.adverts.length;

			if (advertsLength == 0) {
				return interaction.reply('Este user não tem advertências.');
			}

			record.adverts.splice(0, advertsLength);

			record.save();

			return interaction.reply(`Advertências excluidas de ${user} : ${inlineCode(advertsLength)}`);
		}
	},
};
