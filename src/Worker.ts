import { Config } from './config/Config';
import { Constants } from './config/Constants';
import { Presences } from './config/Presences';

// Import node modules.
import * as fs from 'fs';
import * as path from 'path';
import { Worker } from 'discord-rose';

// Create worker.
const worker = new Worker();

// Set presence, and change it at an interval specified in config.
const setRandomPresence = () => {
    const presence = Presences[~~(Presences.length * Math.random())];
    worker.setStatus(presence.type, presence.name, presence.status);
};
setRandomPresence();
setInterval(() => setRandomPresence(), Config.presenceInterval);

// Set command handler options.
worker.commands.options({ reuseInteractions: true });

// Set prefix.
worker.commands.prefix(Config.developerPrefix);
worker.log(`Using developer prefix ${Config.developerPrefix}`);

// Push all commands to the worker.
for (const dir of fs.readdirSync(`./src/commands`).filter((file) => fs.statSync(`${`./src/commands` + `/`}${file}`).isDirectory())) worker.commands.load(path.resolve(__dirname, `./commands/${dir}`));
worker.log(`Loaded ${worker.commands.commands?.size} commands`);

// Custom command error response.
worker.commands.error((ctx, error) => {
    if (ctx.isInteraction) worker.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${error.message} | Command: ${ctx.ran} | User: ${ctx.interaction?.member.user.username}#${ctx.interaction?.member.user.discriminator}${ctx.interaction?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.interaction?.guild_id)?.name} | Guild ID: ${ctx.interaction?.guild_id}` : ``}`);
    else worker.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${error.message} | Command: ${ctx.command?.command} | User: ${ctx.message?.author.username}#${ctx.message?.author.discriminator}${ctx.message?.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message?.guild_id)?.name} | Guild ID: ${ctx.message?.guild_id}` : ``}`);

    ctx.embed
        .color(Constants.ERROR_EMBED_COLOR)
        .title(`Error`)
        .description(`\`\`\`\n${error.message}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`)
        .send()
        .catch((error) => worker.log(`\x1b[31mUnable to send Error Embed${typeof error === `string` ? ` | Reason: ${error}` : (typeof error?.message === `string` ? ` | Reason: ${error.message}` : ``)}`));
});

// Create command middleware.
worker.commands.middleware((ctx) => {
    if (!ctx.isInteraction) { // If the received event is not an interaction.
        if (!Config.devs.IDs.includes(ctx.message.author.id)) { // If the user is not a dev, return an error.
            worker.log(`\x1b[33mReceived Depreciated Prefix Command | User: ${ctx.message.author.username}#${ctx.message.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
            ctx.error(`Prefix commands are now depreciated. Please use slash commands instead!`);
            return false;
        } else { // If the user is a dev.
            if (ctx.command.interaction != null) { // If the command is a slash command, return.
                worker.log(`\x1b[33mReceived Depreciated Prefix Command | User: ${ctx.message.author.username}#${ctx.message.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                ctx.error(`That's an interaction command, not a developer command silly!`);
                return false;
            } else { // If the command is not a slash command, execute it.
                worker.log(`\x1b[32mReceived Dev Command | Command: ${ctx.command.command} | User: ${ctx.message.author.username}#${ctx.message.author.discriminator}${ctx.message.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id)?.name} | Guild ID: ${ctx.message.guild_id}` : ``}`);
                return true;
            }
        }
    } else { // If the received event is an interaction.
        worker.log(`\x1b[32mReceived Interaction | Command: ${ctx.ran} | User: ${ctx.interaction.member.user.username}#${ctx.interaction.member.user.discriminator}${ctx.interaction.guild_id ? ` | Guild Name: ${ctx.worker.guilds.get(ctx.interaction.guild_id)?.name} | Guild ID: ${ctx.interaction.guild_id}` : ``}`);
        return true;
    }
});