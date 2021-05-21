const config = require(`./config/config.js`);
const constants = require(`./config/constants.js`);

// Import node modules.
const fs = require(`fs`);
const path = require(`path`);
const { Worker } = require(`discord-rose`);

// Create worker.
const worker = new Worker();

// Set prefix.
worker.commands.prefix(config.developerPrefix);
worker.log(`Using developer prefix ${config.developerPrefix}`);

// Push all commands to the worker.
for (const dir of fs.readdirSync(`./src/commands`).filter((file) => fs.statSync(`${`./src/commands` + `/`}${file}`).isDirectory())) worker.commands.load(path.resolve(__dirname, `./commands/${dir}`));
worker.log(`Loaded ${worker.commands.commands.size} commands`);

// Custom error response.
worker.commands.error((ctx, error) => {
    worker.log(`${error.nonFatal ? `` : `Fatal `}Error executing Command | Reason: ${error.message} | Command: ${ctx.command.command} | User: ${ctx.message.author.username}#${ctx.message.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id).name} | Guild ID: ${ctx.message.guild_id}`)
    ctx.embed
        .color(constants.ERROR_EMBED_COLOR)
        .title(`Error`)
        .description(`\`\`\`\n${error.message}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${constants.SUPPORT_SERVER}`)
        .send()
        .catch((error) => {});
});

// Create middleware.
worker.commands.middleware((ctx) => {
    if (!ctx.isInteraction) {
        // Check if user is a dev.
        if (!config.devs.IDs.includes(ctx.message.author.id)) {
            worker.log(`Received Depreciated Prefix Command | User: ${ctx.message.author.username}#${ctx.message.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id).name} | Guild ID: ${ctx.message.guild_id}`);
            ctx.error(`Prefix commands are now depreciated. Please use slash commands instead!`);
            return false;
        } else { // If the user is a dev, run the command.
            if (ctx.command.interaction) {
                ctx.reply(`That's an interaction command, not a developer command silly!`);
                return false;
            } else {
                worker.log(`Received Dev Command | Command: ${ctx.command.command} | User: ${ctx.message.author.username}#${ctx.message.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id).name} | Guild ID: ${ctx.message.guild_id}`)
                return true;
            }
        }
    } else {
        worker.log(`Received Interaction | Command: ${ctx.command.command} | User: ${ctx.message.author.username}#${ctx.message.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id).name} | Guild ID: ${ctx.message.guild_id}`)
        return true;
    }
});