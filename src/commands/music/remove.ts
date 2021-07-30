import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `remove`,
    interaction: {
        name: `remove`,
        description: `Remove a song from the queue.`,
        options: [
            {
                type: 4,
                name: `index`,
                description: `The song's index in the queue.`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to remove a song from the queue; the bot is not connected to a voice channel.`);
        if (!player.queue.length) return void ctx.error(`Unable to remove a song from the queue; there is no music in the queue.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the voice channel to remove music from the queue.`);

        if (ctx.options.index < 1 || ctx.options.index > player.queue.length) return void ctx.error(`Please specify a valid index of the queue.`);
        const removedTrack = player.queue.splice(ctx.options.index - 1, 1)[0];

        await ctx.embed
            .color(Constants.REMOVED_TRACK_EMBED_COLOR)
            .title(`:x:  Removed "${removedTrack.title}" from the queue`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));

        if (ctx.options.index - 1 === player.queuePosition) {
            if (player.queue[player.queuePosition]) void player.skip(player.queuePosition);
            else void player.stop();
        }
    }
} as CommandOptions;
