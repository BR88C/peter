/**
 * Peter! by BR88C.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * @license
 */

// Import node modules.
const dotenv = require(`dotenv`).config();
const { Master } = require (`discord-rose`);
const path = require(`path`);

// Import utils.
const log = require(`./utils/log.js`);

// Create master.
const master = new Master(path.resolve(__dirname, `./worker.js`), {
    cache: {
        channels: false,
        guilds: true,
        members: false,
        messages: false,
        roles: false,
        self: true,
        users: false,
        voiceStates: true
    },
    cacheControl: {
        guilds: [`id`, `owner_id`, `member_count`]
    },
    log: log,
    shards: process.env.NODE_ENV === `dev` ? 1 : `auto`,
    token: process.env.BOT_TOKEN,
});

// Start master.
master.start();