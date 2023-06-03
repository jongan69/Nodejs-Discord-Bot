# Discord Bot

This is a Discord Bot written in JavaScript using [Discord.js](https://discord.js.org/) and [OpenAI](https://openai.com/).

# Arti Bot

Arti Bot is a discord bot built with the Discord.js library. It uses OpenAI's API to generate 
AI-generated text and images in response to user prompts. 

## Requirements

- Node.js
- Discord.js
- OpenAI API

## Usage

The bot has several prefix commands for different AI features.

- `?` - AI Text
- `!` - AI Text Open
- `:` - AI Image
- `-` - AI Blog Posts
- `:tweet` - AI Image Tweet
- `:image` - AI Image Variation

Examples:

- `? write a poem for @username`
- `! write a short story`
- `: generate an image of a flower`
- `- create a blog post about recycling`
- `:tweet create a tweet about the environment`
- `:image upload an image of a landscape`

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file and add your Discord Bot secret and OpenAI API key
4. Run the bot with `node index.js`

## Configuration

The bot can be configured by editing the prefix variable in index.js.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
