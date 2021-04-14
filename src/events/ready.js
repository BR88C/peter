/* Once Ready, set status and show ready info */

const Discord = require(`discord.js-light`);
const presence = require(`../config/presence.js`);
const log = require(`../modules/log.js`);
const shuffleArray = require(`../utils/shuffleArray.js`);

module.exports = async (client) => {
    const setPresence = async () => await client.user.setPresence(shuffleArray(presence)[0]);

    setPresence();

    log(`\n**************************************************************************\n`, `white`);
    log(`Using prefix ${client.config.prefix}`, `green`);
    log(`Running version ${client.pjson.version}`, `green`);
    log(`Ready! Serving ${client.guilds.cache.size} guilds!`, `green`);
    log(`\n**************************************************************************\n`, `white`);

    setInterval(setPresence, 6e5);
};
