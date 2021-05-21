/**
 * Creates a timestamp.
 * @param {number} time Time in milliseconds.
 * @returns {string} The timestamp string.
 */
const timestamp = (time) => {
    time = Math.round(time / 1e3);
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time / 60) - (hours * 60);
    const seconds = time % 60;
    return hours > 0 ? `${hours.toString()}:${minutes.toString().padStart(2, `0`)}:${seconds.toString().padStart(2, `0`)}` : `${minutes.toString()}:${seconds.toString().padStart(2, `0`)}`;
};

module.exports = timestamp;
