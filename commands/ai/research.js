const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("langchain/llms/openai");
const { GoogleCustomSearch } = require("langchain/tools");
const { BufferMemory } = require("langchain/memory");
const {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} = require("langchain/prompts");
const { ConversationChain } = require("langchain/chains");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });

// const serpAPI = new SerpAPI(process.env.SERPAPI_API_KEY);

const searchTool = new GoogleCustomSearch({
  apiKey: process.env.GOOGLE_API_KEY,
  googleCSEId: process.env.GOOGLE_CSE_ID,
});

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "Research the following topics and return useful links, documentation, explanations and code examples. Make sure the links are valid."
  ),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{info}"),
]);


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
    
    const researchchain = new ConversationChain({
      llm: model,
      prompt: chatPrompt,
      memory: new BufferMemory({ memoryKey: "history" }),
      tools: [searchTool]
    });
    
    const researchresponse = await researchchain.call({ info: prompt });
    const sections = await splitter.createDocuments([researchresponse.response]);
    
    sections.forEach((item) => {
      console.log('Research', item)
      interaction.editReply(`Research Found for ${item.pageContent}`);
    })
  },
};