const { SlashCommandBuilder } = require('discord.js');
const fetch = require("node-fetch");
const seedrandom = require("seedrandom");


module.exports = {
  data: new SlashCommandBuilder()
    .setName('entropy')
    .setDescription('replies with entropy'),
  async execute(interaction) {
    let entropy = await fetch("https://next-link-adapter.vercel.app/api/entropyAdapterComplete", {
    method: "GET"
  })
    .then((data) => data.json())
    const random = seedrandom(`${entropy.result.data_256}`).double();
    const randomRoll = Math.floor(random * 100) + 1;
    const diceRoll = Math.floor(random * 6) + 1;
    return interaction.reply(`
    Entropy Response: 
      Data 256: ${entropy.result.data_256}
      Data 512: ${entropy.result.data_512}
      Random 1-100 Number from Hash: ${randomRoll}
      Dice Roll from Hash: ${diceRoll}
    `);
  },
};