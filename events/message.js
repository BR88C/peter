/* When a message is recieved, log it with the appropriate formatting, check if
it's a command, look for arguments, check for flags on the commands, then run it */

const Discord = require(`discord.js`);
const log = require(`../utils/log.js`);

module.exports = (client, message) => {
	// If the Message is by Peter!
	if(message.author.bot && message.author.id === client.user.id) {
		return log(message.content, `magenta`, message, {server: true, channel: true, user: true, regex: true});

	// If the message is by another bot
	} else if(message.author.bot) {
		return;
	
	// If the message is by a user and it does not contain the prefix
	} else if(!message.author.bot && message.content.toLowerCase().indexOf(client.config.get('prefix').toLowerCase()) !== 0 ) {
		return;

	}



	// Sets up args, command names, and checks for aliases
	const args = message.content.slice(client.config.get('prefix').length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	


	// If command does not exist it logs it in red
	if(!command) {
		return log(message.content, `red`, message, {server: true, channel: true, user: true, regex: true});
	
	// If the command exists it logs it in green
	} else {
		log(message.content, `green`, message, {server: true, channel: true, user: true, regex: true});
	}



	// Checks if command is Guild Only
	if(command.guildOnly && message.channel.type === `dm`) {
		return message.reply(`I can't execute that command inside DMs!`);
	}

	// Checks if command is Dev Only
	if(command.devOnly && message.author.id !== client.config.get('dev').id) {
		return message.reply(`that command is only for this bot's dev, ${client.config.get('dev').tag}!`);
	}
	
	// Check if command needs args
	if(command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if(command.usage) {
			reply += `\nThe proper usage would be: \`${client.config.get('prefix')}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}



    // Cooldown
    const cooldowns = new Discord.Collection();
	if(!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 0) * 1000;
	if(timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if(now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before executing the \`${command.name}\` command again.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);



	// Executes the command
	try {
		command.execute(client, message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
}