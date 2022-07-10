import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`help`)
    .setDescription(`Get Help`)
    .setExecute(async (ctx) => {
        await ctx.send(
            new Embed()
                .setColor(DiscordColors.BLURPLE)
                .setTitle(`Help`)
                .setDescription([
                    `Support Server: ${process.env.SUPPORT_SERVER?.length ? process.env.SUPPORT_SERVER : `\`Support Server Unavailable\``}`,
                    `\`\`\``,
                    `Commands:`,
                    ctx.commandHandler.commands.map((command) => command.getRaw().name).join(`, `),
                    `\`\`\``
                ].join(`\n`))
        );
    });
