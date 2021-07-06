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
- [Node.js](https://nodejs.org/en/download/) `v14+`
- [NPM](https://www.npmjs.com/get-npm) `v7.x` (Normally bundled with Node)
- [Java](https://adoptopenjdk.net/) `v13`
- [Lavalink](https://github.com/freyacodes/Lavalink) Dev branch

## Contribute
Fork the repository and clone it.

Navigate to the directory with `package.json` and install your node modules:
```
npm i --also=dev
```

The bot also requires some sensitive variables, stored in a `.env` file. In the same directory as `package.json`, create a file named `.env` with the following text:
```
BOT_TOKEN="<Your Discord API Bot Token>"
NODE_ENV="<prod or dev>" // Optional; use this if you aren't setting your environment via a different method. The bot will default to "dev" if NODE_ENV isn't found.
DBL_TOKEN="<Your DBL token>"  // Optional.
```

Create a directory called `lavalink`. Copy your `Lavalink.jar` and paste it into the `lavalink` directory. Then, create an `application.yml` and set it's appropriate values (Example [here](https://github.com/freyacodes/Lavalink/blob/dev/LavalinkServer/application.yml.example)). The bot will automatically read `application.yml`, so you will not have to set any configuration values.

Then build the bot:
```
npm run build
```

You can now start the bot with the following command:
```
npm run start
```
