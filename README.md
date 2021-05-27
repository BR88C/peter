<h1 align="center">Peter!</h1>

<h1 align="center">
    <img src="https://raw.githubusercontent.com/BR88C/peter/master/assets/avatar/peter.png" align="center" width="256" height="256" style="border-radius: 50%;">
</h1>

<h3 align="center">A 24/7 music bot with free audio effects/filters (SFX)</h3>

<p align="center">
    <img src="https://img.shields.io/github/v/release/BR88C/peter?include_prereleases&style=for-the-badge&color=d65cff">
    <img src="https://img.shields.io/github/license/BR88C/peter?style=for-the-badge&color=fbedff">
    <img src="https://img.shields.io/github/checks-status/BR88C/peter/master?style=for-the-badge">
</p>

---

## Contribute
Make sure you have NodeJS and npm installed before continuing.

Fork the repository and clone it.
Navigate to the directory with `package.json` and install your node modules:
```
npm install
```
The bot also requires a Discord Bot token. In the same directory as `package.json`, create a file with the following text:
```
BOT_TOKEN="Your bot token"
DBL_TOKEN="Your DBL token"  // Optional
COOKIE=["Array of YouTube cookie strings"]  // Optional
YOUTUBE_IDENTITY_TOKEN=["Array of YouTube identity tokens"]  // Optional
```
and save the file as ".env"
You can then run the bot with:
```
npm start
```
