import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`ping`)
    .setDescription(`Displays the bot's ping`)
    .setExecute(async (ctx) => {
        await ctx.send(
            new Embed()
                .setColor(DiscordColors.BLURPLE)
                .setTitle(`Ping`)
                .setDescription([
                    `\`\`\``,
                    `Gateway: ${Math.round(ctx.client.gateway.shards.reduce((p, c) => p + c.ping, 0) / ctx.client.gateway.shards.size)}ms`,
                    `Lavalink: ${Math.round(await ctx.client.lavalink.averagePing())}ms`,
                    `\`\`\``
                ].join(`\n`))
        );
    });
