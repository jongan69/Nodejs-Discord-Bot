const { SlashCommandBuilder } = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bitcoinaddress')
    .setDescription('Look up how much bitcoin an address has')
  	.addStringOption(
      option => 
        option.setName('address')
        .setDescription('Address To Query Block Explorer With')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const address = interaction.options.getString('address');
    const url = `https://blockchain.info/balance?active=${address}`
    if(address.length !== 0) {
      
    let response = await fetch(url, { method: "GET" })
      .then((data) => data.json())

    if(response){
      console.log('Bitcoin Balance:', response)
        return interaction.followUp(`Address Balance: ${response[address].final_balance}`);
      }
    } else {
       return interaction.followUp(`Address can not be empty`);
    }
  },
};