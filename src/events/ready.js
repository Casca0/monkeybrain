const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Conectado como ${client.user.tag}!`);
		client.user.setActivity('b a n a n a', { type: ActivityType.Watching });
		return;
	},
};
