/* Creates a random hex color or a hex color based on the integer defined */

const randomint = require(`../utils/randomint.js`);

module.exports = (int) => {
    // If an integer is defined, mod it by the number of possible hex colors
    if(int) {
        return int % 16777215;

    // If an integer is not defined, generate a random hex color using randomint
    } else {
        return randomint(1,16777215);
    }
}