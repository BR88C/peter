"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerManager = void 0;
const Lavalink_1 = require("../utils/Lavalink");
const Config_1 = require("../config/Config");
const Constants_1 = require("../config/Constants");
const StringUtils_1 = require("../utils/StringUtils");
const ProcessUtils_1 = require("../utils/ProcessUtils");
const lavalink_1 = require("@discord-rose/lavalink");
const fs_1 = require("fs");
const path_1 = require("path");
const discord_rose_1 = require("discord-rose");
class WorkerManager extends discord_rose_1.Worker {
    constructor() {
        super();
        this.available = false;
        this.lavalink = new lavalink_1.LavalinkManager({
            defaultSource: `youtube`,
            enabledSources: [`youtube`],
            nodeOptions: Config_1.Config.lavalinkNodes.map((n, i) => Object.assign(n, { password: JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`)[i] })),
            spotifyAuth: {
                clientId: process.env.SPOTIFY_ID ?? ``,
                clientSecret: process.env.SPOTIFY_SECRET ?? ``
            }
        }, this);
        ProcessUtils_1.setRandomPresence(this);
        setInterval(() => ProcessUtils_1.setRandomPresence(this), Config_1.Config.presenceInterval);
        this.commands.prefix(Config_1.Config.developerPrefix);
        this.log(`Using developer prefix ${Config_1.Config.developerPrefix}`);
        for (const dir of fs_1.readdirSync(`./dist/commands`).filter((file) => fs_1.statSync(`./dist/commands/${file}`).isDirectory())) {
            this.commands.load(path_1.resolve(__dirname, `../commands/${dir}`));
            const commands = fs_1.readdirSync(`./dist/commands/${dir}`).filter((file) => fs_1.statSync(`./dist/commands/${dir}/${file}`).isFile()).map((file) => file.replace(`.js`, ``));
            for (const command of commands) {
                if (this.commands.commands?.get(command))
                    this.commands.commands.get(command).category = dir;
            }
        }
        this.log(`Loaded ${this.commands.commands?.size} commands`);
        this.commands.error((ctx, error) => {
            if (ctx.isInteraction)
                this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${StringUtils_1.removeToken(error.message.replace(/^(Error: )/, ``))} | Command: ${ctx.ran} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.interaction?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.interaction?.guild_id)?.name} | Guild ID: ${ctx.interaction?.guild_id}` : ``}`);
            else
                this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${StringUtils_1.removeToken(error.message.replace(/^(Error: )/, ``))} | Command: ${ctx.command?.command} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message?.guild_id)?.name} | Guild ID: ${ctx.message?.guild_id}` : ``}`);
            if (!error.nonFatal) {
                console.log(`\x1b[31m`);
                console.error(error);
                console.log(`\x1b[37m`);
            }
            ctx.embed
                .color(Constants_1.Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\n${StringUtils_1.removeToken(error.message.replace(/^(Error: )/, ``))}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants_1.Constants.SUPPORT_SERVER}`)
                .timestamp()
                .send(true, false, true)
                .catch((error) => this.log(`\x1b[31mUnable to send Error Embed${typeof error === `string` ? ` | Reason: ${error}` : (typeof error?.message === `string` ? ` | Reason: ${error.message}` : ``)}`));
        });
        this.commands.middleware((ctx) => {
            if (!this.available) {
                void ctx.error(`The bot is still starting; please wait!`);
                return false;
            }
            if (!ctx.isInteraction) {
                if (!Config_1.Config.devs.IDs.includes(ctx.author.id)) {
                    void ctx.error(`Prefix commands are now depreciated, please use slash commands instead. For more information, join our support server!`);
                    return false;
                }
                else {
                    if (ctx.command.interaction != null) {
                        void ctx.error(`That's an interaction command, not a developer command silly!`);
                        return false;
                    }
                    else {
                        this.log(`\x1b[32mReceived Dev Command | Command: ${ctx.command.command} | User: ${ctx.author.username}#${ctx.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                        return true;
                    }
                }
            }
            else {
                if (!ctx.interaction.guild_id) {
                    void ctx.error(`This command can only be ran in a server!`);
                    return false;
                }
                else {
                    this.log(`Received Interaction | Command: ${ctx.ran} | User: ${ctx.author.username}#${ctx.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.interaction.guild_id)?.name} | Guild ID: ${ctx.interaction.guild_id}`);
                    return true;
                }
            }
        });
        this.on(`READY`, async () => {
            this.log(`Spawning Lavalink Nodes`);
            const lavalinkStart = Date.now();
            const lavalinkSpawnResult = await this.lavalink.connectNodes();
            this.log(`Spawned ${lavalinkSpawnResult.filter((r) => r.status === `fulfilled`).length} Lavalink Nodes after ${Math.round((Date.now() - lavalinkStart) / 10) / 100}s`);
            if (!this.lavalink.nodes.size)
                this.log(`\x1b[33mWARNING: Worker has no available lavalink nodes`);
            Lavalink_1.bindLavalinkEvents(this);
            this.on(`VOICE_STATE_UPDATE`, async (data) => {
                const player = data.guild_id ? this.lavalink.players.get(data.guild_id) : undefined;
                if (!player || player.twentyfourseven)
                    return;
                const voiceState = this.voiceStates.get(player.options.voiceChannelId);
                if (voiceState?.users.has(this.user.id) && voiceState.users.size <= Config_1.Config.maxUncheckedVoiceStateUsers) {
                    let nonBots = 0;
                    for (const [id] of voiceState.users)
                        nonBots += (await this.api.users.get(id)).bot ? 0 : 1;
                    if (nonBots === 0)
                        void player.destroy(`No other users in the VC`);
                }
            });
            this.log(`\x1b[35mWorker up since ${new Date().toLocaleString()}`);
            this.available = true;
        });
    }
}
exports.WorkerManager = WorkerManager;
