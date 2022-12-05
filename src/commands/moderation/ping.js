const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde com pong!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	// rule: '0 */2 * * *',
	// jobCooldown: true,
	async execute(interaction, profileData) {

		console.log(profileData);

		return await interaction.reply('POING!');
	},
};
