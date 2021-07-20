import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `pause`,
    interaction: {
        name: `pause`,
        description: `Pause the music.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || !player.queue.length) return void ctx.error(`Unable to pause; there is no music in the queue.`);
        if (player.state === PlayerState.CONNECTED) return void ctx.error(`Unable to pause; there is no music playing.`);
        if (player.state === PlayerState.PAUSED) return void ctx.error(`The music is already paused.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.interaction.member.user.id));
        if (!foundVoiceState || foundVoiceState.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the VC to pause the music.`);

        await player.pause();

        ctx.embed
            .color(Constants.PAUSE_EMBED_COLOR)
            .title(`:pause_button:  Paused the music`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
