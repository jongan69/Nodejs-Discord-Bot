# Discord Bot

This is a Discord Bot written in JavaScript using [Discord.js](https://discord.js.org/) and [OpenAI](https://openai.com/).

## Requirements

- Node.js
- Discord.js
- OpenAI API

## Usage

The bot has several prefix commands for different AI features.

- `!` - AI Text
- `:art` - AI Image
- `:remix` - AI Image Variation
- `:resume` - AI PDF Resume Review

This bot also has a few slash commands:

## AI
/drink - An AI drink recipe

/turbo - use GPT-3.5-Turbo for responses

## Fun
/ping - Pong!

## Utility
/entropy - returns entropy from Real Random LLC API

/server - returns server information

/avatar - returns avatar image

## Moderation
/kick - Simulates a kick

/prune - delete up to 99 messages in a channel

/user - returns user information


## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file and add your Discord Bot secret and OpenAI API key
4. Run the bot with `node index.js`

## Configuration

The bot can be configured by editing the prefix variable in index.js, use `node deploy-commands.js` script to enable slash commands

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
