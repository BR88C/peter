const Discord = require(`discord.js-light`);
const ytdl = require(`discord-ytdl-core`);
const currentTime = require(`../utils/currentTime.js`);
const time = require(`../utils/time.js`);
const Song = require(`./Song.js`);

class Queue {
    constructor(textChannel, voiceChannel) {
        this.textChannel = textChannel;
        this.channel = voiceChannel;
        this.connection = null;
        this.bitrate = voiceChannel.bitrate / 1000 || 128;
        this.songs = [];
        this.currentSong = 0;
        this.volume = 100;
        this.playing = true;
        this.loop = `off`;
        this.twentyFourSeven = false;
        this.effects = {};
    }

    async queueSong (song, message) {
        this.songs.push(song);

        const channel = message ? message.channel : this.textChannel;

        const songIndex = this.songs.indexOf(song);
        const songsBefore = this.songs.slice(this.currentSong, songIndex);

        let timeUntilPlayed;
        if (this.connection && this.connection.dispatcher) {
            const completed = currentTime(this);
            timeUntilPlayed = 0;
            for (const song of songsBefore) {
                timeUntilPlayed += song.rawTime;
            }
            timeUntilPlayed = time(Math.round((timeUntilPlayed / (this.speed / 100)) - completed));
        } else {
            timeUntilPlayed = `Unavailable`;
        }

        if (!song.hidden) {
            let queueAddEmbed = new Discord.MessageEmbed()
                .setColor(0x0cdf24)
                .setTitle(`✅  "${song.title}" has been added to the queue!`)
                .setImage(song.thumbnail)
                .addFields({
                    name: `**Position in Queue**`,
                    value: songIndex,
                    inline: true
                }, {
                    name: `**Time until Played**`,
                    value: timeUntilPlayed,
                    inline: true
                }, {
                    name: `**URL**`,
                    value: `[Link](${song.url})`,
                    inline: true
                }, )
                .setFooter(`Requested by: ${song.requestedBy}`)
                .setTimestamp(new Date());

            // Send the message and add reation options
            return channel.send(queueAddEmbed).then(async msg => {
                await msg.react(`⏭️`);
                await msg.react(`❌`);

                const filter = (reaction, user) => [`⏭️`, `❌`].includes(reaction.emoji.name) && user.id !== msg.author.id;

                msg.awaitReactions(filter, {
                    max: 1,
                    time: 30000,
                    errors: [`time`]
                }).then(async collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === `⏭️`) {
                        this.currentSong = songIndex;
                        if (this.loop !== `single`) this.currentSong--;
                        this.connection.dispatcher.end();

                        let skippedToEmbed = new Discord.MessageEmbed()
                            .setColor(0x9cd6ff)
                            .setTitle(`⏭️  Skipped to **${this.songs[songIndex].title}**!`);

                        channel.send(skippedToEmbed);

                    } else if (reaction.emoji.name === `❌`) {
                        const song = this.songs.splice(songIndex, 1);

                        let removeEmbed = new Discord.MessageEmbed()
                            .setColor(0xff668a)
                            .setTitle(`❌  Removed **${song[0].title}** from the queue!`);

                        channel.send(removeEmbed);
                    }

                    return msg.delete();

                }).catch(error => {
                    msg.reactions.removeAll();
                });
            });
        }
    }

    async queuePlaylist (playlist, message) {
        let attemptingToQueueEmbed = new Discord.MessageEmbed()
            .setColor(0xdbbe00)
            .setTitle(`Attempting to queue ${playlist.items.length + 1} songs...`);

        let songsAdded = 0;
        await message.channel.send(attemptingToQueueEmbed).then(async msg => {
            for (const video of playlist.items) {
                const songInfo = await ytdl.getInfo(video.id).catch(error => {
                    log(error, `red`);
                });

                if (!songInfo) {
                    message.channel.send(`*Error adding "${video.title}" to the queue!*`);
                    continue;
                }

                const song = new Song(songInfo, message.author);
                if (!song) {
                    message.channel.send(`*Error adding "${video.title}" to the queue!*`);
                    continue;
                }

                await this.songs.push(song);

                songsAdded++;

                let attemptingToQueueEmbed = new Discord.MessageEmbed()
                    .setColor(0xdbbe00)
                    .setTitle(`Queued ${songsAdded}/${playlist.items.length + 1} songs...`);

                await msg.edit(attemptingToQueueEmbed);
            }

            await msg.delete();
        });

        let successfullyQueuedEmbed = new Discord.MessageEmbed()
            .setColor(0x57ff5c)
            .setTitle(`Successfully queued ${songsAdded + 1} songs!`);

        return message.channel.send(successfullyQueuedEmbed);
    }
}

module.exports = Queue;