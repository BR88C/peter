const constants = require(`../../config/constants.js`);

module.exports = {
    command: `cointoss`,
    interaction: {
        name: `cointoss`,
        description: `Tosses a coin, and returns heads or tails.`
    },
    exec: async (ctx) => {
        ctx.embed
            .color(constants.COIN_TOSS_EMBED_COLOR)
            .title(`The coin landed on ${Math.random() >= 0.5 ? `heads` : `tails`}!`)
            .send();
    }
};
