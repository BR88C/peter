"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientManager = void 0;
const Lavalink_1 = require("./Lavalink");
const Constants_1 = require("../utils/Constants");
const tokenFilters_1 = require("../utils/tokenFilters");
const node_utils_1 = require("@br88c/node-utils");
const cmd_1 = require("@distype/cmd");
const lavalink_1 = require("@distype/lavalink");
const v10_1 = require("discord-api-types/v10");
const distype_1 = require("distype");
const node_path_1 = require("node:path");
class ClientManager extends distype_1.Client {
    constructor() {
        const logger = new node_utils_1.Logger({
            enabledOutput: { log: [`DEBUG`, `INFO`, `WARN`, `ERROR`] },
            sanitizeTokens: (0, tokenFilters_1.tokenFilters)()
        });
        super(process.env.BOT_TOKEN, {
            cache: {
                channels: [`permission_overwrites`, `type`],
                guilds: [`owner_id`, `roles`, `unavailable`],
                members: [`communication_disabled_until`, `roles`],
                roles: [`permissions`],
                voiceStates: [`channel_id`]
            },
            gateway: { intents: [`GUILDS`, `GUILD_VOICE_STATES`] }
        }, logger.log, logger);
        this.commandHandler = new cmd_1.CommandHandler(this, logger.log, logger);
        this.lavalink = new Lavalink_1.Lavalink(this, {
            clientName: `peter@${process.env.npm_package_version ?? `0.0.0`}`,
            nodeOptions: [
                {
                    location: {
                        host: process.env.LAVALINK_HOST,
                        port: parseInt(process.env.LAVALINK_PORT),
                        secure: process.env.LAVALINK_SECURE === `true`
                    },
                    password: process.env.LAVALINK_PASSWORD
                }
            ]
        }, logger.log, logger);
        this.logger = logger;
    }
    async init() {
        await this.commandHandler
            .setError(async (ctx, error, unexpected) => {
            const errorId = `${Math.round(Math.random() * 1e6).toString(36).padStart(5, `0`)}${Date.now().toString(36)}`.toUpperCase();
            this.logger.log(`${unexpected ? `Unexpected ` : ``}${error.name} (ID: ${errorId}) when running interaction ${ctx.interaction.id}: ${error.message}`, {
                level: `ERROR`, system: `Command Handler`
            });
            if (unexpected) {
                console.error(`\n${node_utils_1.LoggerRawFormats.RED}${error.stack}${node_utils_1.LoggerRawFormats.RESET}\n`);
            }
            const tokenFilter = (0, tokenFilters_1.tokenFilters)({
                token: ctx.interaction.token,
                replacement: `%interaction_token%`
            });
            await ctx.sendEphemeral(new cmd_1.Embed()
                .setColor(cmd_1.DiscordColors.BRANDING_RED)
                .setTitle(`Error`)
                .setDescription(`\`\`\`\n${(0, node_utils_1.sanitizeTokens)(error.message, tokenFilter)}\n\`\`\`\n*Support Server: ${process.env.SUPPORT_SERVER?.length ? process.env.SUPPORT_SERVER : `\`Support Server Unavailable\``}*`)
                .setFooter(`Error ID: ${errorId}`)
                .setTimestamp());
        })
            .setExpireError((ctx, error, unexpected) => {
            this.logger.log(`${unexpected ? `Unexpected ` : ``}${error.name} when running expire callback for component "${ctx.component.customId}" (${v10_1.ComponentType[ctx.component.type]})`, {
                level: `ERROR`, system: `Command Handler`
            });
            if (unexpected) {
                console.error(`\n${node_utils_1.LoggerRawFormats.RED}${error.stack}${node_utils_1.LoggerRawFormats.RESET}\n`);
            }
        })
            .load((0, node_path_1.resolve)(__dirname, `../commands`));
        this.gateway.on(`VOICE_STATE_UPDATE`, ({ d }) => {
            if (!d.guild_id)
                return;
            const player = this.lavalink.players.get(d.guild_id);
            if (!player || player.state === lavalink_1.PlayerState.DISCONNECTED)
                return;
            const channelStates = this.cache.voiceStates?.get(d.guild_id)?.filter((voiceState) => voiceState.channel_id === player.voiceChannel && voiceState.user_id !== this.gateway.user?.id);
            if (!player.twentyfourseven && (channelStates?.size ?? 0) === 0) {
                if (!player.voiceTimeout) {
                    player.voiceTimeout = setTimeout(() => {
                        player.destroy(`No active users in the voice channel`);
                    }, Constants_1.Constants.VOICE_TIMEOUT).unref();
                }
            }
            else if (player.voiceTimeout) {
                clearTimeout(player.voiceTimeout);
                player.voiceTimeout = null;
            }
        });
        if (process.env.TOPGG_TOKEN) {
            setInterval(() => {
                this.topggRequest(`POST`, `/bots/$stats`, { body: {
                        server_count: this.cache.guilds?.size,
                        shard_count: this.gateway.shards.size
                    } })
                    .then(() => this.logger.log(`Posted stats to Top.gg`, { system: `Top.gg` }))
                    .catch((error) => {
                    this.logger.log(error.name, {
                        level: `ERROR`, system: `Top.gg`
                    });
                    console.error(`\n${node_utils_1.LoggerRawFormats.RED}${error.stack}${node_utils_1.LoggerRawFormats.RESET}\n`);
                });
            }, Constants_1.Constants.TOPGG_POST_INTERVAL).unref();
        }
        else {
            this.logger.log(`No Top.gg token provided, skipping initialization`, {
                level: `WARN`, system: `Top.gg`
            });
        }
        await this.gateway.connect();
        await this.lavalink.spawnNodes();
        await this.commandHandler.push();
    }
    async topggRequest(method, route, options) {
        if (!process.env.TOPGG_TOKEN)
            throw new Error(`TOPGG_TOKEN is undefined`);
        return (await this.rest.make(method, route, {
            authHeader: process.env.TOPGG_TOKEN,
            customBaseURL: `https://top.gg/api`,
            forceHeaders: true,
            ...options
        })).body;
    }
}
exports.ClientManager = ClientManager;
