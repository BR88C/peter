import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`ping`)
    .setDescription(`Displays the bot's ping`)
    .setExecute(async (ctx) => {
        let lavalinkTotalPing = 0;
        for (const node of ctx.client.lavalink.nodes.values()) {
            lavalinkTotalPing += await node.getPing();
        }

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.BLURPLE)
                .setTitle(`Ping`)
                .setDescription([
                    `\`\`\``,
                    `Gateway: ${Math.round(ctx.client.gateway.shards.reduce((p, c) => p + c.ping, 0) / ctx.client.gateway.shards.size)}ms`,
                    `Lavalink: ${Math.round(lavalinkTotalPing / ctx.client.lavalink.nodes.size)}ms`,
                    `\`\`\``
                ].join(`\n`))
        );
    });
