const { SlashCommandBuilder } = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sellbitcoin')
    .setDescription('sell 1 Bitcoin at current price'),
  async execute(interaction) {
    await interaction.deferReply();
    const url = 'https://paper-api.alpaca.markets/v2/orders';

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'APCA-API-KEY-ID': process.env.ALPACA_PAPER_KEY,
        'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY
      },
      body: JSON.stringify({
        side: 'sell',
        type: 'market',
        time_in_force: 'gtc',
        extended_hours: false,
        symbol: 'BTC/USD',
        qty: '1'
      })
    };
    
    let response = await fetch(url, options)
      .then((data) => data.json())
    if(response){
      return interaction.followUp(`Selling 1 Bitcoin was submitted at ${response.submitted_at}`);
    }
  },
};