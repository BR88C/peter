const config = require(`../config/config.js`);

/**
 * Creates a header for logging.
 * @returns {Void} Void.
 */
const logHeader = () => {
    console.log(`\x1b[34m`, `██████╗ ███████╗████████╗███████╗██████╗ ██╗`);
    console.log(`\x1b[34m`, `██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗██║`);
    console.log(`\x1b[34m`, `██████╔╝█████╗     ██║   █████╗  ██████╔╝██║`);
    console.log(`\x1b[34m`, `██╔═══╝ ██╔══╝     ██║   ██╔══╝  ██╔══██╗╚═╝`);
    console.log(`\x1b[34m`, `██║     ███████╗   ██║   ███████╗██║  ██║██╗`);
    console.log(`\x1b[34m`, `╚═╝     ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝`);
    console.log(`\x1b[34m`, `\n By ${config.devs.tags.join(`, `)}\n`);
};

module.exports = logHeader;
