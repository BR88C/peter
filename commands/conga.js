const Discord = require(`discord.js`);

module.exports = {
	name: `conga`,
	description: `Hidden command that plays Conga by Gloria Estefan and sends a gif`,
	guildOnly: true,
	hide: true,
	async execute(client, message, args) {
        await message.channel.send(`It's conga time!`, { files: ["./assets/images/conga.gif"] });
        
        const playCommand = client.commands.get(`play`);
        args = [`https://www.youtube.com/watch?v=5SXX-pWzOY8`];
        try {
            playCommand.execute(client, message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
	},
}