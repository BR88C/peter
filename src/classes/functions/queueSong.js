/* Function to queue a provided song */

const Discord = require(`discord.js-light`);
const currentTime = require(`../../utils/currentTime.js`);
const time = require(`../../utils/time.js`);

const queueSong = async (song, message) => {
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
};

module.exports = queueSong;