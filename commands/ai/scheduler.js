const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");
const fetch = require("node-fetch");
const { createEvent } = require("ics");
const moment = require('moment');

const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });

const CalenderFormatterPromptTemplate = `Given that right now is ${moment().toString()} and you are in charge of scheduling, use the event data below to create a valid JSON array of objects of a calender event following this format:
    "start": [Year, Month, Day, Hour, Minute],
    "duration": [hours, minutes],
    "title": "Bolder Boulder",
    "description": "Annual run in Boulder, Colorado",
    "location": "Folsom Field, University of Colorado (finish line)",
    "url": "http://www.bolderboulder.com/",
    "geo": [lat: 40.0095, lon: 105.2669 ],
    "categories": ["10k races", "Memorial Day Weekend", "Boulder CO"],
    "status": "CONFIRMED",
    "busyStatus": "BUSY",
                        The event Data:
                        {eventData}
                        The JSON object:`

const FormatterPrompt = new PromptTemplate({
  template: CalenderFormatterPromptTemplate,
  inputVariables: ["eventData"],
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scheduler')
    .setDescription('Create a Calender Event')
    .addStringOption(
      option =>
        option.setName('event')
          .setDescription('What do you want want to schedule and from what to what times will it be?')
          .setRequired(true)),
  async execute(interaction) {

    await interaction.deferReply();
    const eventData = interaction.options.getString('event');

    try {
      // Use Langchain to parse event data to return formatted calander variables
      const formatchain = new LLMChain({
        llm: model,
        prompt: FormatterPrompt,
      });

      const formatresponse = await formatchain.call({ eventData: eventData });

      let formattedEvent = JSON.parse(formatresponse.text);
      console.log('DATAS', formatresponse.text)

      const [year, month, day, hour, minute] = [...formattedEvent[0]?.start]
      const duration = formattedEvent[0]?.duration !== undefined
        ? { hours: formattedEvent[0]?.duration[0], minutes: formattedEvent[0]?.duration[1] }
        : { hours: 1, minutes: 30 }

      const title = formattedEvent[0]?.title ?? 'Event title'
      const description = formattedEvent[0]?.description ?? `Event Description`
      const location = formattedEvent[0]?.location ?? 'Event location'
      const url = formattedEvent[0]?.url?.length > 0 ? formattedEvent[0]?.url.toString() : 'https://github.com/jongan69'
      // console.log(`Event for ${startTime[1]}/${startTime[2]}/${startTime[0]} @ ${startTime[3]}:${startTime[4]}`)
      // console.log('start', startTime)
      console.log('spread', year, month, day, hour, minute)
      console.log('duration', duration)
      console.log('title', title)
      console.log('description', description)
      console.log('location', location)
      console.log('url', url)
      // if (title && start && end) {

      const event = {
        start: [year, month, day, hour, minute],
        duration,
        title,
        description,
        location,
        url,
      };

      createEvent(event, async (error, value) => {
        console.log('Calender Event', event, error)
        const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const file = new AttachmentBuilder(buffer, { name: 'event.ics' });
        if (file) {
          // console.log('Calender Event', file)
          return interaction.followUp({ files: [file] });
        }
      });


      // } else {
      //   return interaction.followUp(`Prompt can not be empty`);
      // }
    } catch (e) {
      return interaction.followUp(`Error: ${e.toString()}`);
    }
  },
};