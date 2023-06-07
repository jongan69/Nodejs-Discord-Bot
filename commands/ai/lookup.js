const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("langchain/llms/openai");
const { GoogleCustomSearch } = require("langchain/tools");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });

const searchTool = new GoogleCustomSearch({
  apiKey: process.env.GOOGLE_API_KEY,
  googleCSEId: process.env.GOOGLE_CSE_ID,
});

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

const LookupPromptTemplate = "Lookup {lookupInfo}"

const LookupPrompt = new PromptTemplate({
  template: LookupPromptTemplate,
  inputVariables: ["lookupInfo"],
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lookup')
    .setDescription('Use AI to Browse the internet!')
    .addStringOption(
      option =>
        option.setName('prompt')
          .setDescription('Information used for lookup')
          .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const prompt = interaction.options.getString('prompt');
    
    const lookupchain = new LLMChain({
      llm: model,
      prompt: LookupPrompt,
      tools: [searchTool]
    });
    
    const lookupresponse = await lookupchain.call({ lookupInfo: prompt });
    console.log('lookup', lookupresponse)

    const sections = await splitter.createDocuments([lookupresponse.text]);
    sections.forEach((item) => {
      interaction.editReply(`${item.pageContent}`);
    })
  },
};