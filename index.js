/* Node Modules */
const Discord = require(`discord.js`);
const fs = require(`fs`);
const dotenv = require(`dotenv`).config();
const GphApiClient = require('giphy-js-sdk-core');

/* Config */
const config = require(`./config.json`);
const pjson = require(`./package.json`);
const token = process.env.BOT_TOKEN;
const giphyToken = process.env.GIPHY_TOKEN;
const giphy = GphApiClient(giphyToken);
const client = new Discord.Client();
const ytdl = require(`ytdl-core`);
const ytsr = require(`ytsr`);



/* Command Handler */
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

// Once ready
client.once('ready', () => {
	client.user.setActivity('A kid\'s guide to the Internet', { type: 'WATCHING' });
	console.log(`\x1b[32m`, `Ready! Serving ${client.guilds.cache.size} servers, ${client.channels.cache.size} channels and ${client.users.cache.size} users!`);
	console.log(`\x1b[32m`, `Running version ${pjson.version}\n`)
});

// Message Event
client.on('message', message => {
	// If the message is in a Server
	if(message.guild !== null) {
		if (message.author.bot) {
			// If the Message is by Peter!
			if(message.author.id === client.user.id) {
				// If the message has an embed it logs it as an embed
				if(message.embeds.length > 0){
					console.log(`\x1b[35m`,(`Server: ${message.guild.name} | Channel: #${message.channel.name} | [${message.author.tag}] `).replace(/[^ -~]+/g, ``),'\x1b[36m',`{Embed}`);
					return;
				// If the message does not have am embed it logs the message normally
				} else {
					console.log(`\x1b[35m`,(`Server: ${message.guild.name} | Channel: #${message.channel.name} | [${message.author.tag}] ${message.content}`).replace(/[^ -~]+/g, ``));
					return;
				}
			// If the message is by any other bot
			} else {
				return;
			}
		// If the message is by a user
		} else {
			// If the message does not contain the prefix
			if(message.content.toLowerCase().indexOf(config.prefix.toLowerCase()) !== 0 ) {
				return;
			}
		}
	// If the message is in a DM
	} else {
		if (message.author.bot) {
			// If the Message is by Peter!
			if(message.author.id === client.user.id) {
				// If the message has an embed it logs it as an embed
				if(message.embeds.length > 0){
					console.log(`\x1b[35m`,(`Server: DM | [${message.author.tag}] `).replace(/[^ -~]+/g, ``), '\x1b[36m',`{Embed}`);
					return;
				// If the message does not have am embed it logs the message normally
				} else {
					console.log(`\x1b[35m`,(`Server: DM | [${message.author.tag}] ${message.content}`).replace(/[^ -~]+/g, ``));
					return;
				}
			// If the message is by any other bot
			} else {
				return;
			}
		// If the message is by a user
		} else {
			// If the message does not contain the prefix
			if(message.content.toLowerCase().indexOf(config.prefix.toLowerCase()) !== 0 ) {
				return;
			}
		}
	}
	// Sets up args, command names, and checks for aliases
	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) {
		// If command does not exist it logs it in red
		if(message.guild !==null) {
			console.log(`\x1b[31m`,(`Server: ${message.guild.name} | Channel: #${message.channel.name} | [${message.author.tag}] ${message.content}`).replace(/[^ -~]+/g, ""));
			return;
		} else {
			console.log(`\x1b[31m`,(`Server: DM | [${message.author.tag}] ${message.content}`).replace(/[^ -~]+/g, ``));
			return;
		}
	} else {
		// If the command exists it logs it in green
		if(message.guild !==null) {
			console.log(`\x1b[32m`,(`Server: ${message.guild.name} | Channel: #${message.channel.name} | [${message.author.tag}] ${message.content}`).replace(/[^ -~]+/g, ""));
		} else {
			console.log(`\x1b[32m`,(`Server: DM | [${message.author.tag}] ${message.content}`).replace(/[^ -~]+/g, ``));
		}
	}
	// Checks if command is Guild Only
	if (command.guildOnly && message.channel.type === `dm`) {
		return message.reply(`I can\'t execute that command inside DMs!`);
	}
	// Checks if command is Dev Only
	if (command.devOnly && message.author.id !== config.BR88C.id) {
		return message.reply(`That command is only for this bot\'s dev, BR88C!`);
	}
	// Chck if command needs agrs
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	// Cooldown
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 0) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
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
});



/* Leaves VCs if only the bot is present */
var musicTimeout = config.musicTimeout
client.on("voiceStateUpdate", (oldState, newState) => { 
	clearTimeout(musicTimeout);
	// If a user leaves or changes channels
	if(oldState.channelID != newState.channelID && oldState.channelID != null) {
		var channelInfo = oldState.guild.channels.cache.get(oldState.channelID);
		// If the bot is the only user in the VC clear the queue and leave
		if(channelInfo.members.has(client.user.id) && channelInfo.members.size == 1) {
			musicTimeout = setTimeout(() => {
				channelInfo.leave();
				const serverQueue = client.queue.get(oldState.guild.id);
				if(serverQueue) serverQueue.connection.dispatcher.destroy();
				client.queue.delete(oldState.guild.id);
			}, (config.musicTimeout * 1000));
		}
	}
});



/* Queue and Login */
client.queue = new Map();
client.login(token).catch(err => console.error(`Failed to authenticate client with application.`));




/* If the Bot is Stopped with Ctrl+C */
process.on(`SIGINT`, () => {
    console.log(`\x1b[31m`, `\nStopped. Bot Offline.`);
    console.log(`\x1b[37m`);
    process.exit();
});