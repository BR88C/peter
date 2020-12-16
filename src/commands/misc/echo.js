const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `echo`,
    description: `Says a custom message`,
    args: true,
    devOnly: true,
    hide: true,
    usage: `<message>`,
    async execute (client, message, args) {
        const customMessage = args.slice(0).join(" ");
        await message.delete().catch(error => {});
        return message.channel.send(customMessage);
    },
}