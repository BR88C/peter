/* Once Ready */

const Discord = require(`discord.js`);

module.exports = (client) => {
    client.user.setActivity('A kid\'s guide to the Internet', { type: 'WATCHING' });
    console.log(``);
    console.log('\x1b[32m', `Using prefix ${client.config.get('prefix')}`);
    console.log(`\x1b[32m`, `Ready! Serving ${client.guilds.cache.size} servers, ${client.channels.cache.size} channels and ${client.users.cache.size} users!`);
	console.log(`\x1b[32m`, `Running version ${client.pjson.get('version')}\n`);
}