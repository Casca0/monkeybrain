/* eslint-disable no-unused-vars */
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client, sequelize) {
		console.log(`LOGADO COM SUCESSO COMO ${client.user.tag}!`);
		// try {
		// 	await sequelize.authenticate();
		// 	console.log('CONECTADO NO BANCO DE DADOS!');
		// }
		// catch (err) {
		// 	console.error('DEU RUIM', err);
		// }
	},
};
