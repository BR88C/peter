const config = require(`./config/config.js`);

// Import node modules.
const fs = require(`fs`);
const path = require(`path`);
const { Worker } = require(`discord-rose`);

// Create worker.
const worker = new Worker();

// Set prefix.
worker.commands.prefix(config.prefix[process.env.NODE_ENV]);
worker.log(`Using prefix ${config.prefix[process.env.NODE_ENV]}`);

// Push all commands to the worker.
for (const dir of fs.readdirSync(`./src/commands`).filter((file) => fs.statSync(`${`./src/commands` + `/`}${file}`).isDirectory())) worker.commands.load(path.resolve(__dirname, `./commands/${dir}`));
worker.log(`Loaded ${worker.commands.commands.size} commands`);

// Create middleware.
worker.commands.middleware((ctx) => {
    worker.log(`Received Command | Command: ${ctx.command.command} | User: ${ctx.message.author.username}#${ctx.message.author.discriminator} | Guild Name: ${ctx.worker.guilds.get(ctx.message.guild_id).name} | Guild ID: ${ctx.message.guild_id}`)
    return true;
});