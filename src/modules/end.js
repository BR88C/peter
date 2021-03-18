/* Script to run when the bot is shutting down */

const log = require(`./log.js`);

/**
 * End the process
 *
 * @param {Object} client Client object
 * @param {boolean} setDND If the bot should be set to DND mode and display a status of "Playing Restarting Bot"
 * @param {String} message Message to be logged
 */
const end = async (client, setDND, message) => {
    if (setDND) {
        await client.user.setPresence({
            activity: {
                name: `Restarting Bot`,
                type: `PLAYING`
            },
            status: `dnd`
        }).catch((error) => log(error, `red`));
    }

    if (message) log(`\n${message}`, `red`);
    log(`\nStopped. Bot Offline.`, `red`);
    log(``, `white`);
    process.exit();
};

module.exports = end;
