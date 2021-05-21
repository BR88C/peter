const config = require(`./config/config.js`);
const constants = require(`./config/constants.js`);
const presences = require(`./config/presences.js`);

// Import node modules.
const fs = require(`fs`);
const path = require(`path`);
const { Worker } = require(`discord-rose`);

// Create worker.
const worker = new Worker();

// Set presence, and change it at an interval specified in config.
const setRandomPresence = () => {
    const presence = presences[~~(presences.length * Math.random())];
    worker.setStatus(presence.type, presence.name, presence.status);
};
setRandomPresence();
setInterval(() => setRandomPresence(), config.presenceInterval);

// Set prefix.
worker.commands.prefix(config.developerPrefix);
worker.log(`Using developer prefix ${config.developerPrefix}`);

// Push all commands to the worker.
for (const dir of fs.readdirSync(`./src/commands`).filter((file) => fs.statSync(`${`./src/commands` + `/`}${file}`).isDirectory())) worker.commands.load(path.resolve(__dirname, `./commands/${dir}`));
worker.log(`Loaded ${worker.commands.commands.size} commands`);

// Custom command error response.
worker.commands.error((ctx, error) => {
    worker.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${error.message} | Command: ${ctx.command.command} | User: ${ctx.message.author.username}#${ctx.message.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id).name} | Guild ID: ${ctx.message.guild_id}`);
    ctx.embed
        .color(constants.ERROR_EMBED_COLOR)
        .title(`Error`)
        .description(`\`\`\`\n${error.message}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${constants.SUPPORT_SERVER}`)
        .send()
        .catch((error) => worker.log(`\x1b[31mUnable to send Error Embed${typeof error === `string` ? ` | Reason: ${error}` : (typeof error?.message === `string` ? ` | Reason: ${error.message}` : ``)}`));
});

// Create command middleware.
worker.commands.middleware((ctx) => {
    if (!ctx.isInteraction) { // If the received event is not an interaction.
        if (!config.devs.IDs.includes(ctx.message.author.id)) { // If the user is not a dev, return an error.
            worker.log(`\x1b[33mReceived Depreciated Prefix Command | User: ${ctx.message.author.username}#${ctx.message.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id).name} | Guild ID: ${ctx.message.guild_id}`);
            ctx.error(`Prefix commands are now depreciated. Please use slash commands instead!`);
            return false;
        } else { // If the user is a dev.
            if (ctx.command.interaction) { // If the command is a slash command, return.
                ctx.reply(`That's an interaction command, not a developer command silly!`);
                return false;
            } else { // If the command is not a slash command, execute it.
                worker.log(`\x1b[32mReceived Dev Command | Command: ${ctx.command.command} | User: ${ctx.message.author.username}#${ctx.message.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id).name} | Guild ID: ${ctx.message.guild_id}`);
                return true;
            }
        }
    } else { // If the received event is an interaction.
        worker.log(`\x1b[32mReceived Interaction | Command: ${ctx.command.command} | User: ${ctx.message.author.username}#${ctx.message.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id).name} | Guild ID: ${ctx.message.guild_id}`);
        return true;
    }
});
