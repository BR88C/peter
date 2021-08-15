"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `loop`,
    mustHaveConnectedPlayer: true,
    userMustBeInSameVC: true,
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
        ctx.player.setLoop(ctx.options.type);
        ctx.embed
            .color(Constants_1.Constants.LOOP_EMBED_COLOR)
            .title(`:repeat:  Looping is now set to \`${ctx.player.loop.charAt(0).toUpperCase()}${ctx.player.loop.slice(1)}\``)
            .send()
            .catch((error) => {
            discord_utils_1.logError(error);
            void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
        });
    }
};
