/**
 * Generates a timestamp based on the time specified in milliseconds.
 * @param {number} time Time in milliseconds.
 * @returns {String} Timestamp string.
 */
const createTimestamp = (time) => {
    time = Math.round(time / 1e3);
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time / 60) - (hours * 60);
    const seconds = time % 60;
    let formattedTime;

    if (hours > 0) formattedTime = `${hours.toString()}:${minutes.toString().padStart(2, `0`)}:${seconds.toString().padStart(2, `0`)}`;
    else formattedTime = `${minutes.toString()}:${seconds.toString().padStart(2, `0`)}`;

    return formattedTime;
};

module.exports = createTimestamp;
