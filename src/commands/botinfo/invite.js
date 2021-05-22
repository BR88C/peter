const constants = require(`../../config/constants.js`);

module.exports = {
    command: `invite`,
    interaction: {
        name: `invite`,
        description: `Gets the bot's invite link.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(constants.INVITE_EMBED_COLOR)
            .title(`Invite link:`)
            .description(constants.INVITE_LINK)
            .send();
    }
};
