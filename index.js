/* Node Modules */
const Discord = require(`discord.js`);
const fs = require(`fs`);
const dotenv = require(`dotenv`).config();

/* Config */
const config = require(`./config.json`)
const pjson = require(`./package.json`)
const token = process.env.BOT_TOKEN
const client = new Discord.Client();



/* Command Handler */
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

// Once ready
client.once('ready', () => {
	console.log(`\x1b[32m`, `Ready! Serving ` + client.guilds.cache.size + ` servers, ` + client.channels.cache.size + ` channels and ` + client.users.cache.size + ` users!\n`);
});

client.on('message', message => {
	// If the message is in a Server
	if(message.guild !== null) {
		if (message.author.bot) {
			// If the Message is by Peter!
			if(message.author.id === client.user.id) {
				// If the message has an embed it logs it as an embed
				if(message.embeds.length > 0){
					console.log('\x1b[35m',`Server: ${message.guild.name} | Channel: #${message.channel.name} | [${message.author.tag}] `,'\x1b[36m',`{Embed}`)
					return;
				// If the message does not have am embed it logs the message normally
				} else {
					console.log('\x1b[35m',`Server: ${message.guild.name} | Channel: #${message.channel.name} | [${message.author.tag}] ${message.content}`)
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
					console.log('\x1b[35m',`Server: DM | [${message.author.tag}] `,'\x1b[36m',`{Embed}`)
					return;
				// If the message does not have am embed it logs the message normally
				} else {
					console.log('\x1b[35m',`Server: DM | [${message.author.tag}] ${message.content}`)
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
	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) {
		// If command does not exist it logs it in red
		if(message.guild !==null) {
			console.log('\x1b[31m',`Server: ${message.guild.name} | Channel: #${message.channel.name} | [${message.author.tag}] ${message.content}`)
			return;
		} else {
			console.log('\x1b[31m',`Server: DM | [${message.author.tag}] ${message.content}`)
			return;
		}
	} else {
		// If the command exists it logs it in green
		if(message.guild !==null) {
			console.log('\x1b[32m',`Server: ${message.guild.name} | Channel: #${message.channel.name} | [${message.author.tag}] ${message.content}`)
		} else {
			console.log('\x1b[32m',`Server: DM | [${message.author.tag}] ${message.content}`)
		}
	}
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	if (command.devOnly && message.author.id !== config.BR88C.id) {
		return message.reply('That command is only for this bot\'s dev, BR88C!');
	}
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
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
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



/* Queue and Login */
client.queue = new Map();
client.login(token).catch(err => console.error(`Failed to authenticate client with application.`));

/* If the Bot is Stopped with Ctrl+C */
process.on(`SIGINT`, () => {
    console.log(`\x1b[31m`, `\nStopped. Bot Offline.`);
    console.log(`\x1b[37m`);
    process.exit();
});