import type { CommandData, SlashCommandProps, CommandOptions } from 'commandkit';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export const data: CommandData = {
	name: 'castigo',
	description: 'Coloque alguém de castigo! (ADM)',
	options: [
		{
			name: 'membro',
			description: 'O membro que vai ser castigado.',
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: 'tempo',
			description: 'Tempo do castigo. (Padrão de 5min)',
			type: ApplicationCommandOptionType.Integer,
			choices: [
				{
					name: '5min',
					value: 5,
				},
				{
					name: '10min',
					value: 10,
				},
				{
					name: '15min',
					value: 15,
				},
				{
					name: '20min',
					value: 20,
				},
				{
					name: '25min',
					value: 25,
				},
			],
		},
		{
			name: 'motivo',
			description: 'Motivo do castigo. (Opcional)',
			type: ApplicationCommandOptionType.String,
		},
	],
};

export async function run({ interaction }: SlashCommandProps) {
	const user = interaction.options.getUser('membro', true);
	const timeoutAmount = interaction.options.getInteger('tempo') || 5;
	const timeoutReason = interaction.options.getString('motivo') || 'Sem motivo';
	const resolvedUser = interaction.guild!.members.resolve(user);
	const formattedTimeoutAmount = timeoutAmount * 60000;

	if (resolvedUser?.isCommunicationDisabled()) {
		await resolvedUser.disableCommunicationUntil(null);
		return interaction.reply(`${user} foi solto da árvore do macaco.`);
	}

	await interaction.deferReply();

	const timeoutMessage = new EmbedBuilder({
		color: 0x2d9c91,
		title: 'PRESO!',
		description: `${user} foi preso na árvore do\nmacaco por ${timeoutAmount} minuto(s)!`,
		image: {
			url: 'https://media.tenor.com/sfjmw3A0qjUAAAAM/monkey-door-jumping.gif',
		},
		timestamp: new Date().toISOString(),
		footer: {
			text: `Castigado por ${interaction.user.tag}`,
			iconURL: interaction.user.displayAvatarURL(),
		},
	});

	await resolvedUser!.disableCommunicationUntil(Date.now() + formattedTimeoutAmount, timeoutReason);
	return interaction.editReply({ embeds: [timeoutMessage] });
}

export const options: CommandOptions = {
	guildOnly: true,
	userPermissions: ['Administrator', 'KickMembers'],
	deleted: false,
};
