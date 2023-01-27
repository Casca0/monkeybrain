const { SlashCommandBuilder, EmbedBuilder, bold } = require('discord.js');
const { Users } = require('../../utils/db-objects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ranking')
		.setDescription('Mostra os membros mais ricos do servidor!')
		.setDMPermission(false),
	async execute(interaction) {
		await interaction.guild.members.fetch();

		const usersData = await Users.findAll();

		const rankingData = usersData.sort((a, b) => (b.coins + b.bank) - (a.coins + a.bank))
			.filter(user => interaction.guild.members.cache.has(user.user_id)).slice(0, 10);

		const rankCard = new EmbedBuilder({
			title: 'Top 10 mais ricos do servidor',
			description: rankingData
				.map((user, position) => `${bold(position + 1)} - ${(interaction.guild.members.cache.get(user.user_id))}: ${user.coins} :dollar: - ${user.bank} :coin:`)
				.join('\n'),
			color: 0xa11a15,
		});

		return interaction.reply({ embeds: [rankCard] });
	},
};
