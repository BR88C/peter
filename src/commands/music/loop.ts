import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Utils } from '@br88c/discord-utils';

export default {
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
        ctx.player!.setLoop(ctx.options.type);

        ctx.embed
            .color(Constants.LOOP_EMBED_COLOR)
            .title(`:repeat:  Looping is now set to \`${ctx.player!.loop.charAt(0).toUpperCase()}${ctx.player!.loop.slice(1)}\``)
            .send()
            .catch((error) => {
                Utils.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
