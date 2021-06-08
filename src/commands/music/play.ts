import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `play`,
    interaction: {
        name: `play`,
        description: `Plays a specified song.`,
        options: [
            {
                type: 3,
                name: `query`,
                description: `A YouTube link, or the name of a song / video.`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        if (!ctx.interaction.channel_id || !ctx.interaction.guild_id) return void ctx.error(`An unknown error occured when trying to connect to the voice channel.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.interaction.member.user.id));
        if (!foundVoiceState) return void ctx.error(`You must be in a voice channel to play music.`);

        await ctx.embed
            .color(Constants.PROCESSING_QUERY_EMBED_COLOR)
            .title(`Processing query...`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
