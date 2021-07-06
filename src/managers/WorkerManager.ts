import { Config } from '../config/Config';
import { Constants } from '../config/Constants';
import { LavalinkManager } from './LavalinkManager';
import { setRandomPresence } from '../utils/ProcessUtils';

// Import modules.
import { parse } from 'yaml';
import { readdirSync, readFileSync, statSync } from 'fs';
import { resolve } from 'path';
import { Worker } from 'discord-rose';

/**
 * The Worker manager class.
 * @class
 * @extends Worker
 */
export class WorkerManager extends Worker {
    lavalink: LavalinkManager

    /**
     * Create the Worker manager.
     * @constructor
     */
    constructor () {
        super();

        // Get Lavalink config.
        const lavalinkConfig = parse(readFileSync(`./lavalink/application.yml`, `utf8`));

        // Create the Lavalink manager.
        this.lavalink = new LavalinkManager([
            {
                host: (lavalinkConfig.server?.address === `0.0.0.0` ? `localhost` : lavalinkConfig.server?.address) ?? `localhost`,
                port: lavalinkConfig.server?.port ?? 2333,
                password: lavalinkConfig.lavalink?.server?.password ?? `youshallnotpass`
            }
        ], this);

        // Set presence, and change it at an interval specified in config.
        setRandomPresence(this);
        setInterval(() => setRandomPresence(this), Config.presenceInterval);

        // Set prefix.
        this.commands.prefix(Config.developerPrefix);
        this.log(`Using developer prefix ${Config.developerPrefix}`);

        // Push all commands to the worker.
        for (const dir of readdirSync(`./src/commands`).filter((file) => statSync(`${`./src/commands` + `/`}${file}`).isDirectory())) {
            this.commands.load(resolve(__dirname, `../commands/${dir}`));
        }
        this.log(`Loaded ${this.commands.commands?.size} commands`);

        // Custom command error response.
        this.commands.error((ctx, error) => {
            if (ctx.isInteraction) this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${error.message.replace(`Error: `, ``)} | Command: ${ctx.ran} | User: ${ctx.interaction?.member.user.username}#${ctx.interaction?.member.user.discriminator}${ctx.interaction?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.interaction?.guild_id)?.name} | Guild ID: ${ctx.interaction?.guild_id}` : ``}`);
            else this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${error.message.replace(`Error: `, ``)} | Command: ${ctx.command?.command} | User: ${ctx.message?.author.username}#${ctx.message?.author.discriminator}${ctx.message?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message?.guild_id)?.name} | Guild ID: ${ctx.message?.guild_id}` : ``}`);

            if (!error.nonFatal) {
                console.log(`\x1b[31m`);
                console.error(error);
                console.log(`\x1b[37m`);
            }

            ctx.embed
                .color(Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\n${error.message.replace(`Error: `, ``)}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                .send()
                .catch((error) => this.log(`\x1b[31mUnable to send Error Embed${typeof error === `string` ? ` | Reason: ${error}` : (typeof error?.message === `string` ? ` | Reason: ${error.message}` : ``)}`));
        });

        // Create command middleware.
        this.commands.middleware((ctx) => {
            if (!ctx.isInteraction) { // If the received event is not an interaction.
                if (!Config.devs.IDs.includes(ctx.message.author.id)) { // If the user is not a dev, return an error.
                    this.log(`\x1b[33mReceived Depreciated Prefix Command | User: ${ctx.message.author.username}#${ctx.message.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                    void ctx.error(`Prefix commands are now depreciated, please use slash commands instead.`);
                    return false;
                } else { // If the user is a dev.
                    if (ctx.command.interaction != null) { // If the command is a slash command, return.
                        this.log(`\x1b[33mReceived Depreciated Prefix Command | User: ${ctx.message.author.username}#${ctx.message.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                        void ctx.error(`That's an interaction command, not a developer command silly!`);
                        return false;
                    } else { // If the command is not a slash command, execute it.
                        this.log(`\x1b[32mReceived Dev Command | Command: ${ctx.command.command} | User: ${ctx.message.author.username}#${ctx.message.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                        return true;
                    }
                }
            } else { // If the received event is an interaction.
                this.log(`\x1b[32mReceived Interaction | Command: ${ctx.ran} | User: ${ctx.interaction.member.user.username}#${ctx.interaction.member.user.discriminator}${ctx.interaction.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.interaction.guild_id)?.name} | Guild ID: ${ctx.interaction.guild_id}` : ``}`);
                return true;
            }
        });

        // On ready.
        this.on(`READY`, () => {
            this.lavalink.init(this.user.id);
        });

        // Forward voice events to Lavalink.
        this.on(`VOICE_SERVER_UPDATE`, (data) => this.lavalink.updateVoiceState(data as any));
        this.on(`VOICE_STATE_UPDATE`, (data) => this.lavalink.updateVoiceState(data as any));
    }
}
