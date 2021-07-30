import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `resume`,
    interaction: {
        name: `resume`,
        description: `Resume the music.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to resume the music; the bot is not connected to a voice channel.`);
        if (!player.queue.length) return void ctx.error(`Unable to resume the music; there is no music in the queue.`);
        if (player.queuePosition === null || player.state < PlayerState.PAUSED) return void ctx.error(`Unable to resume the music; there is no music playing.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the voice channel to resume the music.`);

        if (player.state === PlayerState.PLAYING) return void ctx.error(`The music is already resumed.`);
        await player.resume();

        ctx.embed
            .color(Constants.PAUSE_RESUME_EMBED_COLOR)
            .title(`:arrow_forward:  Resumed the music`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
