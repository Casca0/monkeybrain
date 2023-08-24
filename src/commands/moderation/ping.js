const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde com pong!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, profileData) {

		console.log(interaction.client.newUsers.map(u => u.toString()).slice(-1));

		return interaction.reply('POING!');
	},
};
