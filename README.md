# EVE Trade Finder Discord Bot

A bot which routinely checks for profitable trades between EVE Online Trade Hubs, and posts them to a channel.

Part of the greater [EVETrade](https://github.com/awhipp/evetrade) ecosystem.

## Installation

* NPM
* NPM dependencies: `npm install`
* Addition dependencies: `npm install https://github.com/woor/discord.io/tarball/gateway_v6`
* Add config.json
* Run `node bot.js`


### Config JSON Example

```json
{
    "token": "<DISCORD BOT TOKEN>",
    "alpha_channel": {
        "channel_id": "<CHANNEL ID>",
        "max_weight": 34000,
        "min_weight": 0,
        "profit_per_jump": 300000,
        "min_profit": 5000000,
        "link": "<LINK TO TRADE>"
    },
    "api": "<API LINK>",
}
```