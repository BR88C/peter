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
                    },
                    {
                        type: 4,
                        name: `useroverride`,
                        description: `The amount of users needed in a VC to restrict commands to DJ only.`,
                        required: false
                    }
                ]
            }
        ]
    },
    exec: async (ctx) => {
        if (ctx.options.dj) {
            if (ctx.options.dj.command || typeof ctx.options.dj.useroverride === `number`) {
                const guild = await ctx.worker.api.guilds.get(ctx.interaction.guild_id!);
                if (!PermissionsUtils.has(PermissionsUtils.combine({
                    guild,
                    member: ctx.interaction.member!,
                    roleList: guild.roles.reduce((p, c) => p.set(c.id, c), new Collection()) as any
                }), `manageGuild`)) return void ctx.error(`You must have the "Manage Server" permission to set DJ config.`);

                if (ctx.options.dj.command) {
                    if (!ctx.worker.commands.commands) return void ctx.error(`Unable to get commands.`);
                    // @ts-expect-error Property 'category' does not exist on type 'CommandOptions'.
                    if (!ctx.worker.commands.commands.find((command) => command.category === `music` && command.interaction?.name.toLowerCase() === ctx.options.dj.command.toLowerCase())) return void ctx.error(`Invalid command.`);
                }

                const guildDocument = await ctx.worker.mongoClient.db(Config.mongo.dbName).collection(`Guilds`).findOne({ id: ctx.interaction.guild_id });
                if (!guildDocument) {
                    await ctx.worker.mongoClient.db(Config.mongo.dbName).collection(`Guilds`).insertOne({
                        id: ctx.interaction.guild_id,
                        premium: false,
                        djCommands: ctx.options.dj.command ? [ctx.options.dj.command.toLowerCase()] : [],
                        djOverride: !ctx.options.dj.useroverride || ctx.options.dj.useroverride === 1 ? 0 : 0
                    });
                } else {
                    let newArray: string[] | undefined;
                    if (ctx.options.dj.command) newArray = guildDocument.djCommands.includes(ctx.options.dj.command.toLowerCase()) ? guildDocument.djCommands.filter((command) => command !== ctx.options.dj.command.toLowerCase()) : guildDocument.djCommands.concat(ctx.options.dj.command.toLowerCase());
                    await ctx.worker.mongoClient.db(Config.mongo.dbName).collection(`Guilds`).updateOne({ id: ctx.interaction.guild_id }, { $set: {
                        djCommands: newArray ?? guildDocument.djCommands, djOverride: ctx.options.dj.useroverride ?? guildDocument.djOverride
                    } });
                }

                const newSettings: string[] = [];
                if (ctx.options.dj.command) newSettings.push(`Toggled the \`${ctx.options.dj.command.toLowerCase()}\` command to be \`${guildDocument?.djCommands.includes(ctx.options.dj.command.toLowerCase()) ? `Public` : `DJ only`}\``);
                if (typeof ctx.options.dj.useroverride === `number`) newSettings.push(`Set the amount of users needed in a VC to restrict commands to DJ only to \`${ctx.options.dj.useroverride}\``);
                ctx.embed
                    .color(Constants.CONFIG_EMBED_COLOR)
                    .title(newSettings.join(` and `))
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
                    .description(`Peter's DJ configuration works by toggling individual commands to be public or DJ only, allowing for total control over what non-DJs can and cannot access. You can toggle commands by specifying a value for the \`command\` option. Defaults to all commands being public.\n\nAdditionally, you can set the amount of users needed in a VC to restrict commands to DJ only with the \`useroverride\` option, allowing for users that are alone or with a few people in a VC to not be restricted by DJ locked commands. A value of 0 or 1 will always enforce DJ only commands. Peter is not included in the user count. Defaults to 0.\n\nTo make someone a DJ, simply give them a role named "DJ". Users with the "Manage Server" or "Administrator" permissions are also considered DJs.`)
                    .field(`Amount of users needed in a VC to restrict commands to DJ only`, `\`${guildDocument?.djOverride ?? 0}\``, false)
                    .field(`Current Command Configuration`, commands.splice(0, Math.ceil(commands.length / 2)).join(`\n`), true)
                    .field(`\u200b`, commands.join(`\n`), true)
                    .footer(`🔒 = DJ only, 🌎 = Public`)
                    .send()
                    .catch((error) => void ctx.error(error));
            }
        }
    }
} as CommandOptions;
