const { SlashCommandBuilder } = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Replies with all open positions'),
  async execute(interaction) {
    await interaction.deferReply();
    const url = 'https://paper-api.alpaca.markets/v2/positions';

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
      return interaction.followUp(`${JSON.stringify(response)}`);
    }
  },
};