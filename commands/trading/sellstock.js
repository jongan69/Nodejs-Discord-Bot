const { SlashCommandBuilder } = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sellstock')
    .setDescription('Sells 1 share of given stock')
    .addStringOption(
      option => 
        option.setName('ticker')
        .setDescription('Stock Ticker to Sell')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const url = 'https://paper-api.alpaca.markets/v2/orders';
    const ticker = interaction.options.getString('ticker');

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
        symbol: ticker,
        qty: '1'
      })
    };
    
    let response = await fetch(url, options)
      .then((data) => data.json())
    if(response){
            return interaction.followUp(`Selling ${ticker} was submitted at ${response.submitted_at}, QTY: ${response.filled_qty}`);
    }
  },
};