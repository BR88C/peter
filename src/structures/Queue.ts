import { checkEnvHeaders, getEnvHeaders } from '../utils/Headers';
import { Constants } from '../config/Constants';
import { PlaybackActivity } from './PlaybackActivity';
import { Player } from './Player';
import { Song } from './Song';

// Import modules.
import { APIMessage, Snowflake } from 'discord-api-types';
import { CommandError, Embed, Worker } from 'discord-rose';
import ytdl, { getInfo } from 'ytdl-core';

/**
 * Queue class - Manages all music / audio for a guild.
 * @class
 */
export class Queue {
    /**
     * The ID of the text channel the queue is bound to.
     */
    public textID: Snowflake
    /**
     * The ID of the text channel the queue is bound to.
     */
    public voiceID: Snowflake
    /**
     * The ID of the guild the queue is bound to.
     */
    public readonly guildID: Snowflake

    /**
     * The queue's songs.
     */
    public songs: Song[]
    /**
     * The current song playing, represented as an index of Queue#songs.
     * This value is set to -1 if no songs are playing.
     */
    public playing: number
    /**
     * If the queue is paused.
     */
    public paused: boolean
    /**
     * If the music should be looped.
     */
    public loop: `off` | `queue` | `single`
    /**
     * If the queue should be played 24/7.
     */
    public twentyFourSeven: boolean

    /**
     * The queue's effects.
     */
    public effects: {
        /**
         * Bassboost.
         * Min = 0, Max = 100.
         * @default 0
         */
        bass: number
        /**
         * Flanger.
         * Min = 0, Max = 100.
         * @default 0
         */
        flanger: number
        /**
         * Highpass.
         * Min = 0, Max = 100.
         * @default 0
         */
        highpass: number
        /**
         * Lowpass.
         * Min = 0, Max = 100.
         * @default 0
         */
        lowpass: number
        /**
         * Phaser.
         * Min = 0, Max = 100.
         * @default 0
         */
        phaser: number
        /**
         * Pitch.
         * Min = 25, Max = 250.
         * @default 100
         */
        pitch: number
        /**
         * Speed.
         * Min = 50, Max = 500.
         * This effect is not applied on livestreams.
         * @default 100
         */
        speed: number
        /**
         * Treble.
         * Min = 0, Max = 100.
         * @default 0
         */
        treble: number
        /**
         * Vibrato.
         * Min = 0, Max = 100.
         * @default 0
         */
        vibrato: number
        /**
         * Volume.
         * Min = 0, Max = Number.MAX_SAFE_INTEGER
         * @default 100
         */
        volume: number
    }

    /**
     * The queue's audio player.
     */
    public player: Player

    /**
     * Playback data.
     * Used for determining the progress through a song.
     * This is undefined if no song is playing.
     */
    public playbackActivity: PlaybackActivity | undefined
    /**
     * The Worker object the queue is spawned on.
     */
    public readonly worker: Worker

    /**
     * Creates a Queue.
     * @param textID The text channel ID to bind to.
     * @param voiceID The voice channel ID to bind to.
     * @param guildID The guild the queue is bound to.
     * @param worker The Worker object the queue is being spawned on.
     * @constructor
     */
    constructor (textID: Snowflake, voiceID: Snowflake, guildID: Snowflake, worker: Worker) {
        this.textID = textID;
        this.voiceID = voiceID;
        this.guildID = guildID;

        this.songs = [];
        this.playing = -1;
        this.paused = false;
        this.loop = `off`;
        this.twentyFourSeven = false;

        this.effects = {
            bass: 0,
            flanger: 0,
            highpass: 0,
            lowpass: 0,
            phaser: 0,
            pitch: 100,
            speed: 100,
            treble: 0,
            vibrato: 0,
            volume: 100
        };

        this.player = new Player(this);

        this.playbackActivity = undefined;
        this.worker = worker;
    }

    /**
     * The progress through a song.
     * Returns time in milliseconds. If a song is not playing, it returns 0.
     *
     * This is raw progress, meaning that the returned value is the time through the song, not scaled to the queue's speed.
     * For example, a returned value of 10,000 would represent that the song is at it's 10 second mark, NOT that it has been playing for 10 seconds.
     */
    public get songProgress (): number {
        if (!this.playbackActivity) return 0;

        let progress: number = this.playbackActivity.startPosition;
        if (this.playbackActivity.segments.length > 1) {
            for (let i = 1; i < this.playbackActivity.segments.length; i++) {
                progress += (this.playbackActivity.segments[i].startedAt - this.playbackActivity.segments[i - 1].startedAt) * (this.playbackActivity.segments[i - 1].speed / 100);
            }
        }
        progress += (Date.now() - this.playbackActivity.segments[this.playbackActivity.segments.length - 1].startedAt) * (this.effects.speed / 100);
        return progress;
    }

    /**
     * The progress through the queue.
     * Returns time in milliseconds. If no song is playing, it returns 0.
     *
     * This is raw progress, meaning that the returned value is the time through the queue, not scaled to the queue's speed.
     */
    public get queueProgress (): number {
        if (this.playing === -1) return 0;

        let progress: number = this.songProgress;
        const completedSongs: Song[] = this.songs.slice(0, this.playing);
        for (const song of completedSongs) progress += song.videoLength;
        return progress;
    }

    /**
     * The queue's total length in milliseconds.
     * This value is not scaled to the queue's speed.
     */
    public get queueLength (): number {
        let length: number = 0;
        for (const song of this.songs) length += song.videoLength;
        return length;
    }

    /**
     * FFMPEG arguments generated from Queue#effects.
     * Returns undefined if there are no active effects to be pushed to FFMPEG.
     */
    public get ffmpegArgs (): string | undefined {
        const activeEffects: string[] = [];
        if (this.effects.bass !== 0) activeEffects.push(`bass=g=${this.effects.bass / 2}`);
        if (this.effects.flanger !== 0) activeEffects.push(`flanger=depth=${this.effects.flanger / 10}`);
        if (this.effects.highpass !== 0) activeEffects.push(`highpass=f=${this.effects.highpass * 25}`);
        if (this.effects.lowpass !== 0) activeEffects.push(`lowpass=f=${2e3 - this.effects.lowpass * 16}`);
        if (this.effects.phaser !== 0) activeEffects.push(`aphaser=decay=${this.effects.phaser / 200}`);
        if (this.effects.pitch !== 100) activeEffects.push(`rubberband=pitch=${this.effects.pitch / 100}`);
        if (this.effects.speed !== 100 && !this.songs[this.playing].livestream) activeEffects.push(`atempo=${this.effects.speed / 100}`);
        if (this.effects.treble !== 0) activeEffects.push(`treble=g=${this.effects.treble / 3}`);
        if (this.effects.vibrato !== 0) activeEffects.push(`vibrato=d=${this.effects.vibrato / 100}`);
        return activeEffects.length > 0 ? activeEffects.join(`, `) : undefined;
    }

    /**
     * A pretty codeblock string generated from Queue#effects.
     */
    public get formattedEffectsString (): string {
        const activeEffects: string[] = [];
        if (this.effects.bass !== 0) activeEffects.push(`Bass = +${this.effects.bass}﹪`);
        if (this.effects.flanger !== 0) activeEffects.push(`Flanger = ${this.effects.flanger}﹪`);
        if (this.effects.lowpass !== 0) activeEffects.push(`Lowpass = +${this.effects.lowpass}﹪`);
        if (this.effects.highpass !== 0) activeEffects.push(`Highpass = +${this.effects.highpass}﹪`);
        if (this.effects.phaser !== 0) activeEffects.push(`Phaser = ${this.effects.phaser}﹪`);
        if (this.effects.pitch !== 100) activeEffects.push(`Pitch = ${this.effects.pitch}﹪`);
        if (this.effects.speed !== 100) activeEffects.push(`Speed = ${this.effects.speed}﹪`);
        if (this.effects.treble !== 0) activeEffects.push(`Treble = +${this.effects.treble}﹪`);
        if (this.effects.vibrato !== 0) activeEffects.push(`Vibrato = ${this.effects.vibrato}﹪`);
        if (this.effects.volume !== 100) activeEffects.push(`Volume = ${this.effects.volume}﹪`);
        return activeEffects.length > 0 ? `\`\`\`prolog\n${activeEffects.join(`, `)}\n\`\`\`` : `\`\`\`diff\n-= No Active effects =-\n\`\`\``;
    }

    /**
     * Gets the time left in the queue or in the song currently playing.
     * @param type If queue or song time left should be retrieved. Defaults to queue.
     * @param includeSpeed If queue speed should be included in the estimation. If false, it returns the raw time left.
     * @returns The time left in milliseconds.
     */
    public getTimeLeft (type: `queue` | `song` = `queue`, includeSpeed: boolean = false): number {
        let timeLeft: number = 0;
        if (type === `queue`) timeLeft = this.queueLength - this.queueProgress;
        else if (type === `song`) timeLeft = this.songs[this.playing].videoLength - this.songProgress;
        return timeLeft * (includeSpeed ? this.effects.speed / 100 : 1);
    }

    /**
     * Changes the speed of the queue, and adds a segment to the queue's playback activity.
     * @param newSpeed The new speed to set the queue to.
     * @returns Void.
     */
    public changeSpeed (newSpeed: number): void {
        this.effects.speed = newSpeed;
        if (this.playbackActivity) this.playbackActivity.addSegment(newSpeed);
    }

    /**
     * Adds a song to the queue. This DOES NOT play the song.
     * @param url The URL of the song.
     * @param requestedBy The tag of the person who requested the song.
     * @returns A promise that resolves once the song is added. Returns the created song object.
     */
    public async addSong (url: string, requestedBy: string): Promise<Song | undefined> {
        const songInfo: ytdl.videoInfo = await getInfo(url, { requestOptions: checkEnvHeaders() ? { headers: getEnvHeaders() } : undefined }).catch((error) => {
            throw new CommandError(error?.message.replace(`Error: `, ``));
        });
        if (!songInfo) throw new CommandError(`Unable to get song info from "${url}".`);

        const song: Song = new Song(songInfo, requestedBy);
        if (!song.formats.opus.itag && !song.formats.nonOpus.itag) throw new CommandError(`Unable to find a supported audio stream from "${url}".`);

        this.songs.push(song);
        return song;
    }

    /**
     * Adds a playlist to the queue. This DOES NOT play any of the songs.
     * @param urls An array of video URls in the playlist.
     * @param requestedBy The tag of the person who requested the song.
     * @param added A callback that fires every time a song is added to the queue. It will also fire if an error occurs. A boolean must be returned; true will continue queing the playlist, false will stop the playlist from being queued.
     * @returns The number of songs queued, or undefined if the added callback recieves false.
     */
    public async addPlaylist (urls: string[], requestedBy: string, added: (song: Song | CommandError) => boolean): Promise<number | undefined> {
        let songsAdded: number = 0;
        for (const url of urls) {
            const songInfo: ytdl.videoInfo | undefined = await getInfo(url, { requestOptions: checkEnvHeaders() ? { headers: getEnvHeaders() } : undefined }).catch((error) => {
                console.log(`\x1b[31m`);
                console.error(error);
                console.log(`\x1b[37m`);
            }) as ytdl.videoInfo | undefined;
            if (!songInfo) {
                const addedResponse = added(new CommandError(`Unable to get song info from "${url}".`));
                if (!addedResponse) return;
                else continue;
            }

            const song: Song = new Song(songInfo, requestedBy);
            if (!song.formats.opus.itag && !song.formats.nonOpus.itag) {
                const addedResponse = added(new CommandError(`Unable to find a supported audio stream from "${url}".`));
                if (!addedResponse) return;
                else continue;
            }

            this.songs.push(song);
            const addedResponse = added(song);
            if (!addedResponse) return;
            songsAdded++;
        }
        return songsAdded;
    }

    /**
     * Advances the queue based on Queue#loop.
     * It will run Queue#playSong() if possible, if not Queue#playing will be set to -1.
     * @returns If a new song is starting to play.
     */
    advanceQueue (): boolean {
        this.playing = this.loop === `queue` ? (this.playing >= this.songs.length ? 0 : this.playing + 1) : (this.loop === `single` ? this.playing : this.playing + 1);
        if (!this.songs[this.playing]) {
            this.player.cleanupStreams();
            this.playing = -1;
            return false;
        } else {
            this.player.playSong().catch(async (error) => await this.sendErrorEmbed(error));
            return true;
        }
    }

    /**
     * Send the now playing embed in the queue's text channel.
     * @returns The sent message.
     */
    async sendEmbed (embed: Embed): Promise<APIMessage> {
        return await this.worker.api.messages.send(this.textID, embed).catch((error) => { throw new CommandError(error); });
    }

    /**
     * Send an error embed in the queue's text channel.
     */
    async sendErrorEmbed (error: CommandError): Promise<APIMessage | undefined> {
        this.worker.log(`\x1b[31m${error.nonFatal ? `` : `Fatal `}Queue Error | Reason: ${error.message.replace(`Error: `, ``)} | Guild Name: ${this.worker.guilds.get(this.guildID)?.name} | Guild ID: ${this.guildID}`);

        if (!error.nonFatal) {
            console.log(`\x1b[31m`);
            console.error(error);
            console.log(`\x1b[37m`);
        }

        const embed = new Embed()
            .color(Constants.ERROR_EMBED_COLOR)
            .title(`Queue Error`)
            .description(`\`\`\`\n${error.message.replace(`Error: `, ``)}\n\`\`\`\n*If this doesn't seem right, please submit an issue in the support server:* ${Constants.SUPPORT_SERVER}`);

        const message = await this.sendEmbed(embed).catch((error) => {
            this.worker.log(`\x1b[31mUnable to send Error Embed${typeof error === `string` ? ` | Reason: ${error}` : (typeof error?.message === `string` ? ` | Reason: ${error.message}` : ``)}`);
        });
        if (!message) return undefined;
        else return message;
    }
}
