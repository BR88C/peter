import { Config } from '../../config/Config';
import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions, Embed } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `help`,
    allowButton: true,
    interaction: {
        name: `help`,
        description: `Get help using the bot.`,
        options: [
            {
                type: 3,
                name: `command`,
                description: `The name of the command.`,
                required: false
            }
        ]
    },
    exec: (ctx) => {
        if (!ctx.worker.commands.commands) return void ctx.error(`Unable to get the command list.`);

        if (ctx.options.command) {
            const command = ctx.worker.commands.commands.find((command) => command.interaction!.name.toLocaleLowerCase() === ctx.options.command.toLowerCase());
            if (!command || !command.interaction) return void ctx.error(`That command does not exist.`);
            ctx.embed
                .color(Constants.HELP_EMBED_COLOR)
                .title(`Command information`)
                .description(`**Name:** ${command.interaction.name}\n**Description:** ${command.interaction.description}`)
                .footer(`Peter! made by ${Config.devs.tags.join(`, `)}`)
                .timestamp()
                .send()
                .catch((error) => {
                    logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
        } else {
            const categories = [...new Set(ctx.worker.commands.commands.map((command) => command.category.toLowerCase()))].map((category) => ctx.worker.commands.commands!.filter((command) => !!command.interaction && command.category === category)).sort((a, b) => b.size - a.size);
            const helpEmbed = new Embed()
                .color(Constants.HELP_EMBED_COLOR)
                .title(`Help`)
                .description(`Peter's support server: ${Constants.SUPPORT_SERVER}`)
                .footer(`Peter! made by ${Config.devs.tags.join(`, `)}`)
                .timestamp();
            for (const category of categories) helpEmbed.field(`${category.first()!.category.charAt(0).toUpperCase()}${category.first()!.category.slice(1)}`, category.map((command) => `\`${command.interaction!.name}\``).join(`, `), true);
            ctx.send(helpEmbed).catch((error) => {
                logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        }
    }
} as CommandOptions;
