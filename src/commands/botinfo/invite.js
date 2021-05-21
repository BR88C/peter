const constants = require(`../../config/constants.js`);

module.exports = {
    command: `invite`,
    aliases: [`invitelink`],
    exec: (ctx) => {
        ctx.embed
            .color(constants.INVITE_EMBED_COLOR)
            .title(`Invite link:`)
            .description(constants.INVITE_LINK)
            .send();
    }
};
