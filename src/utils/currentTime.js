/* Returns the current time in a song based on stream time, speed, and the starting time */

const currentTime = (serverQueue) => {
    return Math.round((serverQueue.connection.dispatcher.streamTime / 1000) * (serverQueue.speed / 100) + serverQueue.songs[serverQueue.currentSong].startTime);
};

module.exports = currentTime;