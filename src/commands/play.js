const Discord = require(`discord.js-light`);
const ytdl = require(`ytdl-core`);
const yts = require(`yt-search`);
const config = require(`../config/config.json`);
const log = require(`../modules/log.js`);
const songhandler = require(`../modules/songhandler.js`);
const streamhandler = require(`../modules/streamhandler.js`);


module.exports = {
    name: `play`,
    description: `Plays a song in a VC`,
    category: `Music`,
    args: true,
    guildOnly: true,
    aliases: [`p`, `playyoutube`, `youtube`, `yt`],
    usage: `<search query> **or** ${config.prefix} play <url>`,
    async execute (client, message, args) {
        // Checks if user is in vc
        const { channel } = message.member.voice;
        if (!channel) return message.reply(`you need to be in a voice channel to play music!`);

        const permissions = channel.permissionsFor(message.client.user);

        // If the bot does not have permissions
        if (!permissions.has(`CONNECT`)) return message.reply(`I cannot connect to your voice channel, make sure I have the proper permissions!`);
        if (!permissions.has(`SPEAK`)) return message.reply(`I cannot speak in your voice channel, make sure I have the proper permissions!`);

        let errorEmbed = new Discord.MessageEmbed()
            .setColor(0xff4a4a)
            .setTitle(`An unknown error occured. If the problem persists please\n report the issue on GitHub or on the support server.`);

        let videoUnavailableEmbed = new Discord.MessageEmbed()
            .setColor(0xff4a4a)
            .setTitle(`Error: Video Unavailable`);

        // Defines the server queue
        const serverQueue = message.client.queue.get(message.guild.id);



        // Define variables for playlist
        const playlistRegex = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
        let playlist;

        // Define songInfo
        let songInfo;

        // Checks if the arguments provided is a url
        if (await ytdl.validateURL(args.slice(0).join(` `))) {
            // Set songIngo
            songInfo = await ytdl.getInfo(args[0]).catch(error => {
                log(error, `red`);
                return message.channel.send(errorEmbed);
            });

        // If the arguments are a playlist
        } else if (args.slice(0).join(` `).match(playlistRegex) && args.slice(0).join(` `).match(playlistRegex)[2]) {
            playlist = await yts({
                listId: args.slice(0).join(` `).match(playlistRegex)[2]
            }).catch(error => {
                return log(error, `red`);
            })

            if (!playlist) return message.channel.send(errorEmbed);

            songInfo = await ytdl.getInfo(`${playlist.videos[0].videoId}`).catch(error => {
                log(error, `red`);
                return message.channel.send(errorEmbed);
            });

            // Removes the already queued playlist song
            playlist.videos.shift();

        // If the arguments provided are not a url, search youtube for a video
        } else {
            const ytsResult = await yts(args.slice(0).join(` `));
            const ytsVideo = await ytsResult.videos.slice(0, 1);

            // Checks to see if video was found
            if (!ytsVideo[0]) return message.reply(`I couldn't find anything based on your query!`);

            // Set songInfo
            songInfo = await ytdl.getInfo(ytsVideo[0].url).catch(error => {
                log(error, `red`);
                return message.channel.send(errorEmbed);
            });
        }



        // Defines song info
        const song = await songhandler.getSongInfo(songInfo, message);
        if (!song) return message.channel.send(videoUnavailableEmbed);

        // Adds a song to the queue if there is already a song playing
        if (serverQueue && serverQueue.songs[serverQueue.currentSong]) {
            if (playlist) {
                await songhandler.queuePlaylist(playlist, message);
                return await songhandler.queueSong(song, message, true);
            } else {
                return await songhandler.queueSong(song, message);
            }
        }

        // Define queue construct
        const queueConstruct = await songhandler.createQueue(song, message);



        // Join vc and play music
        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            connection.voice.setSelfDeaf(true);
            if (playlist) await songhandler.queuePlaylist(playlist, message);
            streamhandler.play(queueConstruct.songs[queueConstruct.currentSong], message);
        } catch (error) {
            log(`I could not join the voice channel: ${error}`, `red`);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.reply(`I could not join the voice channel: ${error}`);
        };
    },
}