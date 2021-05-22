const constants = require(`../../config/constants.js`);

module.exports = {
    command: `vote`,
    interaction: {
        name: `vote`,
        description: `Gets the bot's vote link.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(constants.VOTE_EMBED_COLOR)
            .title(`Vote Link:`)
            .description(constants.VOTE_LINK)
            .send();
    }
};
