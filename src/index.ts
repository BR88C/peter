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

import { logHeader } from './utils/Log';
import runMaster from './managers/run/runMaster';

// Import modules.
import { config } from 'dotenv';

// Configure dotenv.
config();

// Check that a bot token is set.
if (!process.env.BOT_TOKEN) throw new Error(`A bot token has not been set.`);

// Check that Spotify environment variables are properly set.
if (!process.env.SPOTIFY_ID || !process.env.SPOTIFY_SECRET) throw new Error(`Spotify App credentials have not been set.`);

// Check that NODE_ENV is properly set.
if (process.env.NODE_ENV !== `dev` && process.env.NODE_ENV !== `prod`) throw new Error(`NODE_ENV is not properly set.`);

// Log header.
logHeader();

// Start the bot by creating the master process.
runMaster();
