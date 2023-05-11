require('dotenv/config');
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const { DISCORD_TOKEN, CLIENT_ID } = process.env;

const commands = [];

const commandsPath = path.join(__dirname, '../commands');

const commandsFolders = fs.readdirSync(commandsPath);

for (const folder of commandsFolders) {
	const commandFiles = fs.readdirSync(`${commandsPath}/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`${commandsPath}/${folder}/${file}`);
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: 10 }).setToken(DISCORD_TOKEN);

rest.put(
	Routes.applicationCommands(CLIENT_ID),
	{ body: commands },
)
	.then(() => console.log(`Comandos registrados : ${commands.length}`))
	.catch(console.error);
