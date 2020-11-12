const message = require("../events/message");

module.exports = (content, color, discordMessage, options) => {
    var logColor;
    var logContent = content;
    
    switch(color) {
        case `black`:
            logColor = `\x1b[30m`;
            break;
        case `red`:
            logColor = `\x1b[31m`;
            break;
        case `green`:
            logColor = `\x1b[32m`
            break;
        case `yellow`:
            logColor = `\x1b[33m`
            break;
        case `blue`:
            logColor = `\x1b[34m`
            break;
        case `magenta`:
            logColor = `\x1b[35m`
            break;
        case `cyan`:
            logColor = `\x1b[36m`
            break;
        case `white`:
            logColor = `\x1b[37m`
            break;
    }

    if(!logColor) {
        throw `Did not specify a valid color`
    }

    if(discordMessage) {
        if(discordMessage.embeds.length > 0) {
            logContent = `{Embed}`;
        }

        if(options.user) {
            logContent = `[${discordMessage.author.tag}] ` + logContent;
        }

        if(options.channel) {
            if(discordMessage.channel.name) {
                logContent = `Channel: ${discordMessage.channel.name} | ` + logContent;
            }
        }

        if(options.server) {
            if(discordMessage.guild !== null) {
                logContent = `Server: ${discordMessage.guild.name} | ` + logContent;
            } else {
                logContent = `Server: DM | ` + logContent;
            }
        }

        if(options.regex) {
            logContent = logContent.replace(/[^ -~]+/g, ``);
        }
    }
    
    return console.log(logColor, logContent);
}