import type { CommandData, SlashCommandProps, CommandOptions } from 'commandkit';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export const data: CommandData = {
	name: 'bonk',
	description: 'Dê um bonk em alguém! (ADM)',
	options: [
		{
			name: 'membro',
			description: 'O membro que vai ser kickado.',
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: 'motivo',
			description: 'Motivo do kick. (Opcional)',
			type: ApplicationCommandOptionType.String,
		},
	],
};

export async function run({ interaction }: SlashCommandProps) {
	const user = interaction.options.getUser('membro', true);
	const kickReason = interaction.options.getString('motivo') || 'Sem motivo';
	const resolvedUser = interaction.guild!.members.resolve(user);

	await interaction.deferReply();

	const bonkMessage = new EmbedBuilder({
		color: 0xf21beb,
		title: 'BONK!',
		description: `Macaco jogou uma banana em ${user}!\nACERTO CRÍTICO`,
		image: {
			url: 'https://media.tenor.com/Xr8J9quvUHgAAAAC/bonk.gif',
		},
		timestamp: new Date().toISOString(),
		footer: {
			text: `Kickado por ${interaction.user.tag}`,
			iconURL: interaction.user.displayAvatarURL(),
		},
	});

	await resolvedUser?.kick(kickReason);

	return interaction.editReply({ embeds: [bonkMessage] });
}

export const options: CommandOptions = {
	guildOnly: true,
	userPermissions: ['Administrator', 'KickMembers'],
	deleted: false,
};
