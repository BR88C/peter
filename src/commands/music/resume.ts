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
        if (!player) return void ctx.error(`Unable to resume; there is no music in the queue.`); // || !player.queue.length
        if (player.state === PlayerState.CONNECTED) return void ctx.error(`Unable to pause; there is no music playing.`);
        if (player.state === PlayerState.PLAYING) return void ctx.error(`The music is already resumed.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (!foundVoiceState || foundVoiceState.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the VC to resume the music.`);

        await player.resume();

        ctx.embed
            .color(Constants.PAUSE_EMBED_COLOR)
            .title(`:pause_button:  Paused the music`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
