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

import { Config } from './config/Config';
import runMaster from './managers/run/runMaster';
import { TextArt } from './config/TextArt';

// Import modules.
import { config } from 'dotenv';

// Configure dotenv.
config();

// Check that a bot token is set.
if (!process.env.BOT_TOKEN) throw new Error(`A bot token has not been set.`);

// Check that there are as many Lavalink passwords set as there are node configs.
if (!JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`).length || Config.lavalinkNodes.length !== JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`).length) throw new Error(`Lavalink configuration is not properly set.`);

// Check that Spotify environment variables are properly set.
if (!process.env.SPOTIFY_ID || !process.env.SPOTIFY_SECRET) throw new Error(`Spotify App credentials have not been set.`);

// Check that NODE_ENV is properly set.
if (process.env.NODE_ENV && process.env.NODE_ENV !== `dev` && process.env.NODE_ENV !== `prod`) throw new Error(`NODE_ENV is not properly set.`);

// Log header.
console.log(`\n\x1b[35m${TextArt}\n\nBy ${Config.devs.tags.join(`, `)}\n`);

// Start the bot by creating the master process.
runMaster();
