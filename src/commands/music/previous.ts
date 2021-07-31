import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `previous`,
    interaction: {
        name: `previous`,
        description: `Skip to the previous song.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to skip to the previous song; the bot is not connected to a voice channel.`);
        if (!player.queue.length) return void ctx.error(`Unable to skip to the previous song; there is no music in the queue.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the voice channel to skip to the previous song.`);

        if (!player.queue[(player.queuePosition ?? player.queue.length) - 1]) return void ctx.error(`There are no previous songs to skip to.`);
        await player.skip((player.queuePosition ?? player.queue.length) - 1);

        ctx.embed
            .color(Constants.SKIP_EMBED_COLOR)
            .title(`:track_previous:  Skipped to the previous song`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
