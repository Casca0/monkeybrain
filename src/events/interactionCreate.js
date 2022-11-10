const { Events, Collection } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		// Command cooldown

		const { cooldowns } = client;

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const cooldownAmount = command.cooldown || 3;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount * 1000;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;

				return await interaction.reply(`Por favor espere \`${timeLeft.toFixed(0)}\` segundos antes de usar o comando \`${command.data.name}\`.`);
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount * 1000);

		try {
			await command.execute(interaction);
		}
		catch (err) {
			interaction.reply('Ocorreu um erro ao tentar executar este comando!');
			console.error(err);
		}
	},
};
