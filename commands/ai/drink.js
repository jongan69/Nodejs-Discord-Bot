const { SlashCommandBuilder } = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('drink')
    .setDescription('replies with a drink recipe'),
  async execute(interaction) {
    await interaction.deferReply();
    const url = 'https://api.openai.com/v1/chat/completions'
    let response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "user", content: `Return a drink recipe` }
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
      return interaction.followUp(`${response.choices[0].message.content}`);
    }
  },
};