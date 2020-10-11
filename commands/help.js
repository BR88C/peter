const Discord = require(`discord.js`);
const config = require(`../config.json`);

module.exports = {
	name: 'help',
	description: 'Lists all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	async execute(client, message, args) {
		const data = [];
		const { commands } = message.client;
		const shown = commands.filter(command => command.hide !== true)

		if(!args.length) {

			// Lists the commands
			data.push(shown.map(shown => shown.name).join('\n'));
			data.push(`You can also do \`\`${config.prefix}help [command name]\`\`\nto get more info on a command!`);

			// Create the Embed
			let helpEmbed = new Discord.MessageEmbed()
			.setColor(0xdbbe00)
			.setTitle(`**Peter\'s commands:**`)
			.setDescription(data, { split: true })
			.setFooter(`Hosted by ${config.dev.tag} | Made by ${config.dev.tag}`)

			// Send the message in a DM
			return message.author.send(helpEmbed)
				.then(() => {
					if(message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				// If Peter is unable to send a DM
				.catch(error => {
					console.error('\x1b[31m',`Could not send help DM to ${message.author.tag}.`);
					message.reply('It seems like I can\'t DM you! Make sure to check your privacy settings!');
				});
		}

		// Finds the command specified
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		// If the command does not exist
		if(!command) {
			return message.reply('that\'s not a valid command!');
		}

		// Gets info on the command
		data.push(`**Name:** ${command.name}`);
		if(command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if(command.description) data.push(`**Description:** ${command.description}`);
		if(command.args) data.push(`**Arguments Required:** ${command.args}`);
		if(command.usage) data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);
		if(command.devOnly) data.push(`**Dev Only:** ${command.devOnly}`);
		if(command.cooldown) data.push(`**Cooldown:** ${command.cooldown} second(s)`);
		
		// Create the Embed
		let helpEmbed = new Discord.MessageEmbed()
		.setColor(0xdbbe00)
		.setTitle(`**${config.prefix}${command.name} info:**`)
		.setDescription(data, { split: true })
		.setFooter(`Hosted by ${config.dev.tag} | Made by ${config.dev.tag}`)

		// Send the Embed
		message.channel.send(helpEmbed);
	},
}