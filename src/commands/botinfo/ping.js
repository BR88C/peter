const constants = require(`../../config/constants.js`);

module.exports = {
    command: `ping`,
    interaction: {
        name: `ping`,
        description: `Gets the bot's ping.`
    },
    exec: (ctx) => {
        ctx.embed
            .color(constants.PING_EMBED_COLOR)
            .title(`Pong!`)
            .description(`\`\`\`js\n${ctx.worker.shards.find((shard) => shard.worker.guilds.has(ctx.message.guild_id)).ping} ms\n\`\`\``)
            .send();
    }
};
