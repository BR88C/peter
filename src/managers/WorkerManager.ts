import { bindLavalinkEvents } from '../utils/Lavalink';
import { Config } from '../config/Config';
import { Constants } from '../config/Constants';
import { Middleware } from '../utils/Middleware';
import { Presences } from '../config/Presences';

// Import modules.
import { errorFunction, loadCommands, logError, setRandomPresence } from '@br88c/discord-utils';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { LavalinkManager } from '@discord-rose/lavalink';
import { MongoClient } from 'mongodb';
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
    public available = false
    /**
     * The worker's lavalink manager.
     */
    public lavalink: LavalinkManager
    /**
     * The worker's MongoDB client.
     */
    public mongoClient: MongoClient = new MongoClient(Config.mongo.url)

    /**
     * Create the Worker manager.
     * @constructor
     */
    constructor () {
        super();

        // Create the lavalink manager.
        this.lavalink = new LavalinkManager({
            defaultSource: `youtube`,
            enabledSources: [`youtube`],
            nodeOptions: Config.lavalinkNodes.map((n, i) => Object.assign(n, { password: JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`)[i] })),
            spotifyAuth: {
                clientId: process.env.SPOTIFY_ID ?? ``,
                clientSecret: process.env.SPOTIFY_SECRET ?? ``
            },
            defaultSpotifyRequestOptions: { agent: (_parsedURL) => {
                // @ts-expect-error Argument of type '{ family: number; }' is not assignable to parameter of type 'AgentOptions'.
                if (_parsedURL.protocol === `http:`) return new HttpAgent({ family: 4 });
                // @ts-expect-error Argument of type '{ family: number; }' is not assignable to parameter of type 'AgentOptions'.
                else return new HttpsAgent({ family: 4 });
            } }
        }, this);

        // Set presence, and change it at an interval specified in config.
        setRandomPresence(this, Presences);
        setInterval(() => setRandomPresence(this, Presences), Config.presenceInterval);

        // Set prefix.
        this.commands.prefix(Config.developerPrefix);
        this.log(`Using developer prefix ${Config.developerPrefix}`);

        // Load commands.
        loadCommands(this, resolve(__dirname, `../commands`));

        // Custom command error response.
        this.commands.error((ctx, error) => errorFunction(ctx, error, this, Config.defaultTokenArray, Constants.ERROR_EMBED_COLOR, Constants.SUPPORT_SERVER));

        // Create command middleware.
        this.commands.middleware(async (ctx) => Middleware(ctx));

        // On ready.
        this.on(`READY`, async () => {
            if (!this.available) {
                // Spawn lavalink nodes.
                this.log(`Spawning Lavalink Nodes`);
                const lavalinkStart = Date.now();
                const lavalinkSpawnResult = await this.lavalink.connectNodes();
                this.log(`Spawned ${lavalinkSpawnResult.filter((r) => r.status === `fulfilled`).length} Lavalink Nodes after ${Math.round((Date.now() - lavalinkStart) / 10) / 100}s`);
                if (!this.lavalink.nodes.size) this.log(`\x1b[33mWARNING: Worker has no available lavalink nodes`);

                // Bind lavalink events.
                bindLavalinkEvents(this);

                // Destroy players that aren't 24/7 when no users are in the voice channel.
                this.on(`VOICE_STATE_UPDATE`, async (data) => {
                    const player = data.guild_id ? this.lavalink.players.get(data.guild_id) : undefined;
                    if (!player || player.twentyfourseven) return;
                    const voiceState = this.voiceStates.get(player.options.voiceChannelId);
                    if (voiceState?.users.has(this.user.id) && voiceState.users.size <= Config.maxUncheckedVoiceStateUsers) {
                        let nonBots = 0;
                        for (const [id] of voiceState.users) nonBots += (await this.api.users.get(id)).bot ? 0 : 1;
                        if (nonBots === 0) void player.destroy(`No other users in the voice channel`);
                    }
                });

                // Connect to Mongo DB.
                await this.mongoClient.connect().catch((error) => logError(error));
                this.log(`Connected to MongoDB`);

                // Set worker to available.
                this.available = true;
            }

            // Log worker up.
            this.log(`\x1b[35mWorker up since ${new Date().toLocaleString()}`);
        });
    }
}
