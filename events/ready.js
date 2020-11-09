/* Once Ready */

const Discord = require(`discord.js`);

module.exports = (client) => {
    client.user.setPresence({activity: { name: `a kid's guide to the Internet`, type: 'WATCHING' }, status: 'online'});
    console.log(``);
    console.log('\x1b[32m', `Using prefix ${client.config.get('prefix')}`);
    console.log(`\x1b[32m`, `Running version ${client.pjson.get('version')}`);

    async function readyStats () {
        const guilds = await client.guilds.cache.size;
        const channels = await client.channels.cache.size;
        const users = await client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
        console.log(`\x1b[32m`, `Ready! Serving ${guilds} servers, ${channels} channels and ${users} users!\n`);
    }
    readyStats();
    
}