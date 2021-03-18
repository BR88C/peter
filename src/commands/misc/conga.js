const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `conga`,
    description: `Hidden command that plays Conga by Gloria Estefan and sends an emoji`,
    guildOnly: true,
    hide: true,
    async execute (client, message, args) {
        // Gets emojis
        const emojiGuild = client.guilds.forge(client.config.emojiGuild);
        const conga = await emojiGuild.emojis.fetch(client.config.emojis.conga);

        await message.channel.send(`It's conga time! ${conga}`);

        const playCommand = client.commands.get(`play`);
        args = [`https://www.youtube.com/watch?v=5SXX-pWzOY8`];
        try {
            playCommand.execute(client, message, args);
        } catch (error) {
            log(error, `red`);
            return message.reply(`there was an error trying to execute that command!`);
        }
    }
};
