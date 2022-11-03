const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`Nenhum comando com o nome de ${interaction.commandName} foi encontrado!`);
			return;
		}

		try {
			await command.execute(interaction);
		}
		catch (err) {
			interaction.reply('Ocorreu um erro ao tentar executar este comando!');
			console.error(err);
		}
	},
};
