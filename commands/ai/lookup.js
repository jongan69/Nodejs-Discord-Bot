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

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1500, chunkOverlap: 0 });

const Lookupprompt = new PromptTemplate({
  template: "Format and Summarize {input} and include references and links. Make sure all sentences are complete",
  inputVariables: ["input"],
});

const customSearch = new GoogleCustomSearch({
    apiKey: process.env.GOOGLE_API_KEY,
    googleCSEId: process.env.GOOGLE_CSE_ID,
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
    const lookupprompt = interaction.options.getString('prompt');
    const searchresult = await customSearch.call({ input: lookupprompt });

    console.log('search', searchresult)
    const chunkSize = 1500;
    for (let i = 0; i < searchresult.length; i += chunkSize) {
      const chunk = searchresult.slice(i, i + chunkSize);
      interaction.followUp(`Google Search Results: ${chunk}, AI is formatting and Summarizing...`);
    }
    
    const lookupchain = new LLMChain({
      llm: model,
      prompt: Lookupprompt
    });
    
    const lookupresponse = await lookupchain.call({ input: searchresult });
    console.log('lookup', lookupresponse)

    const sections = await splitter.createDocuments([lookupresponse.text]);
    sections.forEach((item) => {
      interaction.followUp(`${item.pageContent}`);
    })
  },
};