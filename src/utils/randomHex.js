const randomInt = require(`./randomInt.js`);

/**
 * Creates a random hex color or a hex color based on the integer defined
 *
 * @param {number} int
 * @returns {number} Hex color
 */
const randomHex = (int) => {
    // If an integer is defined, mod it by the number of possible hex colors
    if (int) {
        return int % 16777215;

    // If an integer is not defined, generate a random hex color using randomint
    } else {
        return randomInt(1, 16777215);
    }
};

module.exports = randomHex;
