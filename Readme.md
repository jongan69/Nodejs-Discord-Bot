# Discord Bot

This is a Discord Bot written in JavaScript using [Discord.js](https://discord.js.org/) and [OpenAI](https://openai.com/).

## Requirements

- Node.js
- Discord.js
- OpenAI API
- LangChain
- Google Search
- PDFjs-Dist
- RAKE
- ALPACA API

## Usage

The bot has several prefix commands for different AI features.

- `!` - AI Text with Memory Buffer (100 messages)
- `:art` - AI Image
- `:remix` - AI Image Variation
- `:resume` - AI PDF Resume Review
- `:research` - AI Google Search Message Research

This bot also has a few slash commands:


## AI // Langchain
/drink - An AI drink recipe

/turbo - use GPT-3.5-Turbo for responses

/research - Prompt Langchain LLM Research using Google Search

/interview - `In Dev:` Using AI with Resumes to simulate an Interview

/lookup - Research Given Information in Google and use AI to Summarize findings

/browse - Summarize information from a URL 


## Fun
/ping - Pong!

/tweet - Tweet using discord


## Utility
/entropy - returns entropy from Real Random LLC API

/server - returns server information

/avatar - returns avatar image

/allethnfts - returns all Ethereum NFTs using Alchemy SDK

/bitcoinaddress - returns Bitcoin Address Balance using https://blockchain.info


## Moderation
/kick - Simulates a kick

/prune - delete up to 99 messages in a channel

/user - returns user information


## Trading
/buystock - Buy a single share of stock using Alpaca API

/buybitcoin - Buy a single Bitcoin using Alpaca API

/sellstock - Sell a single share of stock using Alpaca API

/sellbitcoin - Sell a single Bitcoin using Alpaca API

/balance - Returns Alpaca API Account Balances

/list - Returns all Open Positions and P/L


## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file and add your Discord Bot secret and Other API Keys:
- ALCHEMY_APP_API_KEY
- ALPACA_PAPER_KEY
- GOOGLE_API_KEY
- GOOGLE_CSE_ID
- OPENAI_API_KEY
- TWITTER_ACCESS_SECRET
- TWITTER_ACCESS_TOKEN
- TWITTER_API_KEY
- TWITTER_API_SECRET
4. Deploy Slash Commands with `node deploy-commands.js`
5. Run the bot with `node index.js`

## Configuration

The bot can be configured by editing the prefix variable in index.js, in order to use `node deploy-commands.js` script to enable slash command auto completion you must have a `config.json` in project root with:

```
{
  "token": "DISCORD_BOT_SECRET",
  "clientId": "BOT_CLIENT_ID",
  "guildId": "DISCORD_SERVER_ID"
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.