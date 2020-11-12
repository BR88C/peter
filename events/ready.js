/* Once Ready */

const Discord = require(`discord.js`);
const log = require(`../utils/log.js`);

module.exports = (client) => {
    client.user.setPresence({activity: { name: `a kid's guide to the Internet`, type: 'WATCHING' }, status: 'online'});
    log(`\n--------------------------------------------------------------------------\n`, `white`);
    log(`Using prefix ${client.config.get('prefix')}`, `green`);
    log(`Running version ${client.pjson.get('version')}`, `green`);

    async function readyStats () {
        const guilds = await client.guilds.cache.size;
        const channels = await client.channels.cache.size;
        const users = await client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
        log(`Ready! Serving ${guilds} servers, ${channels} channels and ${users} users!`, `green`)
        log(`\n--------------------------------------------------------------------------\n`, `white`);
    }
    readyStats();    
}