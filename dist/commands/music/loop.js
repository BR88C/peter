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
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player)
            return void ctx.error(`Unable to change the loop behavior; the bot is not connected to the VC.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the VC to change the loop behavior.`);
        player.setLoop(ctx.options.type);
        ctx.embed
            .color(Constants_1.Constants.LOOP_EMBED_COLOR)
            .title(`:repeat:  Looping is now set to \`${player.loop.charAt(0).toUpperCase()}${player.loop.slice(1)}\``)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
