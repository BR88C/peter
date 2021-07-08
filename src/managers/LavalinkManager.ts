import { cleanseMarkdown } from '../utils/StringUtils';
import { Constants } from '../config/Constants';

// Import modules.
import { Embed, Worker } from 'discord-rose';
import { Manager, NodeOptions, Player, Structure } from 'erela.js';
import Spotify from 'erela.js-spotify';

Structure.extend(`Player`, (player) => class Player extends player {
    /**
     * The Player's SFX.
     */
    public effects: { [key: string]: any }
    /**
     * A pretty string that lists the current SFX.
     */
    public get formattedEffects (): string {
        let str: string[] | string = [];
        if (this.effects.bassboost) str.push(`Bassboost = +${this.effects.bassboost}`);
        if (this.effects.pitch) str.push(`Pitch = ${this.effects.pitch}﹪`);
        if (this.effects.rotation) str.push(`Rotation = ${this.effects.rotation} Hz`);
        if (this.effects.speed) str.push(`Speed = ${this.effects.speed}﹪`);
        if (this.effects.treble) str.push(`Treble = +${this.effects.treble}`);
        if (this.effects.tremolo) str.push(`Tremolo = ${this.effects.tremolo}﹪`);
        if (this.effects.vibrato) str.push(`Vibrato = ${this.effects.vibrato}﹪`);
        if (this.volume !== 10) str.push(`Volume = ${this.volume * 10}﹪`)
        return str.length ? `\`\`\`prolog\n${str.join(`, `)}\n\`\`\`` : `\`\`\`diff\n-= No active effects =-\n\`\`\``;
    }
});

/**
 * The Lavalink manager class.
 * @class
 * @extends Manager
 */
export class LavalinkManager extends Manager {
    /**
     * The worker that the Lavalink manager is bound to.
     */
    public worker: Worker

    /**
     * Create the Lavalink manager class.
     * @param nodes Lavalink Node options.
     * @param worker The Worker to bind the Lavalink manager to.
     * @constructor
     */
    constructor (nodes: NodeOptions[], worker: Worker) {
        super({
            nodes: nodes,
            send: (id, payload) => {
                // @ts-expect-error Property 'ws' is private and only accessible within class 'Shard'.
                this.worker.guildShard(id as any).ws._send(payload);
            },
            plugins: [
                new Spotify({
                    clientID: process.env.SPOTIFY_ID ?? ``,
                    clientSecret: process.env.SPOTIFY_SECRET ?? ``
                })
            ]
        });

        // Set worker.
        this.worker = worker;

        // Initiate Lavalink listeners
        this
            .on(`nodeConnect`, (node) => this.worker.log(`\x1b[32mLavalink Node Connected | Node: ${node.options.host}:${node.options.port}`))
            .on(`nodeCreate`, (node) => this.worker.log(`\x1b[32mLavalink Node Created | Node: ${node.options.host}:${node.options.port}`))
            .on(`nodeDestroy`, (node) => this.worker.log(`\x1b[31mLavalink Node Destroyed | Node: ${node.options.host}:${node.options.port}`))
            .on(`nodeDisconnect`, (node) => this.worker.log(`\x1b[31mLavalink Node Disconnected | Node: ${node.options.host}:${node.options.port}`))
            .on(`nodeError`, (node, error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: ${error.message} | Node: ${node.options.host}:${node.options.port}`))
            .on(`nodeReconnect`, (node) => this.worker.log(`\x1b[33mLavalink Node Reconnected | Node: ${node.options.host}:${node.options.port}`))
            .on(`playerCreate`, (player) => this.worker.log(`\x1b[32mLavalink Player Created | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`))
            .on(`playerDestroy`, (player) => this.worker.log(`\x1b[31mLavalink Player Destroyed | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`))
            .on(`playerMove`, (player, initChannel, newChannel) => {
                this.worker.log(`\x1b[33mBot Manually Moved => Destroying Player | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`);
                const playerMoveErrorEmbed = new Embed()
                    .color(Constants.ERROR_EMBED_COLOR)
                    .title(`Error`)
                    .description(`\`\`\`\nDestroyed the queue due to being moved out of the VC.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`);
                this.worker.api.messages.send(player.textChannel as any, playerMoveErrorEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send player move error embed => ${error.message} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`));
                player.destroy();
            })
            .on(`trackEnd`, (player, track, payload) => this.worker.log(`\x1b[33mTrack ended | Reason: ${payload.reason} | Track identifier: ${track.identifier} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`))
            .on(`trackError`, (player, track) => {
                this.worker.log(`\x1b[31mLavalink Node Error | Error: Track error => Track identifier: ${track.identifier} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`);
                const trackErrorEmbed = new Embed()
                    .color(Constants.ERROR_EMBED_COLOR)
                    .title(`Error`)
                    .description(`\`\`\`\nAn unknown track error occured.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`);
                this.worker.api.messages.send(player.textChannel as any, trackErrorEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send track error embed => ${error.message} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`));
            })
            .on(`trackStart`, (player, track) => {
                this.worker.log(`\x1b[32mStarted Track | Track identifier: ${track.identifier} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`);
                const trackStartEmbed = new Embed()
                    .color(Constants.STARTED_PLAYING_EMBED_COLOR)
                    .title(`Started playing: ${cleanseMarkdown(track.title)}`)
                    .description(`**Link:** ${track.uri}`)
                    .image(`${track.displayThumbnail(`mqdefault`)}`)
                    .footer(`Requested by ${track.requester}`)
                    .timestamp();
                this.worker.api.messages.send(player.textChannel as any, trackStartEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send track start embed => ${error.message} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`));
            })
            .on(`trackStuck`, (player, track, payload) => {
                this.worker.log(`\x1b[31mLavalink Node Error | Error: Track stuck => Track identifier: ${track.identifier} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`);
                const trackStuckEmbed = new Embed()
                    .color(Constants.ERROR_EMBED_COLOR)
                    .title(`Error`)
                    .description(`\`\`\`\nCurrent track stuck. Skipping to next track.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`);
                this.worker.api.messages.send(player.textChannel as any, trackStuckEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send track stuck embed => ${error.message} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`));
                player.stop();
            });

        // Forward voice events from the Worker to Lavalink.
        this.worker.on(`*`, (data) => this.updateVoiceState(data as any));
    }
}

/**
 * The extended Player class; used for saving effects.
 * @class
 * @extends Player
 */
export class ExtendedPlayer extends Player {
    /**
     * The Player's SFX.
     */
    public effects: { [key: string]: any }
    /**
     * A pretty string that lists the current SFX.
     */
    public formattedEffects: string
}
