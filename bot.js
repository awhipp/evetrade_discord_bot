const Discord = require('discord.io');
const logger = require('winston');
const config = require('./config.json');
const https = require('https');

const run_every = 1; // minutes

const channel_id = config.channel_id;
const api_endpoint = config.api;

// Configure logger settings

let history = [];

logger.remove(logger.transports.Console);

logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
    token: config.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info(bot.username + ' - (' + bot.id + ')');
    console.log('Running...');
    
    get_data();
    
    setInterval(get_data, 1000 * 60 * run_every);
});

function round_value(value, amount) {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: amount, 
        maximumFractionDigits: amount
    });
}

const profitPerJumpThreshold = 300000;
const netProfitThreshold = 5000000;
const link = 'https://bit.ly/evetrade';

const process_json = (json) => {
    const messages = [];

    json.forEach(trade => {
        const profitPerJump = parseFloat(trade['Profit per Jump'].replace(/,/g, ''));
        const netProfit = parseFloat(trade['Net Profit'].replace(/,/g, ''));

        if (profitPerJump >= profitPerJumpThreshold || netProfit >= netProfitThreshold) {
            const item = trade['Item'];
            const from = trade['From']['name'];
            const to = trade['Take To']['name'];
            const roi = trade['ROI'];
            const jumps = trade['Jumps'];

            const message = `__${item}__ (${jumps} jumps)\n` + 
            `From: ${from}\nTo: ${to}\n\n` +
            `**Profit per Jump: ${round_value(profitPerJump)} ISK**\n` +
            `**Net Profit: ${round_value(netProfit)} ISK**\n\n` +
            `ROI: ${round_value(parseFloat(roi))}% \n` +
            `EVE Trade Validation Link: ${link}\n`;

            if (history.indexOf(message) == -1) {
                messages.push(message);
            }
        }
    });
        
    if (messages.length > 0) {
        return messages;
    } 

    return '';
};

const get_request = (url) => {
    const options = {
        headers: {
            'User-Agent': 'evetrade-finder-discord-bot'
        }
    };
    
    return new Promise((resolve, reject) => {
        const req = https.get(url, options, res => {
            let rawData = '';
            
            res.on('data', chunk => {
                rawData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const json = JSON.parse(rawData);
                    resolve(
                        process_json(json)
                    );
                } catch (err) {
                    console.log(`Error parsing JSON: ${err}`);
                    reject(new Error(err));
                }
            });
        });
        
        req.on('error', err => {
            reject(new Error(err));
        });
    });
}

const JITA =    '10000002:60003760';
const AMARR =   '10000043:60008494';
const RENS =    '10000032:60011866';
const HEK =     '10000030:60004588';
const DODIXIE = '10000042:60005686';

const maxWeight = 34000;
const minProfit = 250000;
const ROI = 0.04;

const get_trades = () => {
    const URL = `${api_endpoint}?` +
        `from=${JITA},${AMARR},${RENS},${HEK},${DODIXIE}` +
        `&to=${JITA},${AMARR},${RENS},${HEK},${DODIXIE}` +
        `&maxBudget=9007199254740991` + 
        `&maxWeight=${maxWeight}` +
        `&minProfit=${minProfit}` +
        `&minROI=${ROI}` +
        `&routeSafety=secure` +
        `&systemSecurity=high_sec` +
        `&tax=0.08`;

    return get_request(URL);
}

const get_data = () => {
    const outro = `\nNote: I am a bot (in BETA). Please validate your trades with the link above.\n----`;

    get_trades().then(data => {
        const dt = new Date().toISOString();

        if (data.length > 0) {
            const intro = `- **${dt}**\nNew Trade Deal Found (Capacity under 34,000 m3):\n\n`;
    
            logger.info(`Message sent to channel (${channel_id}) at ${dt}`);
            data.forEach(message => {
                bot.sendMessage({
                    to: channel_id,
                    message: intro + message + outro
                });
                history.push(message);
            });
        } else {
            logger.info(`Message NOT sent to channel (${channel_id}) at ${dt}`);
        }
    });
};