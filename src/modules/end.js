/* Script to run when the bot is shutting down */

const log = require(`./log.js`);

module.exports = (client, setDND, message) => {
    async function exit() {
        if(message) log(`\n${message}`, `red`);
        log(`\nStopped. Bot Offline.`, `red`);
        log(``, `white`);
        process.exit();
    }

    if(setDND) {
        client.user.setPresence({activity: {name: `Restarting Bot`, type: 'PLAYING'}, status: 'dnd'}).then(() => exit()).catch(error => log(error, `red`));
    } else {
        exit();
    }
}