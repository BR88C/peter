import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `loop`,
    interaction: {
        name: `loop`,
        description: `Modify the looping behavior.`,
        options: [
            {
                type: 3,
                name: `type`,
                description: `The type of loop behavior to use.`,
                choices: [
                    {
                        name: `Queue`,
                        value: `queue`
                    },
                    {
                        name: `Single`,
                        value: `single`
                    },
                    {
                        name: `Off`,
                        value: `off`
                    }
                ],
                required: true
            }
        ]
    },
    exec: (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to change the loop behavior; the bot is not connected to a voice channel.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the voice channel to change the loop behavior.`);

        player.setLoop(ctx.options.type);

        ctx.embed
            .color(Constants.LOOP_EMBED_COLOR)
            .title(`:repeat:  Looping is now set to \`${player.loop.charAt(0).toUpperCase()}${player.loop.slice(1)}\``)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
