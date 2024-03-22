import type { CommandData, SlashCommandProps, CommandOptions } from 'commandkit';

export const data: CommandData = {
	name: 'ping',
	description: 'Pong!',
	dm_permission: false,
};

export async function run({ interaction, client }: SlashCommandProps) {
	const users = await interaction.guild?.members.fetch();
	const adminUsers = users?.filter(
		(member) => member.permissions.has('Administrator') && !member.user.bot
	);

	console.log(adminUsers?.size);

	interaction.reply(`:ping_pong: Pong! ${client.ws.ping}ms`);
}
export const options: CommandOptions = {
	userPermissions: ['Administrator', 'AddReactions'],
	deleted: false,
};
