const constants = require(`../../config/constants.js`);

module.exports = {
    command: `invite`,
    interaction: {},
    exec: (ctx) => {
        ctx.embed
            .color(constants.INVITE_EMBED_COLOR)
            .title(`Invite link:`)
            .description(constants.INVITE_LINK)
            .send();
    }
};
