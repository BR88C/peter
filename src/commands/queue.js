const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);
const currentTime = require(`../utils/currentTime.js`);
const time = require(`../utils/time.js`);

module.exports = {
    name: `queue`,
    description: `Lists the queue`,
    category: `Music`,
    guildOnly: true,
    aliases: [`q`],
    async execute (client, message, args) {
        // If the queue is empty reply with an error
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs[0]) return message.channel.send(`There is nothing in the queue.`);

        // Gets active effects
        let activeEffects = [];
        if (serverQueue.bass !== 0) activeEffects.push(`Bass = +${serverQueue.bass}%`);
        if (serverQueue.flanger !== 0) activeEffects.push(`Flanger = ${serverQueue.flanger}%`);
        if (serverQueue.lowpass !== 0) activeEffects.push(`Lowpass = +${serverQueue.lowpass}%`);
        if (serverQueue.highpass !== 0) activeEffects.push(`Highpass = +${serverQueue.highpass}%`);
        if (serverQueue.phaser !== 0) activeEffects.push(`Phaser = ${serverQueue.phaser}%`);
        if (serverQueue.pitch !== 100) activeEffects.push(`Pitch = ${serverQueue.pitch}%`);
        if (serverQueue.speed !== 100) activeEffects.push(`Speed = ${serverQueue.speed}%`);
        if (serverQueue.treble !== 0) activeEffects.push(`Treble = +${serverQueue.treble}%`);
        if (serverQueue.vibrato !== 0) activeEffects.push(`Vibrato = ${serverQueue.vibrato}%`);
        if (serverQueue.volume !== 100) activeEffects.push(`Volume = ${serverQueue.volume}%`)
        if (activeEffects[0]) {
            activeEffects = `\`\`\`${activeEffects.join(`, `)}\`\`\``;
        } else {
            activeEffects = `\`\`\`No Active effects\`\`\``;
        }

        // Gets current song's time completed
        const completed = currentTime(serverQueue);



        // If the user specifies a song
        if (args.length) {
            // Gets queue length
            const queueLength = (serverQueue.songs).length;

            // Set specified index
            const specifiedIndex = parseInt(args[0]);

            // Checks if the argument provided is an integer
            if (isNaN(specifiedIndex)) return message.reply(`please specify an Integer!`);

            // Checks if the queue has a song tagged with the number specified
            if (specifiedIndex > queueLength || specifiedIndex < 1) return message.reply(`there isnt a song in the queue with that number!`);

            // Sets time until played based on song's position in queue relative to song currently playing
            let timeUntilPlayed;
            if (specifiedIndex - 1 < serverQueue.currentSong) {
                if (serverQueue.loop === `queue`) {
                    timeUntilPlayed = 0;
                    serverQueue.songs.forEach(song => {
                        timeUntilPlayed += song.rawTime;
                    });
                    timeUntilPlayed = time(Math.round((timeUntilPlayed / (serverQueue.speed / 100)) - completed - serverQueue.songs[specifiedIndex - 1].rawTime));

                } else {
                    timeUntilPlayed = `N/A`;
                }

            } else if (specifiedIndex - 1 > serverQueue.currentSong) {
                const songsBefore = serverQueue.songs.slice(serverQueue.currentSong, specifiedIndex - 1);

                timeUntilPlayed = 0;
                songsBefore.forEach(song => {
                    timeUntilPlayed += song.rawTime;
                });
                timeUntilPlayed = time(Math.round((timeUntilPlayed / (serverQueue.speed / 100)) - completed));

            } else {
                timeUntilPlayed = `Currently Playing`;
            }

            // Creates and sends the embed
            let queueEmbed = new Discord.MessageEmbed()
                .setColor(0x1e90ff)
                .setAuthor(`Queued song number ${specifiedIndex}:`)
                .setTitle(`**${serverQueue.songs[specifiedIndex - 1].title}**`)
                .addFields({
                    name: `**Song Length**`,
                    value: serverQueue.songs[specifiedIndex - 1].timestamp,
                    inline: true
                }, {
                    name: `**Time until Played**`,
                    value: timeUntilPlayed,
                    inline: true
                }, {
                    name: `**URL**`,
                    value: `[Link](${serverQueue.songs[specifiedIndex - 1].url})`,
                    inline: true
                }, )
                .setImage(serverQueue.songs[specifiedIndex - 1].thumbnail)
                .setFooter(`Requested by: ${serverQueue.songs[specifiedIndex - 1].requestedBy.tag}`)
                .setTimestamp(new Date());

            return message.channel.send(queueEmbed);
        }



        // Generates info for time
        const songTimeLeft = Math.round(serverQueue.songs[serverQueue.currentSong].rawTime - completed);
        const songsLeft = serverQueue.songs.slice(serverQueue.currentSong);
        let totalTime = 0;
        songsLeft.forEach(song => {
            totalTime += song.rawTime;
        });
        totalTime = Math.round((totalTime / (serverQueue.speed / 100)) - completed);

        // Creates list of songs in queue
        let queueList = [];
        serverQueue.songs.forEach((song, i) => {
            if (i === serverQueue.currentSong) {
                current = `↳ `;
            } else {
                current = ``;
            }
            queueList.push(`${current}**${i + 1}.** [${song.title}](${song.url}) [${song.timestamp}]`);
        });



        // Generate the embed
        async function generateQueueEmbed (queueContent) {
            let queueEmbed = new Discord.MessageEmbed()
                .setColor(0x1e90ff)
                .setAuthor(`Song Queue`)
                .setTitle(`**Now Playing**: ${serverQueue.songs[serverQueue.currentSong].title} [${time(songTimeLeft)} remaining]`)
                .setThumbnail(serverQueue.songs[serverQueue.currentSong].thumbnail)
                .setDescription(queueContent)
                .addFields({
                    name: `\u200B`,
                    value: `\u200B`
                }, {
                    name: `**Approximate Time left**`,
                    value: time(totalTime),
                    inline: true
                }, {
                    name: `**Loop**`,
                    value: `${serverQueue.loop}`,
                    inline: true
                }, {
                    name: `**Channel**`,
                    value: serverQueue.channel.name,
                    inline: true
                }, {
                    name: `**Active Effects**`,
                    value: activeEffects
                })
                .setTimestamp(new Date());

            return queueEmbed;
        }



        // Sends the embed and adds reactions for navigating pages if needed
        if (queueList.length > 10) {
            let page = Math.ceil((serverQueue.currentSong + 1) / 10);
            let maxPage = Math.ceil(queueList.length / 10);

            const filter = (reaction, user) => [`⬅️`, `➡️`].includes(reaction.emoji.name) && user.id !== client.user.id;

            async function sendReactionQueueEmbed () {
                let queuePage = queueList.slice((page * 10) - 10, page * 10);
                queuePage.push(`\n*Page ${page}/${maxPage}*`);

                message.channel.send(await generateQueueEmbed(queuePage.join(`\n`))).then(async msg => {
                    await msg.react(`⬅️`);
                    await msg.react(`➡️`);

                    msg.awaitReactions(filter, {
                        max: 1,
                        time: 30000,
                        errors: [`time`]
                    }).then(async collected => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === `⬅️`) {
                            page--;
                            if (page < 1) page = maxPage;

                            msg.delete();
                            return sendReactionQueueEmbed();

                        } else if (reaction.emoji.name === `➡️`) {
                            page++;
                            if (page > maxPage) page = 1;

                            msg.delete();
                            return sendReactionQueueEmbed();
                        }
                    }).catch(error => {
                        msg.reactions.removeAll();
                    });
                });
            }

            return sendReactionQueueEmbed();

        // If there are less than 10 songs send the queue embed normally
        } else {
            return message.channel.send(await generateQueueEmbed(queueList.join(`\n`)));
        }
    },
}