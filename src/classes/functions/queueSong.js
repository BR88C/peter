/* Function to queue a provided song */

const Discord = require(`discord.js-light`);
const currentTime = require(`../../utils/currentTime.js`);
const time = require(`../../utils/time.js`);

const queueSong = async (song, message, hidden, serverQueue) => {
    serverQueue.songs.push(song);

    const channel = message ? message.channel : serverQueue.textChannel;

    const songIndex = serverQueue.songs.indexOf(song);
    const songsBefore = serverQueue.songs.slice(serverQueue.currentSong, songIndex);

    let timeUntilPlayed;
    if (serverQueue.connection && serverQueue.connection.dispatcher) {
        const completed = currentTime(serverQueue);
        timeUntilPlayed = 0;
        for (const song of songsBefore) {
            timeUntilPlayed += song.rawTime;
        }
        timeUntilPlayed = time(Math.round((timeUntilPlayed / (serverQueue.effects.speed / 100)) - completed));
    } else {
        timeUntilPlayed = `Unavailable`;
    }

    if (!hidden && !song.hidden) {
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
                    serverQueue.currentSong = songIndex;
                    if (serverQueue.loop !== `single`) serverQueue.currentSong--;
                    serverQueue.connection.dispatcher.end();

                    let skippedToEmbed = new Discord.MessageEmbed()
                        .setColor(0x9cd6ff)
                        .setTitle(`⏭️  Skipped to **${serverQueue.songs[songIndex].title}**!`);

                    channel.send(skippedToEmbed);

                } else if (reaction.emoji.name === `❌`) {
                    const song = serverQueue.songs.splice(songIndex, 1);

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
};

module.exports = queueSong;