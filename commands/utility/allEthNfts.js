const { SlashCommandBuilder } = require('discord.js');
const { Alchemy, Network } =  require("alchemy-sdk");

const config = {
  apiKey: process.env.ALCHEMY_APP_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('allethnfts')
    .setDescription('Look up all Eth NFTs in an address')
  	.addStringOption(
      option => 
        option.setName('address')
        .setDescription('Address To Query Alchemy With')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const address = interaction.options.getString('address');
    const nfts = await alchemy.nft.getNftsForOwner(address);
    console.log(nfts.ownedNfts[0].contract)
    if(nfts){
      nfts.ownedNfts.forEach((nft, index) => {
        return interaction.followUp(`NFT ${index}: ${nft.contract.openSea.collectionName} ${nft.contract.openSea.imageUrl}`);
      })
    } else {
      return interaction.followUp(`No NFTs Found`);
    }
  },
};