"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
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
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player)
            return void ctx.error(`Unable to change the loop behavior; there is no music in the queue.`);
        if (ctx.options.type.value === `queue`) {
            player.setTrackRepeat(false);
            player.setQueueRepeat(true);
        }
        else if (ctx.options.type.value === `track`) {
            if (player.queue.current?.isSeekable)
                return void ctx.error(`The current track does not support looping.`);
            player.setQueueRepeat(false);
            player.setTrackRepeat(true);
        }
        else {
            player.setQueueRepeat(false);
            player.setTrackRepeat(false);
        }
        ctx.embed
            .color(Constants_1.Constants.LOOP_EMBED_COLOR)
            .title(`:repeat:  Looping is now set to \`${ctx.options.type.value}\``)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
