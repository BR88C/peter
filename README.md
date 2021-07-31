<h1 align="center">Peter!</h1>

<div align="center">
    <img src="https://raw.githubusercontent.com/BR88C/peter/master/assets/avatar/peter_transparent.png" align="center" width="256" height="256">
</div>

<h3 align="center">A 24/7 music bot with free audio effects/filters (SFX)</h3>

<p align="center">
    <a href="https://github.com/BR88C/peter/releases"><img src="https://img.shields.io/github/v/release/BR88C/peter?include_prereleases&style=for-the-badge&color=d65cff"></a>
    <a href="https://github.com/BR88C/peter/blob/master/LICENSE"><img src="https://img.shields.io/github/license/BR88C/peter?style=for-the-badge&color=fbedff"></a>
    <a href="https://github.com/BR88C/peter/actions"><img src="https://img.shields.io/github/workflow/status/BR88C/peter/Build%20Test/master?style=for-the-badge"></a>
</p>

---

## Prerequisites
You must have the following installed to test your changes.
- [Node.js](https://nodejs.org/en/download/) `v16.x`
- [NPM](https://www.npmjs.com/get-npm) `v7.x` (Normally bundled with Node)
- [Java](https://adoptopenjdk.net/) `v13.x`
- [Lavalink](https://github.com/freyacodes/Lavalink) `Latest Dev`
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) `v5.0.x`

## Contribute
Fork the repository and clone it.

Navigate to the directory with `package.json` and install your node modules:
```
npm i --also=dev
```

The bot also requires some sensitive variables, stored in a `.env` file. In the same directory as `package.json`, create a file named `.env` with the following text:
```
BOT_TOKEN="<Your Discord API Bot Token>"
LAVALINK_PASSWORDS=["<Lavalink server passwords>"...]
SPOTIFY_ID="<Your Spotify App ID>"
SPOTIFY_SECRET="<Your Spotify App Secret>"
NODE_ENV="<prod or dev>" // Optional; use this if you aren't setting your environment via a different method. The bot will default to "dev" if NODE_ENV isn't found.
TOPGG_TOKEN="<Your Top.gg token>" // Optional.
```

Then build the bot:
```
npm run build
```

Make sure to start the Lavalink server. You can then start the bot with the following command:
```
npm run start
```
