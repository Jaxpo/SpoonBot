//require the keep_alive js file
const keep_alive = require('./keep_alive.js')

//require the fs module (node's native file system module)
const fs = require('fs');

//require the configuration file, and define the prefix constant
//Note: Make sure to update the variables defined as more is added to the config file (e.g. const { prefix, nextThing, moreStuff, etCetera } as those variables are added to the config file.)
const { prefix } = require('./config.json');

//require the disord.js module
const Discord = require('discord.js');

//create a new discord client
const client = new Discord.Client();

//define our token as the token secret
const token = process.env.TOKEN_SECRET;

//create a new discord collection called commands
client.commands = new Discord.Collection();

//return an array of all the javascript file names in the commands directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}



//on the ready event, run this code
client.once('ready', () => {

  //tell the console the client is functional and print the bot's tag
  console.log("Up and running!");
  console.log(client.user.tag);
});



client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});



//login to discord with the app's token
client.login(token);