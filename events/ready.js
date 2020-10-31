/* Once Ready */

const Discord = require(`discord.js`);

module.exports = (client) => {
    client.user.setActivity(`A kid's guide to the Internet`, { type: 'WATCHING' });
    console.log(``);
    console.log('\x1b[32m', `Using prefix ${client.config.get('prefix')}`);
    console.log(`\x1b[32m`, `Running version ${client.pjson.get('version')}\n`);

    async function readyStats () {
        var guilds = await client.guilds.cache.size;
        var channels = await client.channels.cache.size;
        var users = await client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
        console.log(`\x1b[32m`, `Ready! Serving ${guilds} servers, ${channels} channels and ${users} users!`);
    }
    readyStats();
    
}