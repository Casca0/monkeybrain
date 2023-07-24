const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		const defaultChannel = member.guild.systemChannel;
		const logChannel = member.guild.publicUpdatesChannel;

		const removeMessage = new EmbedBuilder({
			color: 0x18ed1f,
			title: 'Tchau macaquinho!',
			description: `Você não gostou da minha banana?\n😥 ${member}`,
			thumbnail: {
				url: member.user.avatarURL(),
			},
		});

		const fetchedLogs = await member.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberKick,
		});

		const kickLog = fetchedLogs.entries.first();

		if (!kickLog) return defaultChannel.send({ embeds: [removeMessage] });

		const { executor } = kickLog;
		const reason = kickLog.reason || '';

		const kickMessage = new EmbedBuilder({
			color: 0xb88e1d,
			title: 'Membro Removido',
			fields: [
				{
					name: 'Membro',
					value: member.user.tag,
				},
				{
					name: 'Motivo',
					value: reason,
				},
				{
					name: 'Responsável',
					value: executor.tag,
				},
			],
			timestamp: new Date().toISOString(),
		});

		logChannel.send({ embeds: [kickMessage] });
		defaultChannel.send({ embeds: [removeMessage] });
		return;
	},
};
