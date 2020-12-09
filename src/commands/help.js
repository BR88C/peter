const Discord = require(`discord.js-light`);
const config = require(`../config/config.json`);
const log = require(`../modules/log.js`);

module.exports = {
    name: `help`,
    description: `Get info on Peter's commands`,
    aliases: [`commands`, `command`, `cmd`, `cmds`, `commandlist`, `cmdlist`],
    usage: `<category name> **or** ${config.prefix} help command <command name>`,
    async execute (client, message, args) {
        const data = [];
        const { commands } = message.client;
        const shown = commands.filter(command => command.hide !== true);

        const categoriesData = [];
        commands.forEach(command => {
            if (command.category) categoriesData.push(command.category);
        })
        categoriesData.push(`Misc`);
        categoriesData.sort();
        const categories = Array.from(new Set(categoriesData));



        // If no arguments, list categories
        if (!args.length) {
            // Create embed content
            data.push(categories.join('\n'));
            data.push(`\nDo \`\`${config.prefix}help <category name>\`\`\nto list all commands in a category\n\nDo \`\`${config.prefix}help command <command name>\`\`\nto get more info on a command`);

            // Create embed
            let helpEmbed = new Discord.MessageEmbed()
                .setColor(0xdbbe00)
                .setTitle(`**Command Categories:**`)
                .setDescription(data, { split: true })
                .setFooter(`Made by ${config.devs.tags.join(`, `)}`);

            // Send embed
            return message.channel.send(helpEmbed);
        }


        // If the user specifies a category, list commands in category
        if (args[0].toLowerCase() !== `command`) {
            const categoryName = args.slice(0).join(` `).toLowerCase();

            // Checks if category exists
            if (!categories.map(category => category.toLowerCase()).includes(categoryName)) {
                return message.reply(`please specify a valid category!`);
            }

            // Get all commands in category
            const categoryCommands = [];
            commands.forEach(command => {
                if (categoryName === `misc`) {
                    if (!command.category && !command.hide) {
                        categoryCommands.push(command.name);
                    }
                } else if (command.category && !command.hide && command.category.toLowerCase() === categoryName) {
                    categoryCommands.push(command.name);
                }
            })
            data.push(categoryCommands.join(`\n`));
            data.push(`\nDo \`\`${config.prefix}help command <command name>\`\`\nto get more info on a command`);

            // Create embed
            let helpEmbed = new Discord.MessageEmbed()
                .setColor(0xdbbe00)
                .setTitle(`**Commands in the ${categoryName} category:**`)
                .setDescription(data, { split: true })
                .setFooter(`Made by ${config.devs.tags.join(`, `)}`);

            // Send embed
            return message.channel.send(helpEmbed);
        }


        // If the user specifies a command, list information on that command
        if (!args[1]) return message.reply(`please specify a command!`);
        const name = args[1].toLowerCase();
        const command = commands.get(name) || commands.find(command => command.aliases && command.aliases.includes(name));

        // If the command does not exist
        if (!command) return message.reply(`that's not a valid command!`);

        // Gets info on the command
        data.push(`**Name:** ${command.name}`);
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.category) {
            data.push(`**Category:** ${command.category}`);
        } else {
            data.push(`**Category:** Misc`);
        }
        if (command.args) data.push(`**Arguments Required:** ${command.args}`);
        if (command.usage) data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);
        if (command.devOnly) data.push(`**Dev Only:** ${command.devOnly}`);

        // Create the Embed
        let helpEmbed = new Discord.MessageEmbed()
            .setColor(0xdbbe00)
            .setTitle(`**${config.prefix}${command.name} command information:**`)
            .setDescription(data, { split: true })
            .setFooter(`Made by ${config.devs.tags.join(`, `)}`);

        // Send the Embed
        return message.channel.send(helpEmbed);
    },
}