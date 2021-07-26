import { Config } from '../../config/Config';

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
                if (PermissionsUtils.has(PermissionsUtils.combine({
                    guild,
                    member: await ctx.worker.api.members.get(ctx.interaction.guild_id!, ctx.author.id),
                    roleList: guild.roles.reduce((p, c) => p.set(c.id, c), new Collection()) as any
                }), `manageGuild`)) return void ctx.error(`You must have the "Manage Server" permission to set DJ commands.`);

                // @ts-expect-error Property 'category' does not exist on type 'CommandOptions'.
                if (!ctx.worker.commands.commands?.find((command) => command.category === `music` && command.interaction?.name.toLowerCase() === ctx.options.dj.command.toLowerCase())) return void ctx.error(`Invalid command.`);

                const guildDocument = await ctx.worker.mongoClient.db(Config.mongo.dbName).collection(`Guild`).findOne({ id: ctx.interaction.guild_id });
                if (!guildDocument) {
                    await ctx.worker.mongoClient.db(Config.mongo.dbName).collection(`Guild`).insertOne({
                        id: ctx.interaction.guild_id,
                        premium: false,
                        djCommands: [ctx.options.dj.command.toLowerCase()]
                    });
                } else {
                    await ctx.worker.mongoClient.db(Config.mongo.dbName).collection(`Guild`).updateOne({ id: ctx.interaction.guild_id }, { $set: { djCommands: guildDocument.djCommands } });
                }
            } else {

            }
        }
    }
} as CommandOptions;
