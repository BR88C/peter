const Discord = require(`discord.js-light`);
const log = require(`../modules/log.js`);

/**
 * Check if a command and arguments are valid, then execute it
 *
 * @param {string} commandName Name of the command, or it's alias
 * @param {array} args Command arguments
 * @param {object} client Client object
 * @param {object} message Message object
 */
const executeCommand = async (commandName, args, client, message) => {
    // Get the command
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // If command does not exist it logs it in red and replies with an error
    if (!command) {
        let invalidCommandEmbed = new Discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle(`Error: ${commandName} is not a valid command!`);

        message.channel.send(invalidCommandEmbed);
        return log(message.content, `red`, message, {
            server: true,
            user: true,
            regex: true
        });

        // If the command exists it logs it in green
    } else {
        log(message.content, `green`, message, {
            server: true,
            user: true,
            regex: true
        });
    }

    // Checks if command is Guild Only
    if (command.guildOnly && message.channel.type === `dm`) {
        let guildOnlyEmbed = new Discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle(`Error: That command cannot be executed inside DMs!`);

        return message.channel.send(guildOnlyEmbed);
    }

    // Checks if command is vote locked
    if (command.voteLocked && client.dbl) {
        const voted = await client.dbl.hasVoted(message.author.id);
        if (!voted && !client.config.devs.ids.includes(message.author.id.toString())) {
            let voteEmbed = new Discord.MessageEmbed()
                .setColor(0xff0000)
                .setTitle(`You must vote to use this command!`)
                .setDescription(`To vote for Peter, go to his top.gg page [here](${client.config.links.voteLink}) and click the vote button.\nReminder that your vote status is reset every 12 hours.`);

            return message.channel.send(voteEmbed);
        }
    }

    // Checks if command is Dev Only
    if (command.devOnly && !client.config.devs.ids.includes(message.author.id.toString())) {
        let devOnlyError;
        if (client.config.devs.tags.length > 1) {
            devOnlyError = (`That command can only be executed by this bot's devs, ${client.config.devs.tags.join(`, `)}!`);
        } else {
            devOnlyError = (`That command can only be executed by this bot's dev, ${client.config.devs.tags[0]}!`);
        }

        let devOnlyEmbed = new Discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle(`Error: ${devOnlyError}`);

        return message.channel.send(devOnlyEmbed);
    }

    // Check if command needs args
    if (command.args && !args.length) {
        let noArgsError = `Error: That command requires Arguments!`;
        if (command.usage) {
            noArgsError += `\nThe proper usage would be:\n\`\`\`${client.config.prefix}${command.name} ${command.usage}\`\`\``;
        }

        let noArgsEmbed = new Discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle(noArgsError);

        return message.channel.send(noArgsEmbed);
    }

    // Executes the command
    try {
        command.execute(client, message, args);
    } catch (error) {
        log(error, `red`);
        let errorEmbed = new Discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle(`An unknown error occured trying to execute that command.`);

        return message.channel.send(errorEmbed);
    }
};

module.exports = executeCommand;
