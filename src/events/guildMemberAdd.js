const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	execute(member, client) {
		client.newUsers.set(member.id, member.user);

		const defaultChannel = member.guild.systemChannel;
		const userList = client.newUsers.map(u => u.toString()).slice(-1);

		const welcomeMessage = new EmbedBuilder({
			color: 0xf0f714,
			title: 'Iniciativa Mammus Corp.',
			description: 'Bem-vindo(a) macaquinho(a) tome uma banana 🍌\n' + userList,
			thumbnail: {
				url: member.user.avatarURL(),
			},
		});

		return defaultChannel.send({ embeds: [welcomeMessage] });
	},
};
