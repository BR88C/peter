const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const stopAllMusic = require(`../../modules/stopAllMusic.js`);

module.exports = {
    name: `stopbot`,
    description: `Stops the bot`,
    devOnly: true,
    hide: true,
    aliases: [`stop-bot`],
    async execute (client, message, args) {
        log(`\nUser ${message.author.tag} ran the stopbot command. Stopping all music and the node process.`, `red`);

        await stopAllMusic(client);
        log(`All music stopped.`, `red`);

        await client.user.setPresence({
            activity: {
                name: `Restarting Bot`,
                type: `PLAYING`
            },
            status: `dnd`
        }).catch((error) => log(error, `red`));
        log(`Bot presence set to DND.`, `red`);

        log(`\nStopped. Bot Offline.`, `red`);
        log(``, `white`);
        process.exit();
    }
};
