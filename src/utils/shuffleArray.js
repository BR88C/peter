/**
 * Shuffles a provided array
 *
 * @param {Array} array Array to be shuffled
 * @returns {Array} Shuffled Array
 */
const shuffleArray = (array) => {
    let currentIndex = array.length; let temporaryValue; let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

module.exports = shuffleArray;
