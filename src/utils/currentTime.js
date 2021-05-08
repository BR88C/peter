/**
 * Returns the current time in a song based on stream time, speed, and the starting time.
 * @param {Object} serverQueue Server queue object.
 * @returns {number} Current time in milliseconds.
 */
const currentTime = (serverQueue) => Math.round(((Date.now() - serverQueue.songPlayingSince) * (serverQueue.effects.speed / 100)) + serverQueue.songs[serverQueue.currentSong].startTime);

module.exports = currentTime;
