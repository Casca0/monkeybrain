import type {
	CommandData,
	SlashCommandProps,
	CommandOptions,
} from 'commandkit';
import {
	ApplicationCommandOptionType,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ComponentType,
	GuildMember,
} from 'discord.js';

export const data: CommandData = {
	name: 'enquetedeban',
	description: 'Abra a votação de ban. (ADM)',
	options: [
		{
			name: 'membro',
			description: 'O membro que vai ser banido.',
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: 'motivo',
			description: 'Motivo do ban. (Opcional)',
			type: ApplicationCommandOptionType.String,
		},
	],
	dm_permission: false,
};

export async function run({ interaction }: SlashCommandProps) {
	const user = interaction.options.getUser('membro', true);
	const banReason = interaction.options.getString('motivo') || 'Sem motivo';
	const resolvedUser = interaction.guild!.members.resolve(user);

	const users = await interaction.guild?.members.fetch();
	const adminUsers = users?.filter(
		(member) => member.permissions.has('Administrator') && !member.user.bot
	);

	const onlineAdmins = adminUsers?.filter(
		(member) => member.presence?.status !== 'offline'
	);

	await interaction.deferReply();

	const banEmbed = new EmbedBuilder({
		color: 0x8031e8,
		title: 'ENQUETE',
		fields: [
			{
				name: 'Usuário para ser banido',
				value: `${user}`,
			},
			{
				name: 'Motivo',
				value: `${banReason}`,
			},
			{
				name: 'Votos à favor',
				value: `0/${onlineAdmins?.size}`,
				inline: true,
			},
			{
				name: 'Votos contra',
				value: `0/${onlineAdmins?.size}`,
				inline: true,
			},
		],
		timestamp: new Date().toISOString(),
		footer: {
			text: `Banido por ${interaction.user.tag}`,
			iconURL: interaction.user.displayAvatarURL(),
		},
	});

	const okayButton = new ButtonBuilder({
		style: ButtonStyle.Success,
		label: 'Pode Ban',
		emoji: '👍',
		customId: 'okay',
	});
	const backButton = new ButtonBuilder({
		style: ButtonStyle.Danger,
		label: 'Tá suave',
		emoji: '👎',
		customId: 'back',
	});

	const reply = await interaction.editReply({
		embeds: [banEmbed],
		components: [
			new ActionRowBuilder<ButtonBuilder>({
				components: [okayButton, backButton],
			}),
		],
	});

	const collector = reply.createMessageComponentCollector({
		componentType: ComponentType.Button,
	});

	collector.on(
		'collect',
		async (intr: {
			member: GuildMember;
			customId: string;
			update: (arg0: {
				embeds: EmbedBuilder[];
				components: ActionRowBuilder<ButtonBuilder>[];
			}) => never;
		}) => {
			if (onlineAdmins?.find((member) => member === intr.member)) {
				const okayVotes = collector.collected.filter(
					(button) => button.customId === 'okay'
				).size;
				const againstVotes = collector.collected.filter(
					(button) => button.customId === 'back'
				).size;

				const embed = new EmbedBuilder({
					color: 0x8031e8,
					title: 'ENQUETE',
					fields: [
						{
							name: 'Usuário para ser banido',
							value: `${user}`,
						},
						{
							name: 'Motivo',
							value: `${banReason}`,
						},
						{
							name: 'Votos à favor',
							value: `${okayVotes}/${onlineAdmins?.size}`,
							inline: true,
						},
						{
							name: 'Votos contra',
							value: `${againstVotes}/${onlineAdmins?.size}`,
						},
					],
					timestamp: new Date().toISOString(),
					footer: {
						text: `Votação iniciada por ${interaction.user.tag}`,
						iconURL: interaction.user.displayAvatarURL(),
					},
				});

				if (okayVotes >= onlineAdmins?.size && okayVotes > againstVotes) {
					const successEmbed = new EmbedBuilder({
						color: 0x65e831,
						title: 'Usuário foi banido com sucesso',
						description: `${user}`,
						timestamp: new Date().toISOString(),
						footer: {
							text: 'Banido pelos ADMs',
							iconURL: interaction.client.user.displayAvatarURL(),
						},
					});

					await resolvedUser?.ban({
						reason: banReason,
					});

					return intr.update({
						embeds: [successEmbed],
						components: [],
					});
				} else if (
					againstVotes >= onlineAdmins?.size &&
					againstVotes > okayVotes
				) {
					const failureEmbed = new EmbedBuilder({
						color: 0xff0f4f,
						title: 'Usuário não foi banido.',
						description: `${user}`,
						timestamp: new Date().toISOString(),
						footer: {
							text: 'Banido pelos ADMs',
							iconURL: interaction.client.user.displayAvatarURL(),
						},
					});

					return intr.update({
						embeds: [failureEmbed],
						components: [],
					});
				} else {
					return intr.update({
						embeds: [embed],
						components: [
							new ActionRowBuilder<ButtonBuilder>({
								components: [okayButton, backButton],
							}),
						],
					});
				}
			}
		}
	);
}

export const options: CommandOptions = {
	userPermissions: ['Administrator', 'BanMembers'],
	deleted: false,
};
