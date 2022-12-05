require('dotenv/config');
const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');
const { createAgent } = require('@forestadmin/agent');
const { createSequelizeDataSource } = require('@forestadmin/datasource-sequelize');
const express = require('express');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

const token = process.env['DISCORD_TOKEN'];

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
	partials: [Partials.Channel],
});

client.commands = new Collection();
client.newUsers = new Collection();
client.cooldowns = new Collection();
client.jobCooldowns = new Collection();

// Database

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	storage: './src/database/database.sqlite',
});

// Command handler

const commandsPath = path.join(__dirname, 'commands');

const commandsFolders = fs.readdirSync(commandsPath);

for (const folder of commandsFolders) {
	const commandFiles = fs.readdirSync(`${commandsPath}/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`${commandsPath}/${folder}/${file}`);

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[ERRO] O commando em ${folder} está sem as propriedades requeridas!`);
		}
	}
}

// Event handler

const eventsPath = path.join(__dirname, 'events');

const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, sequelize));
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

client.login(token);

// DB Dashboard

createAgent({
	authSecret: process.env.FOREST_AUTH_SECRET,
	envSecret: process.env.FOREST_ENV_SECRET,
	isProduction: process.env.NODE_ENV === 'production',
}).addDataSource(createSequelizeDataSource(sequelize)).mountOnExpress(app).start();
