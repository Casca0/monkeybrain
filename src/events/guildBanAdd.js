const { Events, AuditLogEvent, EmbedBuilder } = require('discord.js');
const { logChannelId, devLogChannelId } = require('../config.json');

module.exports = {
	name: Events.GuildBanAdd,
	async execute(ban) {
		const logChannel = ban.guild.channels.cache.get(logChannelId) || ban.guild.channels.cache.get(devLogChannelId);

		const fetchedLogs = await ban.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberBanAdd,
		});

		const banLog = fetchedLogs.entries.first();

		if (!banLog) return;

		const { executor, target } = banLog;

		const reason = banLog.reason || '';

		const banLogMessage = new EmbedBuilder({
			color: 0xb88e1d,
			title: 'Membro Kickado',
			fields: [
				{
					name: 'Membro',
					value: target.tag,
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

		logChannel.send({ embeds: [banLogMessage] });
	},
};
