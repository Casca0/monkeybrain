import { type GuildMember, EmbedBuilder } from 'discord.js';

export default async function guildMemberAdd(member: GuildMember) {
	const defaultChannel = member.guild.systemChannel;

	const welcomeMessage = new EmbedBuilder({
		color: 0xf0f714,
		title: 'Iniciativa Mammus Corp.',
		description: `Bem-vindo(a) macaquinho(a) tome uma banana 🍌\n${member.user}`,
		image: {
			url: member.user.displayAvatarURL(),
		},
	});

	if (member.user.bot) return;

	return defaultChannel?.send({ embeds: [welcomeMessage] });
}
