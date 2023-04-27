const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde com pong!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, profileData) {
		// const testArr = ['REI'];
		// const user = await interaction.guild.members.fetch({ user: interaction.user, cache: false });
		// const userRoles = user.roles.cache.toJSON();
		// console.log(userRoles.find(role => testArr.includes(role.name)));

		// const testUser = await userModel.findOneAndUpdate({
		// 	user_id: interaction.user.id,
		// }, {
		// 	profession: 'Desempregado',
		// });

		// console.log(testUser);

		await interaction.guild.members.fetch();

		const usersData = await userModel.find({});

		const rankingData = usersData.filter((user) => !interaction.guild.members.cache.find(member => member.id == user.user_id));

		rankingData.forEach(async (user, index) => await user.deleteOne().then(console.log(`Deletado ${index}`)));
		return interaction.followUp('POING!');
	},
};
