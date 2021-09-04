import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState, Track } from '@discord-rose/lavalink';
import { Utils } from '@br88c/discord-utils';

export default {
    command: `nowplaying`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePausedOrPlaying: true,
    interaction: {
        name: `nowplaying`,
        description: `Get the current music playing.`
    },
    exec: (ctx) => {
        let description: string;
        if ((ctx.player!.currentTrack as Track).isStream) description = `🔴  **LIVE**`;
        else description = `\`\`\`\n${ctx.player!.state === PlayerState.PAUSED ? `⏸` : `▶`} ${Utils.timestamp(ctx.player!.position ?? 0)} ${Utils.progressBar((ctx.player!.position ?? 0) / (ctx.player!.currentTrack!.length ?? (ctx.player!.position ?? 0)), 25)} ${Utils.timestamp(ctx.player!.currentTrack!.length ?? (ctx.player!.position ?? 0))}\n\`\`\``;

        ctx.embed
            .color(Constants.NOW_PLAYING_EMBED_COLOR)
            .author(`Currently playing:`)
            .title(Utils.cleanseMarkdown(ctx.player!.currentTrack!.title), (ctx.player!.currentTrack! as Track).uri)
            .thumbnail((ctx.player!.currentTrack! as Track).thumbnail(`mqdefault`) ?? ``)
            .description(description)
            .footer(`Requested by ${ctx.player!.currentTrack!.requester}`)
            .send()
            .catch((error) => {
                Utils.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
