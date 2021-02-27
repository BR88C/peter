/* When a message is recieved, log it with the appropriate formatting, check if
it's a command, look for arguments, check for flags on the commands, then run it */

const Discord = require(`discord.js-light`);
const log = require(`../modules/log.js`);
const executeCommand = require(`../modules/executeCommand.js`);

module.exports = (client, message) => {
    // If the Message is by Peter!
    if (message.author.bot && message.author.id === client.user.id) {
        return log(message.content, `magenta`, message, {
            server: true,
            user: true,
            regex: true
        });

        // If the message is by another bot or it does not contain the prefix
    } else if (message.author.bot || message.content.toLowerCase().indexOf(client.config.prefix.toLowerCase()) !== 0) {
        return;
    }

    // Sets up args, command names, and checks for aliases
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Execute the command
    executeCommand(commandName, args, client, message);
}