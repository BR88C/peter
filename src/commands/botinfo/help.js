const Discord = require(`discord.js-light`);
const config = require(`../../config/config.js`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `help`,
    description: `Get info on Peter's commands`,
    aliases: [`commands`, `command`, `cmd`, `cmds`, `commandlist`, `cmdlist`],
    usage: `<category name> **or** ${config.prefix} help command <command name>`,

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        const data = [];
        const commands = message.client.commands;
        const directories = message.client.directories;

        // If no arguments, list categories.
        if (!args.length) {
            // Create embed content.
            directories.forEach(directory => data.push(directory.fullName));
            data.push(`\nDo \`\`${config.prefix}help <category name>\`\`\nto list all commands in a category\n\nDo \`\`${config.prefix}help command <command name>\`\`\nto get more info on a command`);

            // Create embed.
            const helpEmbed = new Discord.MessageEmbed()
                .setColor(0xdbbe00)
                .setTitle(`**Command Categories:**`)
                .setDescription(data, { split: true })
                .setFooter(`Made by ${config.devs.tags.join(`, `)}`);

            // Send embed.
            return message.channel.send(helpEmbed);
        }

        // If the user specifies a category, list commands in category.
        if (args[0].toLowerCase() !== `command`) {
            const name = args.slice(0).join(` `).toLowerCase();
            const specifiedDirectory = directories.get(name) || directories.find(directory => directory.fullName.toLowerCase() === name || (directory.aliases && directory.aliases.includes(name)));

            // Checks if category exists.
            if (!specifiedDirectory) return message.reply(`please specify a valid category!`);

            // Pushes category description.
            data.push(`**${specifiedDirectory.description}**`);

            // Get all commands in category.
            const categoryCommands = [];
            commands.forEach(command => {
                if (!command.hide && command.directory === specifiedDirectory.name) categoryCommands.push(command.name);
            });

            data.push(categoryCommands.join(`\n`));
            data.push(`\nDo \`\`${config.prefix}help command <command name>\`\`\nto get more info on a command`);

            // Create embed.
            const helpEmbed = new Discord.MessageEmbed()
                .setColor(0xdbbe00)
                .setTitle(`**${specifiedDirectory.fullName} category**`)
                .setDescription(data, { split: true })
                .setFooter(`Made by ${config.devs.tags.join(`, `)}`);

            // Send embed.
            return message.channel.send(helpEmbed);
        }

        // If the user specifies a command, list information on that command.
        if (!args[1]) return message.reply(`please specify a command!`);
        const name = args[1].toLowerCase();
        const command = commands.get(name) || commands.find(command => command.aliases && command.aliases.includes(name));

        // If the command does not exist.
        if (!command) return message.reply(`that's not a valid command!`);

        // Gets info on the command.
        data.push(`**Name:** ${command.name}`);
        data.push(`**Category:** ${directories.get(command.directory).fullName}`);
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(`, `)}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.args) data.push(`**Arguments Required:** ${command.args}`);
        if (command.usage) data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);
        if (command.devOnly) data.push(`**Dev Only:** ${command.devOnly}`);

        // Create the Embed.
        const helpEmbed = new Discord.MessageEmbed()
            .setColor(0xdbbe00)
            .setTitle(`**${command.name} command information:**`)
            .setDescription(data, { split: true })
            .setFooter(`Made by ${config.devs.tags.join(`, `)}`);

        // Send the Embed.
        return message.channel.send(helpEmbed);
    }
};
