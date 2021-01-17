/* Once Ready, set status and show ready info */

const Discord = require(`discord.js-light`);
const presence = require(`../config/presence.js`);
const log = require(`../modules/log.js`);
const shuffleArray = require(`../utils/shuffleArray.js`)

module.exports = async (client) => {
    const guilds = await client.guilds.cache.size;

    const setPresence = async () => await client.user.setPresence(shuffleArray(presence)[0]);

    setPresence();

    log(`\n**************************************************************************\n`, `blue`);
    log(`Using prefix ${client.config.prefix}`, `green`);
    log(`Running version ${client.pjson.version}`, `green`);
    log(`Ready! Serving ${guilds} guilds!`, `green`);
    log(`\n**************************************************************************\n`, `blue`);

    setTimeout(() => setPresence(), 6e5);
}