const { SlashCommandBuilder } = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Replies with Account Balance Info'),
  async execute(interaction) {
    await interaction.deferReply();
    const url = 'https://paper-api.alpaca.markets/v2/account';

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'APCA-API-KEY-ID': process.env.ALPACA_PAPER_KEY,
        'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY
      },
    };
    
    let response = await fetch(url, options)
      .then((data) => data.json())
    if(response){
      interaction.followUp(`Cash: ${JSON.stringify(response.cash)}`);
      interaction.followUp(`Buying Power: ${JSON.stringify(response.buying_power)}`);
      interaction.followUp(`Account Value: ${JSON.stringify(response.portfolio_value)}`);
    }
  },
};