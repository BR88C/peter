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

import { Config } from './config/Config'
import {
    log, statsCheckup
} from './Utils'

// Import modules.
import { Master } from 'discord-rose'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Configure dotenv.
dotenv.config()

// Create master.
const master = new Master(path.resolve(__dirname, `./Worker.js`), {
    cache: Config.cache,
    cacheControl: Config.cacheControl,
    log: log,
    shards: Config.shards[process.env.NODE_ENV ?? `dev`],
    shardsPerCluster: Config.shardsPerCluster[process.env.NODE_ENV ?? `dev`],
    token: process.env.BOT_TOKEN ?? ``
})

// Start master.
master.start()

// On ready.
master.on(`READY`, () => {
    // Run stats checkups at a set interval.
    statsCheckup(master)
    setInterval(async () => await statsCheckup(master), Config.statsCheckupInterval[process.env.NODE_ENV ?? `dev`])

    // Log ready.
    master.log(`\x1b[35mBot up since ${new Date().toLocaleString()}`)
})
