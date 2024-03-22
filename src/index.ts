import 'dotenv/config';
import { Client, Partials, GatewayIntentBits } from 'discord.js';
import { CommandKit } from 'commandkit';
import express from 'express';
import {
	CommandsPath,
	EventsPath,
} from '#bot/utils/constants';

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
});

new CommandKit({
	client,
	bulkRegister: true,
	commandsPath: CommandsPath,
	eventsPath: EventsPath,
});

await client.login();

process.on('unhandledRejection', (reason) => {
	console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught exception:', error);
});

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const port = 8080;

app.listen(port, () => {
	console.log(`helloworld: listening on port ${port}`);
});
