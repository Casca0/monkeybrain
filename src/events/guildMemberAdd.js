const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member, client) {
		client.newUsers.set(member.id, member.user);

		const defaultChannel = member.guild.channels.cache.get(member.guild.systemChannelId);
		const userList = client.newUsers.map(u => u.toString()).join(' ');

		const welcomeMessage = new EmbedBuilder({
			color: 0xf0f714,
			title: 'Iniciativa Mammus Corp.',
			description: 'Bem-vindo(a) macaquinho(a) tome uma banana 🍌\n' + userList,
			thumbnail: {
				url: member.user.avatarURL(),
			},
		});

		defaultChannel.send({ embeds: [welcomeMessage] });
	},
};
