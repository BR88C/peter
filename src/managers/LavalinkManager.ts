import { cleanseMarkdown } from '../utils/StringUtils';
import { Constants } from '../config/Constants';

// Import modules.
import { Embed, Worker } from 'discord-rose';
import { Manager, NodeOptions } from 'erela.js';

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
                // @ts-expect-error ws is a private property
                this.guildShard(id as any).ws._send(payload);
            }
        });

        // Set worker.
        this.worker = worker;

        // Initiate Lavalink listeners
        this
            .on(`nodeConnect`, (node) => this.worker.log(`\x1b[32mLavalink Node Connected | Node ID: ${node.options.identifier}`))
            .on(`nodeError`, (node, error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: ${error.message} | Node ID: ${node.options.identifier}`))
            .on(`playerCreate`, (player) => this.worker.log(`Created new Player | Node ID: ${player.node.options.identifier} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`))
            .on(`trackStart`, (player, track) => {
                this.worker.log(`\x1b[32mStarted Track | Track identifier: ${track.identifier} | Node ID: ${player.node.options.identifier} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`)
                const trackStartEmbed = new Embed()
                    .color(Constants.STARTED_PLAYING_EMBED_COLOR)
                    .title(`Started playing: ${cleanseMarkdown(track.title)}`)
                    .description(`**Link:** ${track.identifier}`)
                    .image(`${track.displayThumbnail(`maxresdefault`)}`)
                    .footer(`Requested by ${track.requester}`)
                    .timestamp()
                this.worker.api.messages.send(player.textChannel as any, trackStartEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send track start embed => ${error.message} | Node ID: ${player.node.options.identifier} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`));
            })
            .on(`trackError`, (player, track) => {
                this.worker.log(`\x1b[31mLavalink Node Error | Error: Track error => Track identifier: ${track.identifier} | Node ID: ${player.node.options.identifier} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`);
                const trackErrorEmbed = new Embed()
                    .color(Constants.ERROR_EMBED_COLOR)
                    .title(`Error`)
                    .description(`\`\`\`\nAn unknown track error occured.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
                this.worker.api.messages.send(player.textChannel as any, trackErrorEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send track error embed => ${error.message} | Node ID: ${player.node.options.identifier} | Guild Name: ${this.worker.guilds.get(player.guild as any)?.name} | Guild ID: ${player.guild}`));
            })
    }
}
