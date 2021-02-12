/**
 * Generates a random integer between min and max
 * 
 * @param {number} min Min output
 * @param {number} max Max output
 * @returns {number} Random integer
 */
const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = randomInt;