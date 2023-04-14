const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde com pong!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, profileData) {
		console.log(profileData.inventory[0]);

		return interaction.followUp('POING!');
	},
};
