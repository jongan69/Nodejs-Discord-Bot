const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('interview')
    .setDescription('Get Interviewed by AI!'),
  async execute(interaction) {
   
    const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Interview')
			.setStyle(ButtonStyle.Success);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel Interview')
			.setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

    const response = await interaction.reply({
			content: `Welcome to your interview! Would you like to proceed?`,
			components: [row],
		});
    
    const collectorFilter = i => i.user.id === interaction.user.id;
    console.log(collectorFilter)
    try {
      const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 3_600_000 });
      console.log(confirmation.customId)
      if (confirmation.customId === 'confirm') {
        await interaction.followUp({ content: 'This feature is in dev, thank you!', components: [] });
        // TO DO
        // 1. Insert Buttons for uploading PDF
        // 2. Parse PDF to String -> Find User Email for results
        // 3. Prompt Langchain with String using Google Search Tool for Relavent Interview Questions
        // A. Use Langchain to identify relavent industry
        // B. Use Google Search to find Top Industry Interview Questions
        // C. Prompt AI with followup research to act as interviewer for 5 questions
        // 4. Create Timed Loop for Answers
        // 5. Save Answers to Mongo DB
        // 6. End Interview
        await confirmation.update({ content: 'Interview cancelled', components: [] });
      } else if (confirmation.customId === 'cancel') {
		    await confirmation.update({ content: 'Interview cancelled', components: [] });
      }
      
    } catch (e) {
	   await interaction.editReply({ content: 'Your interview is now over', components: [] });
    }
  },
};