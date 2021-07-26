import { Config } from '../../config/Config';
import { Constants } from '../../config/Constants';

// Import modules.
import { Collection } from '@discordjs/collection';
import { CommandOptions, PermissionsUtils } from 'discord-rose';

export default {
    command: `serverconfig`,
    interaction: {
        name: `serverconfig`,
        description: `Configure settings for the server.`,
        options: [
            {
                type: 1,
                name: `dj`,
                description: `DJ Config. Information will be shown if a value isn't specified.`,
                options: [
                    {
                        type: 3,
                        name: `command`,
                        description: `The command to toggle access for.`,
                        required: false
                    }
                ]
            }
        ]
    },
    exec: async (ctx) => {
        if (ctx.options.dj) {
            if (ctx.options.dj.command) {
                const guild = await ctx.worker.api.guilds.get(ctx.interaction.guild_id!);
                if (!PermissionsUtils.has(PermissionsUtils.combine({
                    guild,
                    member: await ctx.worker.api.members.get(ctx.interaction.guild_id!, ctx.author.id),
                    roleList: guild.roles.reduce((p, c) => p.set(c.id, c), new Collection()) as any
                }), `manageGuild`)) return void ctx.error(`You must have the "Manage Server" permission to set DJ commands.`);

                if (!ctx.worker.commands.commands) return void ctx.error(`Unable to get commands.`);
                // @ts-expect-error Property 'category' does not exist on type 'CommandOptions'.
                if (!ctx.worker.commands.commands.find((command) => command.category === `music` && command.interaction?.name.toLowerCase() === ctx.options.dj.command.toLowerCase())) return void ctx.error(`Invalid command.`);

                const guildDocument = await ctx.worker.mongoClient.db(Config.mongo.dbName).collection(`Guilds`).findOne({ id: ctx.interaction.guild_id });
                if (!guildDocument) {
                    await ctx.worker.mongoClient.db(Config.mongo.dbName).collection(`Guilds`).insertOne({
                        id: ctx.interaction.guild_id,
                        premium: false,
                        djCommands: [ctx.options.dj.command.toLowerCase()]
                    });
                } else {
                    const newArray = guildDocument.djCommands.includes(ctx.options.dj.command.toLowerCase()) ? guildDocument.djCommands.filter((command) => command !== ctx.options.dj.command.toLowerCase()) : guildDocument.djCommands.concat(ctx.options.dj.command.toLowerCase());
                    await ctx.worker.mongoClient.db(Config.mongo.dbName).collection(`Guilds`).updateOne({ id: ctx.interaction.guild_id }, { $set: { djCommands: newArray } });
                }

                ctx.embed
                    .color(Constants.CONFIG_EMBED_COLOR)
                    .title(`Toggled the \`${ctx.options.dj.command.toLowerCase()}\` command to be \`${guildDocument?.djCommands.includes(ctx.options.dj.command.toLowerCase()) ? `Public` : `DJ only`}\``)
                    .send(true, false, true)
                    .catch((error) => void ctx.error(error));
            } else {
                if (!ctx.worker.commands.commands) return void ctx.error(`Unable to get commands.`);
                const guildDocument = await ctx.worker.mongoClient.db(Config.mongo.dbName).collection(`Guilds`).findOne({ id: ctx.interaction.guild_id });
                // @ts-expect-error Property 'category' does not exist on type 'CommandOptions'.
                const commands = ctx.worker.commands.commands.filter((command) => command.interaction && command.category === `music`).map((command) => `${guildDocument?.djCommands.includes(command.interaction.name) ? `:lock:` : `:earth_americas:`} \`${command.interaction.name}\``);

                ctx.embed
                    .color(Constants.CONFIG_EMBED_COLOR)
                    .title(`DJ Config`)
                    .description(`Peter's DJ configuration works by toggling individual commands to be public or DJ only, allowing for total control over what non-DJs can and cannot access. To make someone a DJ, simply give them a role named "DJ". You can create as many DJ roles as you would like.`)
                    .field(`Current Configuration`, commands.splice(0, Math.ceil(commands.length / 2)).join(`\n`), true)
                    .field(`\u200b`, commands.join(`\n`), true)
                    .footer(`🔒 = DJ only, 🌎 = Public`)
                    .send()
                    .catch((error) => void ctx.error(error));
            }
        }
    }
} as CommandOptions;
