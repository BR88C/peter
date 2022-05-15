import { Lavalink } from './Lavalink';

import { tokenFilters } from '../utils/tokenFilters';

import { Logger, LoggerRawFormats, sanitizeTokens } from '@br88c/node-utils';
import { CommandHandler, DiscordColors, Embed } from '@distype/cmd';
import { ComponentType } from 'discord-api-types/v10';
import { Client } from 'distype';
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
                guilds: [`owner_id`, `roles`],
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
                        .setDescription(`\`\`\`\n${sanitizeTokens(error.message, tokenFilter)}\n\`\`\``)
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

        await this.gateway.connect();

        await this.lavalink.spawnNodes();
        await this.commandHandler.push();
    }
}
