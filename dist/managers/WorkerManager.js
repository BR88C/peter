"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerManager = void 0;
const Config_1 = require("../config/Config");
const Constants_1 = require("../config/Constants");
const LavalinkManager_1 = require("./LavalinkManager");
const StringUtils_1 = require("../utils/StringUtils");
const ProcessUtils_1 = require("../utils/ProcessUtils");
const fs_1 = require("fs");
const path_1 = require("path");
const discord_rose_1 = require("discord-rose");
class WorkerManager extends discord_rose_1.Worker {
    constructor() {
        super();
        this.lavalink = new LavalinkManager_1.LavalinkManager(Config_1.Config.lavalinkNodes.map((n, i) => Object.assign(n, JSON.parse(process.env.LAVALINK_PASSWORD ?? `[]`)[i])), this);
        ProcessUtils_1.setRandomPresence(this);
        setInterval(() => ProcessUtils_1.setRandomPresence(this), Config_1.Config.presenceInterval);
        this.commands.prefix(Config_1.Config.developerPrefix);
        this.log(`Using developer prefix ${Config_1.Config.developerPrefix}`);
        for (const dir of fs_1.readdirSync(`./src/commands`).filter((file) => fs_1.statSync(`${`./src/commands` + `/`}${file}`).isDirectory())) {
            this.commands.load(path_1.resolve(__dirname, `../commands/${dir}`));
        }
        this.log(`Loaded ${this.commands.commands?.size} commands`);
        this.commands.error((ctx, error) => {
            if (ctx.isInteraction)
                this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${StringUtils_1.removeToken(error.message.replace(/^(Error: )/, ``))} | Command: ${ctx.ran} | User: ${ctx.interaction?.member.user.username}#${ctx.interaction?.member.user.discriminator}${ctx.interaction?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.interaction?.guild_id)?.name} | Guild ID: ${ctx.interaction?.guild_id}` : ``}`);
            else
                this.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${StringUtils_1.removeToken(error.message.replace(/^(Error: )/, ``))} | Command: ${ctx.command?.command} | User: ${ctx.message?.author.username}#${ctx.message?.author.discriminator}${ctx.message?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message?.guild_id)?.name} | Guild ID: ${ctx.message?.guild_id}` : ``}`);
            if (!error.nonFatal) {
                console.log(`\x1b[31m`);
                console.error(error);
                console.log(`\x1b[37m`);
            }
            ctx.embed
                .color(Constants_1.Constants.ERROR_EMBED_COLOR)
                .title(`Error`)
                .description(`\`\`\`\n${StringUtils_1.removeToken(error.message.replace(/^(Error: )/, ``))}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants_1.Constants.SUPPORT_SERVER}`)
                .send(true, false, true)
                .catch((error) => this.log(`\x1b[31mUnable to send Error Embed${typeof error === `string` ? ` | Reason: ${error}` : (typeof error?.message === `string` ? ` | Reason: ${error.message}` : ``)}`));
        });
        this.commands.middleware((ctx) => {
            if (!ctx.isInteraction) {
                if (!Config_1.Config.devs.IDs.includes(ctx.message.author.id)) {
                    this.log(`\x1b[33mReceived Depreciated Prefix Command | User: ${ctx.message.author.username}#${ctx.message.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                    void ctx.error(`Prefix commands are now depreciated, please use slash commands instead. For more information, join our support server!`);
                    return false;
                }
                else {
                    if (ctx.command.interaction != null) {
                        this.log(`\x1b[33mReceived Depreciated Prefix Command | User: ${ctx.message.author.username}#${ctx.message.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                        void ctx.error(`That's an interaction command, not a developer command silly!`);
                        return false;
                    }
                    else {
                        this.log(`\x1b[32mReceived Dev Command | Command: ${ctx.command.command} | User: ${ctx.message.author.username}#${ctx.message.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                        return true;
                    }
                }
            }
            else {
                this.log(`Received Interaction | Command: ${ctx.ran} | User: ${ctx.interaction.member.user.username}#${ctx.interaction.member.user.discriminator}${ctx.interaction.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.interaction.guild_id)?.name} | Guild ID: ${ctx.interaction.guild_id}` : ``}`);
                return true;
            }
        });
        this.on(`READY`, () => {
            this.lavalink.init(this.user.id);
            this.log(`\x1b[32mInitiated Lavalink`);
        });
    }
}
exports.WorkerManager = WorkerManager;
