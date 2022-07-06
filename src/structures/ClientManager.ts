import { Lavalink } from './Lavalink';

import { Constants } from '../utils/Constants';
import { tokenFilters } from '../utils/tokenFilters';

import { Logger, LoggerRawFormats, sanitizeTokens } from '@br88c/node-utils';
import { CommandHandler, DiscordColors, Embed } from '@distype/cmd';
import { PlayerState } from '@distype/lavalink';
import { ComponentType } from 'discord-api-types/v10';
import { Client, RestMethod, RestRequestData, RestRoute } from 'distype';
import { resolve } from 'node:path';

/**
 * The client manager.
 */
export class ClientManager extends Client {
    /**
     * Create the client manager.
     */
    constructor () {
        const logger = new Logger({
            enabledOutput: { log: [`DEBUG`, `INFO`, `WARN`, `ERROR`] },
            sanitizeTokens: tokenFilters()
        });

        super(process.env.BOT_TOKEN!, {
            cache: {
                channels: [`permission_overwrites`, `type`],
                guilds: [`owner_id`, `roles`, `unavailable`],
                members: [`communication_disabled_until`, `roles`],
                roles: [`permissions`],
                voiceStates: [`channel_id`]
            },
            gateway: { intents: [`GUILDS`, `GUILD_VOICE_STATES`] }
        }, logger.log, logger);

        this.commandHandler = new CommandHandler(this, logger.log, logger);

        this.lavalink = new Lavalink(this, {
            clientName: `peter@${process.env.npm_package_version ?? `0.0.0`}`,
            nodeOptions: [
                {
                    location: {
                        host: process.env.LAVALINK_HOST!,
                        port: parseInt(process.env.LAVALINK_PORT!),
                        secure: process.env.LAVALINK_SECURE! === `true`
                    },
                    password: process.env.LAVALINK_PASSWORD!
                }
            ]
        }, logger.log, logger);

        this.logger = logger;
    }

    /**
     * Initializes the client manager.
     */
    public override async init (): Promise<void> {
        await this.commandHandler
            .setError(async (ctx, error, unexpected) => {
                const errorId = `${Math.round(Math.random() * 1e6).toString(36).padStart(5, `0`)}${Date.now().toString(36)}`.toUpperCase();

                this.logger.log(`${unexpected ? `Unexpected ` : ``}${error.name} (ID: ${errorId}) when running interaction ${ctx.interaction.id}: ${error.message}`, {
                    level: `ERROR`, system: `Command Handler`
                });

                if (unexpected) {
                    console.error(`\n${LoggerRawFormats.RED}${error.stack}${LoggerRawFormats.RESET}\n`);
                }

                const tokenFilter = tokenFilters({
                    token: ctx.interaction.token,
                    replacement: `%interaction_token%`
                });

                await ctx.sendEphemeral(
                    new Embed()
                        .setColor(DiscordColors.BRANDING_RED)
                        .setTitle(`Error`)
                        .setDescription(`\`\`\`\n${sanitizeTokens(error.message, tokenFilter)}\n\`\`\`\n*Support Server: ${process.env.SUPPORT_SERVER ?? `\`Support Server Unavailable\``}*`)
                        .setFooter(`Error ID: ${errorId}`)
                        .setTimestamp()
                );
            })
            .setExpireError((ctx, error, unexpected) => {
                this.logger.log(`${unexpected ? `Unexpected ` : ``}${error.name} when running expire callback for component "${ctx.component.customId}" (${ComponentType[ctx.component.type]})`, {
                    level: `ERROR`, system: `Command Handler`
                });

                if (unexpected) {
                    console.error(`\n${LoggerRawFormats.RED}${error.stack}${LoggerRawFormats.RESET}\n`);
                }
            })
            .load(resolve(__dirname, `../commands`));

        this.gateway.on(`VOICE_STATE_UPDATE`, ({ d }) => {
            if (!d.guild_id) return;

            const player = this.lavalink.players.get(d.guild_id);
            if (!player || player.state === PlayerState.DISCONNECTED) return;

            const channelStates = this.cache.voiceStates?.get(d.guild_id)?.filter((voiceState) => voiceState.channel_id === player.voiceChannel && voiceState.user_id !== this.gateway.user?.id);

            if (!player.twentyfourseven && (channelStates?.size ?? 0) === 0) {
                if (!player.voiceTimeout) {
                    player.voiceTimeout = setTimeout(() => {
                        player.destroy(`No active users in the voice channel`);
                    }, Constants.VOICE_TIMEOUT).unref();
                }
            } else if (player.voiceTimeout) {
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
                        console.error(`\n${LoggerRawFormats.RED}${error.stack}${LoggerRawFormats.RESET}\n`);
                    });
            }, Constants.TOPGG_POST_INTERVAL).unref();
        } else {
            this.logger.log(`No Top.gg token provided, skipping initialization`, {
                level: `WARN`, system: `Top.gg`
            });
        }

        await this.gateway.connect();

        await this.lavalink.spawnNodes();
        await this.commandHandler.push();
    }

    /**
     * Makes a Top.gg API request,
     * @param method The request's method.
     * @param route The requests's route, relative to the base Top.gg API URL.
     * @param options Request options.
     * @returns The response body.
     */
    public override async topggRequest (method: RestMethod, route: RestRoute, options?: RestRequestData): Promise<any> {
        if (!process.env.TOPGG_TOKEN) throw new Error(`TOPGG_TOKEN is undefined`);

        return (await this.rest.make(method, route, {
            authHeader: process.env.TOPGG_TOKEN,
            customBaseURL: `https://top.gg/api`,
            forceHeaders: true,
            ...options
        })).body;
    }
}
