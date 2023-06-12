const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("langchain/llms/openai");
const { WebBrowser } = require("langchain/tools/webbrowser");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });

const browser = new WebBrowser({ model });

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('browse')
    .setDescription('Researches given URL')
    .addStringOption(
      option =>
        option.setName('url')
          .setDescription('The Link you need researched')
          .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const prompt = interaction.options.getString('url');
    const browseresult = await browser.call(prompt);
    interaction.followUp(`${browseresult}`);    
  },
};