import { bindLavalinkEvents } from '../utils/Lavalink';
import { Config } from '../config/Config';
import { Constants } from '../config/Constants';
import { removeToken } from '../utils/StringUtils';
import { setRandomPresence } from '../utils/ProcessUtils';

// Import modules.
import { LavalinkManager } from '@discord-rose/lavalink';
import { readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import { Worker } from 'discord-rose';

/**
 * The Worker manager class.
 * @class
 * @extends Worker
 */
export class WorkerManager extends Worker {
    /**
     * If the worker is available.
     */
    public available: boolean = false
    /**
     * The worker's lavalink manager.
     */
    public lavalink: LavalinkManager

    /**
     * Create the Worker manager.
     * @constructor
     */
    constructor () {
        super();

        this.lavalink = new LavalinkManager({
            defaultSource: `youtube`,
            enabledSources: [`youtube`],
            nodeOptions: Config.lavalinkNodes.map((n, i) => Object.assign(n, { password: JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`)[i] })),
            spotifyAuth: {
                clientId: process.env.SPOTIFY_ID ?? ``,
                clientSecret: process.env.SPOTIFY_SECRET ?? ``
            }
        }, this);

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
            if (ctx.isInteraction) this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${removeToken(error.message.replace(/^(Error: )/, ``))} | Command: ${ctx.ran} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.interaction?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.interaction?.guild_id)?.name} | Guild ID: ${ctx.interaction?.guild_id}` : ``}`);
            else this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${removeToken(error.message.replace(/^(Error: )/, ``))} | Command: ${ctx.command?.command} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message?.guild_id)?.name} | Guild ID: ${ctx.message?.guild_id}` : ``}`);

            if (!error.nonFatal) {
                console.log(`\x1b[31m`);
                console.error(error);
                console.log(`\x1b[37m`);
            }

            ctx.embed
                .color(Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\n${removeToken(error.message.replace(/^(Error: )/, ``))}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                .timestamp()
                .send(true, false, true)
                .catch((error) => this.log(`\x1b[31mUnable to send Error Embed${typeof error === `string` ? ` | Reason: ${error}` : (typeof error?.message === `string` ? ` | Reason: ${error.message}` : ``)}`));
        });

        // Create command middleware.
        this.commands.middleware((ctx) => {
            if (!this.available) { // If the worker is not available.
                void ctx.error(`The bot is still starting; please wait!`);
                return false;
            }
            if (!ctx.isInteraction) { // If the received event is not an interaction.
                if (!Config.devs.IDs.includes(ctx.author.id)) { // If the user is not a dev, return an error.
                    void ctx.error(`Prefix commands are now depreciated, please use slash commands instead. For more information, join our support server!`);
                    return false;
                } else { // If the user is a dev.
                    if (ctx.command.interaction != null) { // If the command is a slash command, return.
                        void ctx.error(`That's an interaction command, not a developer command silly!`);
                        return false;
                    } else { // If the command is not a slash command, execute it.
                        this.log(`\x1b[32mReceived Dev Command | Command: ${ctx.command.command} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                        return true;
                    }
                }
            } else { // If the received event is an interaction.
                if (!ctx.interaction.guild_id) { // If the interaction is not in a guild.
                    void ctx.error(`This command can only be ran in a server!`);
                    return false;
                } else {
                    this.log(`Received Interaction | Command: ${ctx.ran} | User: ${ctx.author.username}#${ctx.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.interaction.guild_id)?.name} | Guild ID: ${ctx.interaction.guild_id}`);
                    return true;
                }
            }
        });

        // On ready.
        this.on(`READY`, async () => {
            // Spawn lavalink nodes.
            this.log(`Spawning Lavalink Nodes`);
            const lavalinkStart = Date.now();
            const lavalinkSpawnResult = await this.lavalink.connectNodes();
            this.log(`Spawned ${lavalinkSpawnResult.filter((r) => r.status === `fulfilled`).length} Lavalink Nodes after ${Math.round((Date.now() - lavalinkStart) / 10) / 100}s`);
            if (!this.lavalink.nodes.size) this.log(`\x1b[33mWARNING: Worker has no available lavalink nodes`);

            // Bind lavalink events.
            bindLavalinkEvents(this);

            // Log worker available and set WorkerManage#available to true.
            this.log(`\x1b[35mWorker up since ${new Date().toLocaleString()}`);
            this.available = true;
        });
    }
}
