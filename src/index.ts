/**
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

import { checkEnvHeaders } from './resources/Headers';
import { Config } from './config/Config';
import { log, logHeader, statsCheckup } from './Utils';

// Import modules.
import { Master } from 'discord-rose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Configure dotenv.
dotenv.config();

// Log header.
logHeader();

// Create master.
const master = new Master(path.resolve(__dirname, `./Worker.js`), {
    cache: Config.cache,
    cacheControl: Config.cacheControl,
    log: log,
    shards: Config.shards[process.env.NODE_ENV ?? `dev`],
    shardsPerCluster: Config.shardsPerCluster[process.env.NODE_ENV ?? `dev`],
    token: process.env.BOT_TOKEN ?? ``
});

// Check headers.
checkEnvHeaders(master);

// Start master.
master.start().catch((error) => master.log(error));

// On ready.
master.on(`READY`, () => {
    // Run stats checkups at a set interval.
    statsCheckup(master).catch((error) => master.log(error));
    setInterval(() => void (async () => await statsCheckup(master).catch((error) => master.log(error)))(), Config.statsCheckupInterval[process.env.NODE_ENV ?? `dev`]);

    // Log ready.
    master.log(`\x1b[35mBot up since ${new Date().toLocaleString()}`);
});
