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
    "token": "<DISCORD APP TOKEN>",
    "schedule": 15,
    "channels": [
        {
            "title": "<Descriptor (Not necessary)>",
            "channel_id": "<CHANNEL ID>",
            "min_weight": 0,
            "max_weight": 34000,
            "profit_per_jump": 500000,
            "link": "<LINK TO TRADE>"
        }
    ],
    "api": "<API ENDPOINT>"
}
```

### Running systemd service

* Update `ExecStart` in `discord-bot.service` to point at correct directory
* Move `discord-bot.service` to `/etc/systemd/system/`
* Reload Daemon: `sudo systemctl daemon-reload`
* Enable Service: `sudo systemctl enable discord-bot.service`
* Start Service: `sudo systemctl start discord-bot.service`
* View Logs: `journalctl -u discord-bot.service -f`
