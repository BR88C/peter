const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `clear`,
    description: `Clears the queue without removing the song currently playing`,
    guildOnly: true,
    async execute (client, message, args) {
        // If the queue is empty reply with an error
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs[0]) return message.reply(`I can't clear the queue if the queue is empty!`);

        // Checks if the user is in the VC
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to clear the queue!`);

        // Clears the queue without removing the song currently playing
        if (serverQueue.songs[serverQueue.currentSong]) {
            for (const song of serverQueue.songs) {
                if (song.stream !== null && song !== serverQueue.songs[serverQueue.currentSong]) {
                    if (typeof song.stream.destroy === `function`) song.stream.destroy();
                    song.stream = null;
                }
            };
            serverQueue.songs = [serverQueue.songs[serverQueue.currentSong]];
        } else {
            for (const song of serverQueue.songs) {
                if (song.stream !== null) {
                    if (typeof song.stream.destroy === `function`) song.stream.destroy();
                    song.stream = null;
                }
            };
            serverQueue.songs = [];
        }
        serverQueue.currentSong = 0;

        // Create embed
        let clearEmbed = new Discord.MessageEmbed()
            .setColor(0xff642b)
            .setTitle(`🧹  Cleared the Queue!`);

        // Send embed
        return message.channel.send(clearEmbed);
    },
}