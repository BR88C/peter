import { Constants } from '../../config/Constants';
import { ExtendedPlayer } from '../../managers/LavalinkManager';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `loop`,
    interaction: {
        name: `loop`,
        description: `Modify looping behavior.`,
        options: [
            {
                type: 3,
                name: `type`,
                description: `The type of looping to use.`,
                choices: [
                    {
                        name: `Queue`,
                        value: `queue`
                    },
                    {
                        name: `Track`,
                        value: `track`
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
        const player: ExtendedPlayer | undefined = ctx.worker.lavalink.players.get(ctx.interaction.guild_id) as any;
        if (!player) return void ctx.error(`Unable to disconnect the bot; no music is playing.`);

        if (ctx.options.type.value === `queue`) {
            player.setTrackRepeat(false);
            player.setQueueRepeat(true);
        } else if (ctx.options.type.value === `track`) {
            player.setQueueRepeat(false);
            player.setTrackRepeat(true);
        } else {
            player.setQueueRepeat(false);
            player.setTrackRepeat(false);
        }

        ctx.embed
            .color(Constants.LOOP_EMBED_COLOR)
            .title(`:repeat:  Looping is now set to \`${ctx.options.type.value}\``)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
