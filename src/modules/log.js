/* Used to make complex logging easier and shorter */

module.exports = (content, color, discordMessage, options) => {
    // Create Variables
    let logColor;
    let logContent = content;

    // Get color specified and set logColor variable to correct color
    switch (color) {
        case `black`:
            logColor = `\x1b[30m`;
            break;
        case `red`:
            logColor = `\x1b[31m`;
            break;
        case `green`:
            logColor = `\x1b[32m`;
            break;
        case `yellow`:
            logColor = `\x1b[33m`;
            break;
        case `blue`:
            logColor = `\x1b[34m`;
            break;
        case `magenta`:
            logColor = `\x1b[35m`;
            break;
        case `cyan`:
            logColor = `\x1b[36m`;
            break;
        case `white`:
            logColor = `\x1b[37m`;
            break;
    }

    // If no log volor is specified or if the color specified is invalid, throw an error
    if (!logColor) {
        throw `Did not specify a valid color`;
    }

    // If discordMessage is defined
    if (discordMessage) {
        // If the message contains an embed, log it as an embed with it's title, author, or description if applicable
        if (discordMessage.embeds.length > 0) {
            if (discordMessage.embeds[0].title) logContent = `{Embed: Title = ${discordMessage.embeds[0].title}}`.replace(/[^ -~]+/g, ``);
            else if (discordMessage.embeds[0].author && discordMessage.embeds[0].author.name) logContent = `{Embed: Author = ${discordMessage.embeds[0].author.name}}`.replace(/[^ -~]+/g, ``);
            else if (discordMessage.embeds[0].description) logContent = `{Embed: Description = ${discordMessage.embeds[0].description}}`.replace(/[^ -~]+/g, ``);
            else logContent = `{Embed}`
        }

        // If the user option is defined, append their tag to the start of logContent
        if (options.user) logContent = `[${discordMessage.author.tag}] ` + logContent;

        // If the server option is defined, append the server name to the start of logContent
        if (options.server) {
            // If the message is in a guild
            if (discordMessage.channel.type !== `dm`) logContent = `Server: ${discordMessage.guild.name} | ` + logContent;
            // If the message is in a DM
            else logContent = `Server: DM | ` + logContent;
        }
    }

    // If the regex option is defined, apply the regex to logContent
    if (options.regex) logContent = logContent.replace(/[^ -~]+/g, ``);

    return console.log(logColor, logContent);
}