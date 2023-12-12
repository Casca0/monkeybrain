import type { CommandData, SlashCommandProps, CommandOptions } from 'commandkit';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export const data: CommandData = {
	name: 'ceifar',
	description: 'Ceife alguém! (ADM)',
	options: [
		{
			name: 'membro',
			description: 'O membro que vai ser banido.',
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: 'motivo',
			description: 'Motivo do ban. (Opcional)',
			type: ApplicationCommandOptionType.String,
		},
	],
};

export async function run({ interaction }: SlashCommandProps) {
	const user = interaction.options.getUser('membro', true);
	const banReason = interaction.options.getString('motivo') || 'Sem motivo';
	const resolvedUser = interaction.guild!.members.resolve(user);

	await interaction.deferReply();

	const banMessage = new EmbedBuilder({
		color: 0xfc1e1e,
		title: 'CEIFADO',
		description: `Macaco ceifou ${user}!`,
		image: {
			url: 'https://media.tenor.com/dQ7r9eRygAwAAAAd/grim-reaper-scary.gif',
		},
		timestamp: new Date().toISOString(),
		footer: {
			text: `Banido por ${interaction.user.tag}`,
			iconURL: interaction.user.displayAvatarURL(),
		},
	});

	await resolvedUser?.ban({ reason: banReason });

	return interaction.editReply({ embeds: [banMessage] });
}

export const options: CommandOptions = {
	guildOnly: true,
	userPermissions: ['Administrator', 'BanMembers'],
	deleted: false,
};
