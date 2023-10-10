const { Message, Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ 
    intents: [
        GatewayIntentBits.guilds,          // To access information about servers (guilds)
        GatewayIntentBits.guild_messages,   // To access message events
      // Add other intents as needed
    ]
  });
  
const prefix = '.';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag} (ID: ${client.user.id})`);
    console.log('------');
});

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'calc') {
        try {
            const result = eval(args.join(' '));
            await message.channel.send(`**${result}**`);
        } catch {
            await message.channel.send('Invalid expr');
        }
    } else if (command === 'help') {
        const commandList = client.commands;
        const sortedCommands = commandList.keyArray().sort();
        const response = `**H X C K E R  C R Y P T O  B O T x1.5**\n\n${sortedCommands.join(', ')}`;
        await message.channel.send(response);
    } else if (command === 'getltcbal') {
        const ltcaddress = args[0];

        try {
            const response = await axios.get(`https://api.blockcypher.com/v1/ltc/main/addrs/${ltcaddress}/balance`);
            const data = response.data;
            const balance = data.balance / 10**8;
            const total_balance = data.total_received / 10**8;
            const unconfirmed_balance = data.unconfirmed_balance / 10**8;

            const cgResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
            const usd_price = cgResponse.data.litecoin.usd;

            const usd_balance = balance * usd_price;
            const usd_total_balance = total_balance * usd_price;
            const usd_unconfirmed_balance = unconfirmed_balance * usd_price;

            const message = `LTC Address: \`${ltcaddress}\`\nCurrent LTC: **$${usd_balance.toFixed(2)} USD**\nTotal LTC Received: **$${usd_total_balance.toFixed(2)} USD**\nUnconfirmed LTC: **$${usd_unconfirmed_balance.toFixed(2)} USD**`;

            const responseMessage = await message.channel.send(message);

            await sleep(60000); // Sleep for 60 seconds
            await responseMessage.delete();
        } catch {
            await message.channel.send('Failed to retrieve balance. Please check the Litecoin address.');
        }
    } else if (command === 'getbtcbal') {
        const btcaddress = args[0];

        try {
            const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${btcaddress}/balance`);
            const data = response.data;
            const balance = data.balance / 10**8;
            const total_balance = data.total_received / 10**8;
            const unconfirmed_balance = data.unconfirmed_balance / 10**8;

            const cgResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
            const usd_price = cgResponse.data.bitcoin.usd;

            const usd_balance = balance * usd_price;
            const usd_total_balance = total_balance * usd_price;
            const usd_unconfirmed_balance = unconfirmed_balance * usd_price;

            const message = `BTC Address: \`${btcaddress}\`\nCurrent BTC: **$${usd_balance.toFixed(2)} USD**\nTotal BTC Received: **$${usd_total_balance.toFixed(2)} USD**\nUnconfirmed BTC: **$${usd_unconfirmed_balance.toFixed(2)} USD**`;

            const responseMessage = await message.channel.send(message);

            await sleep(60000); // Sleep for 60 seconds
            await responseMessage.delete();
        } catch {
            await message.channel.send('Failed to retrieve balance. Please check the Bitcoin address.');
        }
    } else if (command === 'ltc') {
        await message.channel.send('ltc1qs2l6s5ynn8nuhsnk2k7wfwkw7vl9d0heqxwwlg');
    } else if (command === 'addy') {
        const response = `
<:4727_Litecoin:1134050418020847646> **Litecoin address (LTC)** : ltc1qs2l6s5ynn8nuhsnk2k7wfwkw7vl9d0heqxwwlg
<:3712bitcoin:1134050588682883133> **Bitcoin address (BTC)**: bc1q86z72t8rqstaxwq5h7kyh8sgh6rrlu6zqek3nh
<:7675ethereum:1134050892010766346> **Ethereum address (ETH)**: 0x94e3aEDE7C22CDB581340fC7C6cE2306E4Dc6a67
`;
        await message.channel.send(response);
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.login(process.env.token);
