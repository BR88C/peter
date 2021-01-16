const Discord = require(`discord.js-light`);
const ytdl = require(`discord-ytdl-core`);
const ytsr = require(`ytsr`);
const ytpl = require(`ytpl`);
const config = require(`../../config/config.js`);
const log = require(`../../modules/log.js`);
const Song = require(`../../classes/Song.js`);
const Queue = require(`../../classes/Queue.js`);
const streamhandler = require(`../../modules/streamhandler.js`);


module.exports = {
    name: `play`,
    description: `Plays a song in a VC`,
    args: true,
    guildOnly: true,
    aliases: [`p`, `playyoutube`, `youtube`, `yt`],
    usage: `<search query> **or** ${config.prefix} play <url>`,
    async execute (client, message, args) {
        // Checks if user is in vc
        const channel = message.member.voice.channel;
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
            playlist = await ytpl(args.slice(0).join(` `).match(playlistRegex)[2], {
                limit: Infinity,
            }).catch(error => {
                return log(error, `red`);
            })

            if (!playlist) return message.channel.send(errorEmbed);

            songInfo = await ytdl.getInfo(playlist.items[0].id).catch(error => {
                log(error, `red`);
                return message.channel.send(errorEmbed);
            });

            // Removes the already queued playlist song
            playlist.items.shift();

            // If the arguments provided are not a url, search youtube for a video
        } else {
            // Gets filters
            const filters = await ytsr.getFilters(args.slice(0).join(` `));
            const filter = filters.get(`Type`).get(`Video`);

            // Checks to see if no filter was found
            if (!filter.url) return message.reply(`I couldn't find anything based on your query!`);

            // Gets video based on search string and filter
            const ytsrResult = await ytsr(filter.url, {
                limit: 1
            });

            // Checks to see if video was found
            if (!ytsrResult.items[0]) return message.reply(`I couldn't find anything based on your query!`);

            // Set songInfo
            songInfo = await ytdl.getInfo(ytsrResult.items[0].url).catch(error => {
                log(error, `red`);
                return message.channel.send(errorEmbed);
            });
        }



        // Defines song info
        const song = new Song(songInfo, message.author.tag);
        if (!song.format) return message.channel.send(videoUnavailableEmbed);

        // Queues the song if there is a song playing or play a song if the queue is defined but no song is playing
        if (serverQueue) {
            if (serverQueue.songs[serverQueue.currentSong]) {
                if (playlist) {
                    song.hidden = true;
                    await serverQueue.queuePlaylist(playlist, message);
                    await serverQueue.queueSong(song, message);
                } else {
                    await serverQueue.queueSong(song, message);
                }
                return;
            } else {
                if (playlist) {
                    song.hidden = true;
                    await serverQueue.queuePlaylist(playlist, message);
                    await serverQueue.queueSong(song, message);
                } else {
                    await serverQueue.queueSong(song, message);
                }
                serverQueue.currentSong = serverQueue.songs.indexOf(song);
                return streamhandler.play(serverQueue.songs[serverQueue.currentSong], message);
            }
        }

        // Create queue and push first song
        const queueConstruct = new Queue(await message.guild.channels.fetch(message.channel.id, false), await message.guild.channels.fetch(channel.id, false))
        message.client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);



        // Join vc and play music
        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            connection.voice.setSelfDeaf(true);
            if (playlist) await serverQueue.queuePlaylist(playlist, message);
            return streamhandler.play(queueConstruct.songs[queueConstruct.currentSong], message);
        } catch (error) {
            log(`I could not join the voice channel: ${error}`, `red`);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.reply(`I could not join the voice channel: ${error}`);
        };
    },
}