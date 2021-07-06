"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LavalinkManager = void 0;
const StringUtils_1 = require("../utils/StringUtils");
const Constants_1 = require("../config/Constants");
const discord_rose_1 = require("discord-rose");
const erela_js_1 = require("erela.js");
class LavalinkManager extends erela_js_1.Manager {
    constructor(nodes, worker) {
        super({
            nodes: nodes,
            send: (id, payload) => {
                this.guildShard(id).ws._send(payload);
            }
        });
        this.worker = worker;
        this
            .on(`nodeConnect`, (node) => this.worker.log(`\x1b[32mLavalink Node Connected | Node ID: ${node.options.identifier}`))
            .on(`nodeError`, (node, error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: ${error.message} | Node ID: ${node.options.identifier}`))
            .on(`playerCreate`, (player) => this.worker.log(`Created new Player | Node ID: ${player.node.options.identifier} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`))
            .on(`trackStart`, (player, track) => {
            this.worker.log(`\x1b[32mStarted Track | Track identifier: ${track.identifier} | Node ID: ${player.node.options.identifier} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`);
            const trackStartEmbed = new discord_rose_1.Embed()
                .color(Constants_1.Constants.STARTED_PLAYING_EMBED_COLOR)
                .title(`Started playing: ${StringUtils_1.cleanseMarkdown(track.title)}`)
                .description(`**Link:** ${track.identifier}`)
                .image(`${track.displayThumbnail(`maxresdefault`)}`)
                .footer(`Requested by ${track.requester}`)
                .timestamp();
            this.worker.api.messages.send(player.textChannel, trackStartEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send track start embed => ${error.message} | Node ID: ${player.node.options.identifier} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`));
        })
            .on(`trackError`, (player, track) => {
            this.worker.log(`\x1b[31mLavalink Node Error | Error: Track error => Track identifier: ${track.identifier} | Node ID: ${player.node.options.identifier} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`);
            const trackErrorEmbed = new discord_rose_1.Embed()
                .color(Constants_1.Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\nAn unknown track error occured.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants_1.Constants.SUPPORT_SERVER}`);
            this.worker.api.messages.send(player.textChannel, trackErrorEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send track error embed => ${error.message} | Node ID: ${player.node.options.identifier} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`));
        });
        this.worker.on(`VOICE_SERVER_UPDATE`, (data) => this.updateVoiceState(data));
        this.worker.on(`VOICE_STATE_UPDATE`, (data) => this.updateVoiceState(data));
    }
}
exports.LavalinkManager = LavalinkManager;
