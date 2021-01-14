/* Once Ready, set status and show ready info */

const Discord = require(`discord.js-light`);
const presence = require(`../config/presence.js`);
const log = require(`../modules/log.js`);
const shuffleArray = require(`../utils/shuffleArray.js`)

module.exports = async (client) => {
    const guilds = await client.guilds.cache.size;
    const users = await client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

    const setPresence = async () => await client.user.setPresence(shuffleArray(presence)[0]);

    setPresence();

    log(`\n--------------------------------------------------------------------------\n`, `white`);
    log(`Using prefix ${client.config.prefix}`, `green`);
    log(`Running version ${client.pjson.version}`, `green`);
    log(`Ready! Serving ${users} users in ${guilds} guilds!`, `green`);
    log(`\n--------------------------------------------------------------------------\n`, `white`);

    setTimeout(() => setPresence(), 6e5);
}