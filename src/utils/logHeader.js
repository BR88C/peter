const config = require(`../config/config.js`);

/**
 * Creates a header for logging
 */
const logHeader = () => {
    console.log(`\x1b[34m`, `______    _            _ `);
    console.log(`\x1b[34m`, `| ___ \\  | |          | |`);
    console.log(`\x1b[34m`, `| |_/ /__| |_ ___ _ __| |`);
    console.log(`\x1b[34m`, `|  __/ _ \\ __/ _ \\ '__| |`);
    console.log(`\x1b[34m`, `| | |  __/ ||  __/ |  |_|`);
    console.log(`\x1b[34m`, `\\_|  \\___|\\__\\___|_|  (_)`);
    console.log(`\x1b[34m`, `\n By ${config.devs.tags.join(`, `)}\n`);
};

module.exports = logHeader;
