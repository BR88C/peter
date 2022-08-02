import { Lavalink } from './Lavalink';

import { Constants } from '../utils/Constants';

import { ClientManager as CM } from '@br88c/distype-boilerplate';
import { PlayerState } from '@distype/lavalink';
import { Point } from '@influxdata/influxdb-client';
import { resolve } from 'node:path';

export class ClientManager extends CM {
    constructor () {
        super(
            process.env.BOT_TOKEN!,
            [
                {
                    token: process.env.BOT_TOKEN!,
                    replacement: `%bot_token%`
                },
                {
                    token: process.env.INFLUX_TOKEN!,
                    replacement: `%influx_token%`
                },
                {
                    token: process.env.LAVALINK_PASSWORD!,
                    replacement: `%lavalink_password%`
                },
                {
                    token: process.env.TOPGG_TOKEN?.length ? process.env.TOPGG_TOKEN : `%topgg_token%`,
                    replacement: `%topgg_token%`
                }
            ],
            {
                influxDB: {
                    application: `peter`,
                    bucket: process.env.INFLUX_BUCKET!,
                    org: process.env.INFLUX_ORG!,
                    token: process.env.INFLUX_TOKEN!,
                    url: process.env.INFLUX_URL!,
                    reportInterval: 10000
                },
                topgg: process.env.TOPGG_TOKEN?.length ? {
                    postShards: true,
                    reportInterval: 1800000
                } : undefined
            },
            {
                cache: {
                    channels: [`name`, `permission_overwrites`, `type`],
                    guilds: [`owner_id`, `roles`, `unavailable`],
                    members: [`communication_disabled_until`, `roles`],
                    roles: [`permissions`],
                    voiceStates: [`channel_id`]
                },
                gateway: { intents: [`GUILDS`, `GUILD_VOICE_STATES`] }
            }
        );

        this.lavalink = new Lavalink(
            this,
            {
                clientName: `peter@${process.env.npm_package_version ?? `0.0.0`}`,
                nodeOptions: [
                    {
                        location: {
                            host: process.env.LAVALINK_HOST!,
                            port: parseInt(process.env.LAVALINK_PORT!),
                            secure: process.env.LAVALINK_SECURE! === `true`
                        },
                        password: process.env.LAVALINK_PASSWORD!
                    }
                ]
            },
            this.logger.log,
            this.logger
        );

        this.metrics.setInfluxDBCallback(() => {
            const lavalinkPoints: Point[] = [];
            this.lavalink.nodes.forEach((node) => {
                lavalinkPoints.push(
                    new Point(`lavalinkNode`)
                        .tag(`id`, `${node.id}`)
                        .floatField(`cpu`, node.stats.cpu.lavalinkLoad)
                        .intField(`memory`, node.stats.memory.used)
                        .intField(`players`, node.stats.players)
                        .intField(`activePlayers`, node.stats.playingPlayers)
                );
            });

            return lavalinkPoints;
        });
    }

    public override async init (): Promise<void> {
        this.gateway.on(`VOICE_STATE_UPDATE`, ({ d }) => {
            if (!d.guild_id) return;

            const player = this.lavalink.players.get(d.guild_id);
            if (!player || player.state === PlayerState.DISCONNECTED) return;

            const channelStates = this.cache.voiceStates?.get(d.guild_id)?.filter((voiceState) => voiceState.channel_id === player.voiceChannel && voiceState.user_id !== this.gateway.user?.id);

            if (!player.twentyfourseven && (channelStates?.size ?? 0) === 0) {
                if (!player.voiceTimeout) {
                    player.voiceTimeout = setTimeout(() => {
                        player.destroy(`No active users in the voice channel`);
                    }, Constants.VOICE_TIMEOUT).unref();
                }
            } else if (player.voiceTimeout) {
                clearTimeout(player.voiceTimeout);
                player.voiceTimeout = null;
            }
        });

        this.setErrorCallbacks(process.env.SUPPORT_SERVER);
        await super.init(resolve(__dirname, `../commands`), resolve(__dirname, `../contextcommands`));
        await this.lavalink.spawnNodes();
    }
}
