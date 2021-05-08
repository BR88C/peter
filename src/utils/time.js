/**
 * Generates a timestamp based on the time specified in seconds.
 * @param {number} time Time provided in seconds.
 * @returns {String} Timestamp string.
 */
const time = (time) => {
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time / 60) - (hours * 60);
    const seconds = time % 60;
    let formattedTime;

    if (hours > 0) formattedTime = `${hours.toString()}:${minutes.toString().padStart(2, `0`)}:${seconds.toString().padStart(2, `0`)}`;
    else formattedTime = `${minutes.toString()}:${seconds.toString().padStart(2, `0`)}`;

    return formattedTime;
};

module.exports = time;
