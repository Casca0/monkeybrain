const { Events } = require('discord.js');

module.exports = {
	name: Events.Error,
	execute(error) {
		return console.error('ERRO DO BOT', error);
	},
};
