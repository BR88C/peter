const constants = require(`../../config/constants.js`);

module.exports = {
    command: `vote`,
    aliases: [`votelink`],
    exec: (ctx) => {
        ctx.embed
            .color(constants.VOTE_EMBED_COLOR)
            .title(`Vote Link:`)
            .description(constants.VOTE_LINK)
            .send();
    }
};
