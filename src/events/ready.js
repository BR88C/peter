/* Once Ready, set status and show ready info */

const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = async (client) => {
    await client.user.setPresence({
        activity: {
            name: `a kid's guide to the Internet`,
            type: 'WATCHING'
        },
        status: 'online'
    });

    log(`\n--------------------------------------------------------------------------\n`, `white`);
    log(`Using prefix ${client.config.prefix}`, `green`);
    log(`Running version ${client.pjson.version}`, `green`);

    const guilds = await client.guilds.cache.size;
    const channels = await client.channels.cache.size;
    const users = await client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

    log(`Ready! Serving ${guilds} servers, ${channels} channels and ${users} users!`, `green`);
    log(`\n--------------------------------------------------------------------------\n`, `white`);

}