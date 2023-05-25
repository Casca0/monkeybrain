const { SlashCommandBuilder, EmbedBuilder, bold } = require('discord.js');
const { userModel } = require('../../database/models/UserData.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('macetaranking')
		.setDescription('Mostra os membros mais macetados do servidor!')
		.setDMPermission(false),
	async execute(interaction) {
		await interaction.guild.members.fetch();

		const usersData = await userModel.find({});

		const rankingData = usersData.sort((a, b) => b.maceta_counter - a.maceta_counter)
			.filter((user) => interaction.guild.members.cache.find(member => member.id == user.user_id)).slice(0, 10);

		const rankCard = new EmbedBuilder({
			title: 'Top 10 mais macetados do servidor',
			description: rankingData
				.map((user, position) => `${bold(position + 1)} - ${(interaction.guild.members.cache.find(member => member.id == user.user_id))}: :monkey: ${user.maceta_counter}`)
				.join('\n'),
			color: 0x4429cc,
		});

		return interaction.reply({ embeds: [rankCard] });
	},
};
