// Import node modules.
const { Worker } = require (`discord-rose`);

// Import config.
const config = require(`./config/config.js`);

// Create worker.
const worker = new Worker();

worker.commands
    .prefix(config.prefix[process.env.NODE_ENV])
    .add({
        command: 'hello',
        exec: (ctx) => {
            ctx.reply('World!')
        }
    });