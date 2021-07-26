// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `userconfig`,
    interaction: {
        name: `userconfig`,
        description: `Configure your personal settings.`,
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
    },
    exec: async (ctx) => {

    }
} as CommandOptions;
