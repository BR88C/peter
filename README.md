<h1 align="center">Peter!</h1>

<h1 align="center">
    <img src="https://raw.githubusercontent.com/BR88C/peter/master/src/assets/images/peter%20cropped.png" align="center" width="256" height="256" />
</h1>

<h3 align="center">A 24/7 music bot with free audio effects/filters (SFX)</h3>

<p align="center">
    <img src="https://img.shields.io/github/v/release/BR88C/peter?include_prereleases&style=for-the-badge&color=d65cff">
    <img src="https://img.shields.io/github/license/BR88C/peter?style=for-the-badge&color=fbedff">
</p>

---

## Contribute
Make sure you have NodeJS and npm installed before continuing.

Fork the repository and clone it.
Navigate to the directory with index.js and install your node modules:
```
npm install
```
The bot also requires a Discord Bot token and a cookie header from youtube. In the same directory as index.js, create a file with the following text:
```
BOT_TOKEN="your_bot_token"
DBL_TOKEN="your_dbl_token" (This is optional, not defining it will just give you a warning)
COOKIE="SID=xxx; HSID=xxx; SSID=xxxx;" (Paste your cookie string from youtube)
```
and save the file as ".env"
You can then run the bot with:
```
npm start
```
