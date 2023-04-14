const { Events, Collection, inlineCode } = require('discord.js');
const { userModel } = require('../database/models/UserData.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		await interaction.deferReply();

		// Command cooldown

		const { cooldowns } = client;

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const timestamps = cooldowns.get(command.data.name);

		const cooldownAmount = command.cooldown || 3;

		const now = Date.now();

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount * 1000;

			if (now < expirationTime) {
				const timeLeftUnix = (expirationTime / 1000).toFixed(0);

				return interaction.followUp(`Você pode usar o comando ${inlineCode(command.data.name)} <t:${timeLeftUnix}:R>.`);
			}
		}

		timestamps.set(interaction.user.id, now);

		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount * 1000);

		// Database

		let profileData;
		try {
			profileData = await userModel.findOne({ user_id: interaction.user.id });
			if (!profileData) {
				await userModel.create({
					user_id: interaction.user.id,
				}).then(res => profileData = res);
			}
		}
		catch (err) {
			console.error(err);
		}

		// Executing command

		try {
			await command.execute(interaction, profileData);
		}
		catch (err) {
			console.error(err);
			return interaction.followUp(`Ocorreu um erro ao tentar executar este comando: ${err}`);
		}
	},
};
