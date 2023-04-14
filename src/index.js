require('dotenv/config');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
} = require('discord.js');
const mongoose = require('mongoose');

const token = process.env['DISCORD_TOKEN'];

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
});

client.commands = new Collection();
client.newUsers = new Collection();
client.cooldowns = new Collection();

// Command handler

const commandsPath = path.join(__dirname, 'commands');

const commandsFolders = fs.readdirSync(commandsPath);

for (const folder of commandsFolders) {
	const commandFiles = fs
		.readdirSync(`${commandsPath}/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`${commandsPath}/${folder}/${file}`);

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(
				`[ERRO] O commando em ${folder} está sem as propriedades requeridas!`,
			);
		}
	}
}

// Event handler

const eventsPath = path.join(__dirname, 'events');

const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Server

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const port = 8080;
app.listen(port, () => {
	console.log(`helloworld: listening on port ${port}`);
});

// Database

mongoose.connect(process.env.MONGO_TOKEN, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('Conectei ao banco de dados!');
}).catch((err) => {
	console.log(err);
});

client.login(token);
