/**
 *  Generates a string based off of active effects
 *
 * @param {string} type The type of string to request (ffmpeg, formatted)
 * @param {object} serverQueue Server queue object (this)
 * @returns {string} The generated effects string based on type
 */
const effectsString = (type, serverQueue) => {
    let activeEffects = [];

    if (type === `ffmpeg`) {
        if (serverQueue.effects.bass !== 0) activeEffects.push(`bass=g=${serverQueue.effects.bass / 2}`);
        if (serverQueue.effects.flanger !== 0) activeEffects.push(`flanger=depth=${serverQueue.effects.flanger / 10}`);
        if (serverQueue.effects.highpass !== 0) activeEffects.push(`highpass=f=${serverQueue.effects.highpass * 25}`);
        if (serverQueue.effects.lowpass !== 0) activeEffects.push(`lowpass=f=${2000 - serverQueue.effects.lowpass * 16}`);
        if (serverQueue.effects.phaser !== 0) activeEffects.push(`aphaser=decay=${serverQueue.effects.phaser / 200}`);
        if (serverQueue.effects.pitch !== 100) activeEffects.push(`rubberband=pitch=${serverQueue.effects.pitch / 100}`);
        if (serverQueue.effects.speed !== 100 && !serverQueue.songs[serverQueue.currentSong].livestream) activeEffects.push(`atempo=${serverQueue.effects.speed / 100}`);
        if (serverQueue.effects.treble !== 0) activeEffects.push(`treble=g=${serverQueue.effects.treble / 3}`);
        if (serverQueue.effects.vibrato !== 0) activeEffects.push(`vibrato=d=${serverQueue.effects.vibrato / 100}`);
        activeEffects = activeEffects.join(`, `);
    } else if (type === `formatted`) {
        if (serverQueue.effects.bass !== 0) activeEffects.push(`Bass = +${serverQueue.effects.bass}﹪`);
        if (serverQueue.effects.flanger !== 0) activeEffects.push(`Flanger = ${serverQueue.effects.flanger}﹪`);
        if (serverQueue.effects.lowpass !== 0) activeEffects.push(`Lowpass = +${serverQueue.effects.lowpass}﹪`);
        if (serverQueue.effects.highpass !== 0) activeEffects.push(`Highpass = +${serverQueue.effects.highpass}﹪`);
        if (serverQueue.effects.phaser !== 0) activeEffects.push(`Phaser = ${serverQueue.effects.phaser}﹪`);
        if (serverQueue.effects.pitch !== 100) activeEffects.push(`Pitch = ${serverQueue.effects.pitch}﹪`);
        if (serverQueue.effects.speed !== 100) activeEffects.push(`Speed = ${serverQueue.effects.speed}﹪`);
        if (serverQueue.effects.treble !== 0) activeEffects.push(`Treble = +${serverQueue.effects.treble}﹪`);
        if (serverQueue.effects.vibrato !== 0) activeEffects.push(`Vibrato = ${serverQueue.effects.vibrato}﹪`);
        if (serverQueue.volume !== 100) activeEffects.push(`Volume = ${serverQueue.volume}﹪`);
        activeEffects = activeEffects[0] ? `\`\`\`prolog\n${activeEffects.join(`, `)}\n\`\`\`` : `\`\`\`diff\n-= No Active effects =-\n\`\`\``;
    } else {
        throw new Error(`Invalid effects array type`);
    }

    return activeEffects;
};

module.exports = effectsString;
