const { SlashCommandBuilder } = require('discord.js');
const { TwitterApi } = require('twitter-api-v2');

const twitterUserConfig = {
  appKey: process.env.TWITTER_API_KEY ?? '',
  appSecret: process.env.TWITTER_API_SECRET ?? '',
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
};

const userClient = new TwitterApi(twitterUserConfig);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tweet')
    .setDescription('Send a Tweet!')
    .addStringOption(
      option =>
        option.setName('tweet')
          .setDescription('Text to send to twitter')
          .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const tweet = interaction.options.getString('tweet');
    const postTweet = await userClient.v1.tweet(tweet);
    if (postTweet) {
      console.log('Tweet', postTweet.full_text)
      return await interaction.followUp(`Tweet Posted: ${JSON.stringify(postTweet.full_text)} at https://twitter.com/${postTweet.user.screen_name}`);
    }
  },
};