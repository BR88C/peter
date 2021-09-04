"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../config/Config"));
const Constants_1 = __importDefault(require("../../config/Constants"));
const collection_1 = require("@discordjs/collection");
const discord_rose_1 = require("discord-rose");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
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
                        description: `The amount of users needed in a voice channel to restrict commands to DJ only.`,
                        required: false
                    }
                ]
            }
        ]
    },
    exec: async (ctx) => {
        if (ctx.options.dj) {
            if (ctx.options.dj.command || typeof ctx.options.dj.useroverride === `number`) {
                const guild = await ctx.worker.api.guilds.get(ctx.interaction.guild_id).catch((error) => discord_utils_1.Utils.logError(error));
                if (!guild)
                    return void ctx.error(`An error occurred while checking if you have permission to use this command. Please try again.`);
                if (!discord_rose_1.PermissionsUtils.has(discord_rose_1.PermissionsUtils.combine({
                    guild,
                    member: ctx.interaction.member,
                    roleList: guild.roles.reduce((p, c) => p.set(c.id, c), new collection_1.Collection())
                }), `manageGuild`))
                    return void ctx.error(`You must have the "Manage Server" permission to set DJ config.`);
                if (ctx.options.dj.command) {
                    if (!ctx.worker.commands.commands)
                        return void ctx.error(`Unable to get the command list. Please try again.`);
                    if (!ctx.worker.commands.commands.find((command) => command.category === `music` && command.interaction.name.toLowerCase() === ctx.options.dj.command.toLowerCase()))
                        return void ctx.error(`The specified command does not exist.`);
                }
                if (ctx.options.dj.useroverride < 0)
                    return void ctx.error(`Please specify a postivie value or 0 for the "useroverride" field.`);
                if (ctx.options.dj.useroverride === 1)
                    ctx.options.dj.useroverride = 0;
                try {
                    const db = ctx.worker.mongoClient.db(Config_1.default.mongo.dbName).collection(`Guilds`);
                    const guildDocument = await db.findOne({ id: ctx.interaction.guild_id });
                    if (!guildDocument) {
                        await db.insertOne({
                            id: ctx.interaction.guild_id,
                            premium: false,
                            djCommands: ctx.options.dj.command ? [ctx.options.dj.command.toLowerCase()] : [],
                            djOverride: ctx.options.dj.useroverride ?? 0
                        });
                    }
                    else {
                        let newArray;
                        if (ctx.options.dj.command)
                            newArray = guildDocument.djCommands.includes(ctx.options.dj.command.toLowerCase()) ? guildDocument.djCommands.filter((command) => command !== ctx.options.dj.command.toLowerCase()) : guildDocument.djCommands.concat(ctx.options.dj.command.toLowerCase());
                        await db.updateOne({ id: ctx.interaction.guild_id }, { $set: {
                                djCommands: newArray ?? guildDocument.djCommands, djOverride: ctx.options.dj.useroverride ?? guildDocument.djOverride
                            } });
                    }
                    const newSettings = [];
                    if (ctx.options.dj.command)
                        newSettings.push(`Toggled the \`${ctx.options.dj.command.toLowerCase()}\` command to be \`${guildDocument?.djCommands.includes(ctx.options.dj.command.toLowerCase()) ? `Public` : `DJ only`}\``);
                    if (typeof ctx.options.dj.useroverride === `number`)
                        newSettings.push(`Set the amount of users needed in a voice channel to restrict commands to DJ only to \`${ctx.options.dj.useroverride}\``);
                    ctx.embed
                        .color(Constants_1.default.CONFIG_EMBED_COLOR)
                        .title(newSettings.join(` and `))
                        .send(true, false, true)
                        .catch((error) => {
                        discord_utils_1.Utils.logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
                }
                catch (error) {
                    void ctx.error(`An unknown error occurred while modifying your server's config. Please submit an issue in our support server.`);
                }
            }
            else {
                if (!ctx.worker.commands.commands)
                    return void ctx.error(`Unable to get the command list. Please try again.`);
                ctx.worker.mongoClient.db(Config_1.default.mongo.dbName).collection(`Guilds`).findOne({ id: ctx.interaction.guild_id })
                    .then((guildDocument) => {
                    const commands = ctx.worker.commands.commands.filter((command) => !!command.interaction && command.category === `music`).map((command) => `${guildDocument?.djCommands.includes(command.interaction.name) ? `:lock:` : `:earth_americas:`} \`${command.interaction.name}\``);
                    ctx.embed
                        .color(Constants_1.default.CONFIG_EMBED_COLOR)
                        .title(`DJ Config`)
                        .description(`Peter's DJ configuration works by toggling individual commands to be public or DJ only, allowing for total control over what non-DJs can and cannot access. You can toggle commands by specifying a value for the \`command\` option. Defaults to all commands being public.\n\nAdditionally, you can set the amount of users needed in a voice channel to restrict commands to DJ only with the \`useroverride\` option, allowing for users that are alone or with a few people in a voice channel to not be restricted by DJ locked commands. A value of 0 or 1 will always enforce DJ only commands. Peter is not included in the user count. Defaults to 0.\n\nTo make someone a DJ, simply give them a role named "DJ". Users with the "Manage Server" or "Administrator" permissions are also considered DJs.`)
                        .field(`Amount of users needed in a voice channel to restrict commands to DJ only`, `\`${guildDocument?.djOverride ?? 0}\``, false)
                        .field(`Current Command Configuration`, commands.splice(0, Math.ceil(commands.length / 2)).join(`\n`), true)
                        .field(`\u200b`, commands.join(`\n`), true)
                        .footer(`🔒 = DJ only, 🌎 = Public`)
                        .send()
                        .catch((error) => {
                        discord_utils_1.Utils.logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
                })
                    .catch((error) => {
                    discord_utils_1.Utils.logError(error);
                    void ctx.error(`An unknown error occurred while getting your server's config. Please submit an issue in our support server.`);
                });
            }
        }
    }
};
