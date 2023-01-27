const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client, sequelize) {
		console.log(`LOGADO COM SUCESSO COMO ${client.user.tag}!`);
		client.user.setActivity('b a n a n a', { type: ActivityType.Watching });

		try {
			await sequelize.authenticate();
			console.log('Conectado ao banco de dados!');
		}
		catch (err) {
			console.error('Erro no banco de dados!', err);
		}
	},
};
