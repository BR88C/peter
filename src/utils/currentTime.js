/**
 * Returns the current time in a song based on stream time, speed, and the starting time
 *
 * @param {object} serverQueue Server queue object
 * @returns {number} Current time
 */
const currentTime = (serverQueue) => Math.round((serverQueue.connection.dispatcher.streamTime / 1000) * (serverQueue.effects.speed / 100) + serverQueue.songs[serverQueue.currentSong].startTime);

module.exports = currentTime;
