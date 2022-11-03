const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`LOGADO COM SUCESSO COMO ${client.user.tag}!`);
	},
};
