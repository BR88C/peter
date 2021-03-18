const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const stopAllMusic = require(`../../modules/stopAllMusic.js`);

module.exports = {
    name: `stopbot`,
    description: `Stops the bot`,
    devOnly: true,
    hide: true,
    aliases: [`stop-bot`],
    async execute (client, message, args) {
        let confirmationEmbed = new Discord.MessageEmbed()
            .setTitle(`Confirm`)
            .setColor(0xff0000)
            .setDescription(`Are you sure you want to stop Peter?`);

        message.channel.send(confirmationEmbed).then(async msg => {
            await msg.react(`✅`);
            await msg.react(`❌`);

            const filter = (reaction, user) => [`✅`, `❌`].includes(reaction.emoji.name) && client.config.devs.ids.includes(user.id);

            msg.awaitReactions(filter, {
                max: 1,
                time: 1e4,
                errors: [`time`]
            }).then(async collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === `✅`) {
                    await message.channel.send(`Starting shutdown process.`);
                    log(`\nUser ${message.author.tag} ran the stopbot command. Stopping all music and the node process.`, `red`);

                    await stopAllMusic(client);
                    log(`All music stopped.`, `red`);

                    await client.user.setPresence({
                        activity: {
                            name: `Restarting Bot`,
                            type: `PLAYING`
                        },
                        status: `dnd`
                    }).catch((error) => log(error, `red`));
                    log(`Bot presence set to DND.`, `red`);

                    log(`\nStopped. Bot Offline.`, `red`);
                    log(``, `white`);
                    process.exit();
                } else if (reaction.emoji.name === `❌`) {
                    msg.reactions.removeAll().catch((error) => {});
                    return message.channel.send(`Cancelled bot shutdown process.`);
                }
            }).catch((error) => msg.reactions.removeAll().catch((error) => {}));
        });
    }
};
