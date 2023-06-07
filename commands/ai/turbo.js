const { SlashCommandBuilder } = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('turbo')
    .setDescription('Prompt GPT Turbo')
  	.addStringOption(
      option => 
        option.setName('prompt')
        .setDescription('Information for Turbo')
        .setRequired(true)),
  async execute(interaction) {
    const url = 'https://api.openai.com/v1/chat/completions'
    await interaction.deferReply();
    const prompt = interaction.options.getString('prompt');
    if(prompt.length !== 0) {
      let response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "user", content: `${prompt}` }
            ],
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 200,
            stream: false,
            n: 1,
          }),
    }).then((data) => data.json())
      if(response){
        console.log('prompt', response.choices[0].message)
        return interaction.followUp(`GPT-Turbo: ${response.choices[0].message.content}`);
      }
    } else {
       return interaction.followUp(`Prompt can not be empty`);
    }
  },
};