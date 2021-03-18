const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const currentTime = require(`../../utils/currentTime.js`);
const time = require(`../../utils/time.js`);
const randomInt = require(`../../utils/randomInt.js`);

module.exports = {
    name: `queue`,
    description: `Lists the queue`,
    guildOnly: true,
    aliases: [`q`, `list`, `ls`],
    async execute (client, message, args) {
        // If the queue is empty reply with an error
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs[0]) return message.channel.send(`There is nothing in the queue.`);

        let currentSong;
        let completed;
        if (serverQueue.songs[serverQueue.currentSong]) {
            currentSong = serverQueue.songs[serverQueue.currentSong];
            completed = currentTime(serverQueue);
        } else {
            currentSong = {
                title: `No song playing`,
                timestamp: ``,
                rawTime: 0,
                startTime: 0
            };
            completed = 0;
        }

        // Gets total raw queue time
        let totalRawTime = 0;
        for (const song of serverQueue.songs) totalRawTime += song.rawTime;

        // If the user specifies a song
        if (args.length) {
            // Gets queue length
            const queueLength = serverQueue.songs.length;

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
                    timeUntilPlayed = time(Math.round((totalRawTime / (serverQueue.effects.speed / 100)) - completed - serverQueue.songs[specifiedIndex - 1].rawTime));
                } else {
                    timeUntilPlayed = `N/A`;
                }
            } else if (specifiedIndex - 1 > serverQueue.currentSong) {
                const songsBefore = serverQueue.songs.slice(serverQueue.currentSong, specifiedIndex - 1);
                timeUntilPlayed = time(Math.round((totalRawTime / (serverQueue.effects.speed / 100)) - completed));

                timeUntilPlayed = 0;
                for (const song of songsBefore) {
                    timeUntilPlayed += song.rawTime;
                }
                timeUntilPlayed = time(Math.round((timeUntilPlayed / (serverQueue.effects.speed / 100)) - completed));
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
                })
                .setImage(serverQueue.songs[specifiedIndex - 1].thumbnail)
                .setFooter(`Requested by: ${serverQueue.songs[specifiedIndex - 1].requestedBy}`)
                .setTimestamp(new Date());

            return message.channel.send(queueEmbed);
        }

        const totalTime = Math.round(totalRawTime / (serverQueue.effects.speed / 100));

        // Gets time left in queue
        const songTimeLeft = Math.round(currentSong.rawTime - completed);
        const songsLeft = serverQueue.songs.slice(serverQueue.currentSong);
        let totalTimeLeft = 0;
        for (const song of songsLeft) {
            totalTimeLeft += song.rawTime;
        }
        totalTimeLeft = Math.round((totalTimeLeft / (serverQueue.effects.speed / 100)) - completed);

        // Creates list of songs in queue
        let queueList = [];
        for (const [i, song] of serverQueue.songs.entries()) {
            const current = i === serverQueue.currentSong ? `↳ ` : ``;
            queueList.push(`${current}**${i + 1}.** [${song.title}](${song.url}) [${song.timestamp}]`);
        }

        // Gets emojis
        const emojiGuild = client.guilds.forge(client.config.emojiGuild);
        const textChannel = await emojiGuild.emojis.fetch(client.config.emojis.textChannel);
        const voiceChannel = await emojiGuild.emojis.fetch(client.config.emojis.voiceChannel);
        const nowPlayingEmojis = [message.client.config.emojis.nowPlaying, message.client.config.emojis.conga, message.client.config.emojis.catjam, message.client.config.emojis.pepedance, message.client.config.emojis.pepejam, message.client.config.emojis.peepojam];
        const nowPlayingEmoji = await emojiGuild.emojis.fetch(nowPlayingEmojis[randomInt(0, nowPlayingEmojis.length - 1)]);

        let title;
        if (serverQueue.songs[serverQueue.currentSong]) {
            title = `${nowPlayingEmoji}  **Now Playing**: ${currentSong.title} [${time(songTimeLeft)} remaining]`;
        } else {
            title = `**No song playing**`;
        }
        const thumbnail = currentSong.thumbnail;

        // Generate the embed
        const generateQueueEmbed = async (queueContent) => {
            let queueEmbed = new Discord.MessageEmbed()
                .setColor(0x1e90ff)
                .setAuthor(`Song Queue (${queueList.length})`)
                .setTitle(title)
                .setThumbnail(thumbnail)
                .setDescription(queueContent)
                .addFields({
                    name: `**Queue length**`,
                    value: time(totalTime),
                    inline: true
                }, {
                    name: `**Time left**`,
                    value: time(totalTimeLeft),
                    inline: true
                }, {
                    name: `**Bitrate**`,
                    value: serverQueue.bitrate,
                    inline: true
                }, {
                    name: `**Channels**`,
                    value: `${voiceChannel}  ${serverQueue.channel.name}\n${textChannel}  ${serverQueue.textChannel.name}`,
                    inline: true
                }, {
                    name: `**Loop**`,
                    value: `${serverQueue.loop}`,
                    inline: true
                }, {
                    name: `**24/7**`,
                    value: serverQueue.twentyFourSeven,
                    inline: true
                }, {
                    name: `**Active Effects**`,
                    value: serverQueue.effectsString(`formatted`)
                })
                .setTimestamp(new Date());

            return queueEmbed;
        };

        // Sends the embed and adds reactions for navigating pages if needed
        if (queueList.length > 10) {
            let page = Math.ceil((serverQueue.currentSong + 1) / 10);
            let maxPage = Math.ceil(queueList.length / 10);

            const filter = (reaction, user) => [`⬅️`, `➡️`].includes(reaction.emoji.name) && user.id !== client.user.id;

            const sendReactionQueueEmbed = async () => {
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
                        } else if (reaction.emoji.name === `➡️`) {
                            page++;
                            if (page > maxPage) page = 1;
                        }

                        msg.delete().catch((error) => log(error, `red`));
                        return sendReactionQueueEmbed();
                    }).catch((error) => {
                        log(error, `red`);
                        msg.reactions.removeAll();
                    });
                });
            };

            return sendReactionQueueEmbed();

            // If there are less than 10 songs send the queue embed normally
        } else {
            return message.channel.send(await generateQueueEmbed(`${queueList.join(`\n`)}\n\n*Page 1/1*`));
        }
    }
};
