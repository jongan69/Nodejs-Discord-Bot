const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("langchain/llms/openai");
const { GoogleCustomSearch } = require("langchain/tools");
const { BufferWindowMemory } = require("langchain/memory");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });
const researchmemory = new BufferWindowMemory({ k: 100 });
const searchTool = new GoogleCustomSearch({
  apiKey: process.env.GOOGLE_API_KEY,
  googleCSEId: process.env.GOOGLE_CSE_ID,
});

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

const ResearchPromptTemplate = "Research {researchInfo} and return useful links, documentation, explanations and examples. Summarize the findings in bullet points."

const ResearchPrompt = new PromptTemplate({
  template: ResearchPromptTemplate,
  inputVariables: ["researchInfo"],
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('research')
    .setDescription('Does some research for you!')
    .addStringOption(
      option =>
        option.setName('prompt')
          .setDescription('Information used for research')
          .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const prompt = interaction.options.getString('prompt');
    
    const researchchain = new LLMChain({
      llm: model,
      prompt: ResearchPrompt,
      memory: researchmemory,
      tools: [searchTool]
    });
    
    const researchresponse = await researchchain.call({ researchInfo: prompt });
    console.log('Research', researchresponse)

    const sections = await splitter.createDocuments([researchresponse.text]);
    sections.forEach((item) => {
      interaction.editReply(`Research Found for ${item.pageContent}`);
    })
  },
};