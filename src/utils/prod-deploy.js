const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const { clientId } = require('../config.json');
const token = process.env['DISCORD_TOKEN'];

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

const rest = new REST({ version: 10 }).setToken(token);

rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
)
	.then(() => console.log(`Comandos registrados em produção : ${commands.length}`))
	.catch(console.error);

// rest.put(Routes.applicationCommands(clientId), { body: [] })
// 	.then(() => console.log('Comanddos registrados em produção deletados!'))
// 	.catch(console.error);
