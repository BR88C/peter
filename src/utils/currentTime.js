/**
 * Returns the current time in a song based on stream time, speed, and the starting time.
 *
 * @param {Object} serverQueue Server queue object.
 * @returns {number} Current time.
 */
const currentTime = (serverQueue) => serverQueue.connection.dispatcher ? Math.round((serverQueue.connection.dispatcher.streamTime / 1000) * (serverQueue.effects.speed / 100) + serverQueue.songs[serverQueue.currentSong].startTime) : 0;

module.exports = currentTime;
