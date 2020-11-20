/* Script to run when the bot is shutting down */

const log = require(`./log.js`);

module.exports = (client, message) => {
    async function exit() {
        if(message) log(`\n${message}`, `red`);
        log(`\nStopped. Bot Offline.`, `red`);
        log(``, `white`);
        process.exit();
    }

    if(client.user) {
        client.user.setPresence({activity: {name: `Restarting Bot`, type: 'PLAYING'}, status: 'dnd'}).then(() => exit()).catch(console.error);
    } else {
        exit();
    }
}