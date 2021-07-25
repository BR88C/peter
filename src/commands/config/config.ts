import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `config`,
    interaction: {
        name: `config`,
        description: `Configure settings for the bot.`,
        options: [
            {
                type: 2,
                name: `server`,
                description: `The server's config.`,
                options: [
                    {
                        type: 1,
                        name: `dj`,
                        description: `DJ Config. Information will be shown if a value isn't specified.`,
                        options: [
                            {
                                type: 3,
                                name: `command`,
                                description: `The command to toggle access for.`,
                                required: false
                            }
                        ]
                    }
                ]
            },
            {
                type: 2,
                name: `user`,
                description: `Your personal config.`,
                options: [
                    {
                        type: 1,
                        name: `searchresults`,
                        description: `Search result config. Information will be shown if a value isn't specified.`,
                        options: [
                            {
                                type: 3,
                                name: `results`,
                                description: `The number of results to show. 0 will show no results and the first result will be used.`,
                                required: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    exec: async (ctx) => {

    }
} as CommandOptions;
