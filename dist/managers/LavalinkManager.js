"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedPlayer = exports.LavalinkManager = void 0;
const StringUtils_1 = require("../utils/StringUtils");
const Constants_1 = require("../config/Constants");
const discord_rose_1 = require("discord-rose");
const erela_js_1 = require("erela.js");
const erela_js_spotify_1 = __importDefault(require("erela.js-spotify"));
erela_js_1.Structure.extend(`Player`, (player) => class Player extends player {
    get formattedEffects() {
        let str = [];
        if (this.effects.bassboost)
            str.push(`Bassboost = +${this.effects.bassboost}`);
        if (this.effects.pitch)
            str.push(`Pitch = ${this.effects.pitch}﹪`);
        if (this.effects.rotation)
            str.push(`Rotation = ${this.effects.rotation} Hz`);
        if (this.effects.speed)
            str.push(`Speed = ${this.effects.speed}﹪`);
        if (this.effects.treble)
            str.push(`Treble = +${this.effects.treble}`);
        if (this.effects.tremolo)
            str.push(`Tremolo = ${this.effects.tremolo}﹪`);
        if (this.effects.vibrato)
            str.push(`Vibrato = ${this.effects.vibrato}﹪`);
        if (this.volume !== 10)
            str.push(`Volume = ${this.volume * 10}﹪`);
        return str.length ? `\`\`\`prolog\n${str.join(`, `)}\n\`\`\`` : `\`\`\`diff\n-= No active effects =-\n\`\`\``;
    }
});
class LavalinkManager extends erela_js_1.Manager {
    constructor(nodes, worker) {
        super({
            nodes: nodes,
            send: (id, payload) => {
                this.worker.guildShard(id).ws._send(payload);
            },
            plugins: [
                new erela_js_spotify_1.default({
                    clientID: process.env.SPOTIFY_ID ?? ``,
                    clientSecret: process.env.SPOTIFY_SECRET ?? ``
                })
            ]
        });
        this.worker = worker;
        this
            .on(`nodeConnect`, (node) => this.worker.log(`\x1b[32mLavalink Node Connected | Node: ${node.options.host}:${node.options.port}`))
            .on(`nodeCreate`, (node) => this.worker.log(`\x1b[32mLavalink Node Created | Node: ${node.options.host}:${node.options.port}`))
            .on(`nodeDestroy`, (node) => this.worker.log(`\x1b[31mLavalink Node Destroyed | Node: ${node.options.host}:${node.options.port}`))
            .on(`nodeDisconnect`, (node) => this.worker.log(`\x1b[31mLavalink Node Disconnected | Node: ${node.options.host}:${node.options.port}`))
            .on(`nodeError`, (node, error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: ${error.message} | Node: ${node.options.host}:${node.options.port}`))
            .on(`nodeReconnect`, (node) => this.worker.log(`\x1b[33mLavalink Node Reconnected | Node: ${node.options.host}:${node.options.port}`))
            .on(`playerCreate`, (player) => this.worker.log(`\x1b[32mLavalink Player Created | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`))
            .on(`playerDestroy`, (player) => this.worker.log(`\x1b[31mLavalink Player Destroyed | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`))
            .on(`playerMove`, (player, initChannel, newChannel) => {
            this.worker.log(`\x1b[33mBot Manually Moved => Destroying Player | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`);
            const playerMoveErrorEmbed = new discord_rose_1.Embed()
                .color(Constants_1.Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\nDestroyed the queue due to being moved out of the VC.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants_1.Constants.SUPPORT_SERVER}`);
            this.worker.api.messages.send(player.textChannel, playerMoveErrorEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send player move error embed => ${error.message} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`));
            player.destroy();
        })
            .on(`trackEnd`, (player, track, payload) => this.worker.log(`\x1b[33mTrack ended | Reason: ${payload.reason} | Track identifier: ${track.identifier} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`))
            .on(`trackError`, (player, track) => {
            this.worker.log(`\x1b[31mLavalink Node Error | Error: Track error => Track identifier: ${track.identifier} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`);
            const trackErrorEmbed = new discord_rose_1.Embed()
                .color(Constants_1.Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\nAn unknown track error occured.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants_1.Constants.SUPPORT_SERVER}`);
            this.worker.api.messages.send(player.textChannel, trackErrorEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send track error embed => ${error.message} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`));
        })
            .on(`trackStart`, (player, track) => {
            this.worker.log(`\x1b[32mStarted Track | Track identifier: ${track.identifier} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`);
            const trackStartEmbed = new discord_rose_1.Embed()
                .color(Constants_1.Constants.STARTED_PLAYING_EMBED_COLOR)
                .title(`Started playing: ${StringUtils_1.cleanseMarkdown(track.title)}`)
                .description(`**Link:** ${track.uri}`)
                .image(`${track.displayThumbnail(`mqdefault`)}`)
                .footer(`Requested by ${track.requester}`)
                .timestamp();
            this.worker.api.messages.send(player.textChannel, trackStartEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send track start embed => ${error.message} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`));
        })
            .on(`trackStuck`, (player, track, payload) => {
            this.worker.log(`\x1b[31mLavalink Node Error | Error: Track stuck => Track identifier: ${track.identifier} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`);
            const trackStuckEmbed = new discord_rose_1.Embed()
                .color(Constants_1.Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\nCurrent track stuck. Skipping to next track.\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants_1.Constants.SUPPORT_SERVER}`);
            this.worker.api.messages.send(player.textChannel, trackStuckEmbed).catch((error) => this.worker.log(`\x1b[31mLavalink Node Error | Error: Unable to send track stuck embed => ${error.message} | Node: ${player.node.options.host}:${player.node.options.port} | Guild Name: ${this.worker.guilds.get(player.guild)?.name} | Guild ID: ${player.guild}`));
            player.stop();
        });
        this.worker.on(`*`, (data) => this.updateVoiceState(data));
    }
}
exports.LavalinkManager = LavalinkManager;
class ExtendedPlayer extends erela_js_1.Player {
}
exports.ExtendedPlayer = ExtendedPlayer;
