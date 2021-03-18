const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const randomInt = require(`../../utils/randomInt.js`);

module.exports = {
    name: `8ball`,
    description: `Returns an output from a Magic 8 ball`,
    aliases: [`eightball`],

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        const possibleOutputs = [
            `As I see it, yes.`,
            `Ask again later.`,
            `Better not tell you now.`,
            `Cannot predict now.`,
            `Concentrate and ask again.`,
            `Don’t count on it.`,
            `It is certain.`,
            `It is decidedly so.`,
            ` Most likely.`,
            ` My reply is no.`,
            `My sources say no.`,
            `Outlook not so good.`,
            `Outlook good.`,
            `Reply hazy, try again.`,
            `Signs point to yes.`,
            `Very doubtful.`,
            `Without a doubt.`,
            `Yes.`,
            `Yes – definitely.`,
            `You may rely on it.`
        ];

        const output = possibleOutputs[randomInt(0, possibleOutputs.length - 1)];

        let headsEmbed = new Discord.MessageEmbed()
            .setColor(0xd4d4d4)
            .setTitle(`🎱  ${output}`);

        return message.channel.send(headsEmbed);
    }
};
