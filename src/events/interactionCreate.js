const { Events, Collection, inlineCode } = require('discord.js');
const { scheduleJob } = require('node-schedule');
const { Users } = require('../utils/db-objects.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		// Command cooldown

		const { cooldowns, jobCooldowns } = client;

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		if (!jobCooldowns.has(command.data.name)) {
			jobCooldowns.set(command.data.name, new Collection());
		}

		if (command.jobCooldown) {
			const jobTimestamps = jobCooldowns.get(command.data.name);

			const cooldownRule = command.rule || '*/3 * * * *';

			const now = Date.now() / 1000;

			const job = scheduleJob(cooldownRule, () => {
				jobTimestamps.delete(interaction.user.id);
				job.cancel();
			});

			if (jobTimestamps.has(interaction.user.id)) {
				const expirationTime = Date.parse(job.nextInvocation().toISOString()) / 1000;

				if (now < expirationTime) {
					return await interaction.reply(`Você pode usar o comando ${inlineCode(command.data.name)} <t:${expirationTime}:R>.`);
				}
			}

			jobTimestamps.set(interaction.user.id, now.toFixed(0));
		}
		else {
			const timestamps = cooldowns.get(command.data.name);

			const cooldownAmount = command.cooldown || 3;

			const now = Date.now();

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount * 1000;

				if (now < expirationTime) {
					const timeLeftUnix = (expirationTime / 1000).toFixed(0);

					return await interaction.reply(`Você pode usar o comando ${inlineCode(command.data.name)} <t:${timeLeftUnix}:R>.`);
				}
			}

			timestamps.set(interaction.user.id, now);

			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount * 1000);
		}

		// Database

		let profileData;
		try {
			profileData = await Users.findOne({
				where: {
					user_id: interaction.user.id,
				},
			});
			if (!profileData) {
				Users.create({
					user_id: interaction.user.id,
					server_id: interaction.guildId,
				});
			}
		}
		catch (err) {
			console.error(err);
		}

		// Executing command

		try {
			await command.execute(interaction, profileData, client);
		}
		catch (err) {
			if (interaction.replied) {
				console.error(err);
				return await interaction.followUp('Ocorreu um erro ao tentar executar este comando!');
			}
			else {
				console.error(err);
				return await interaction.reply('Ocorreu um erro ao tentar executar este comando!');
			}
		}
	},
};
