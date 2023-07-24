const { Events, Collection, inlineCode } = require('discord.js');
const { userModel } = require('../database/models/UserData.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		const { cooldowns, commands } = client;

		const command = commands.get(interaction.commandName);

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

		// Command cooldown

		if (!interaction.isButton()) {
			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection());
			}
			const timestamps = cooldowns.get(command.data.name);

			const now = Date.now();

			if (profileData.maceta_starPower) {
				timestamps.delete(interaction.user.id);
				setTimeout(() => {
					profileData.maceta_starPower = false;
					profileData.save();
					return;
				}, 10000);
			}

			const cooldownAmount = command.cooldown || 3;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount * 1000;

				if (now < expirationTime) {
					const timeLeftUnix = (expirationTime / 1000).toFixed(0);

					return interaction.reply(`Você pode usar o comando ${inlineCode(command.data.name)} <t:${timeLeftUnix}:R>.`);
				}
			}

			timestamps.set(interaction.user.id, now);

			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount * 1000);

		}

		// Executing command

		if (interaction.isChatInputCommand()) {
			try {
				await command.execute(interaction, profileData);
			}
			catch (e) {
				console.error(e);
				return interaction.reply(`Ocorreu um erro\n${e}`);
			}
		}
		else if (interaction.isUserContextMenuCommand()) {
			try {
				await command.execute(interaction);
			}
			catch (e) {
				console.error(e);
				return interaction.reply(`Ocorreu um erro\n${e}`);
			}
		}
	},
};
