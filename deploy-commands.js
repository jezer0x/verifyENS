const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require("dotenv")
dotenv.config()

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('verifyens').setDescription('Redirects you to verification page!'),
    new SlashCommandBuilder().setName('setup').setDescription('Setup the bot before first use!')
    .addRoleOption(option =>
		option.setName('role')
			.setDescription('The role to assign when verification is successful')
			.setRequired(true))
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);

rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENTID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
