const keep_alive = require('./keep_alive.js');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const { Configuration, OpenAIApi } = require("openai");
const fetch = require("node-fetch");

// PDFjs
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const fs = require('fs');
const path = require('node:path');

// PDFjs Service Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `pdfjs-dist/legacy/build/pdf.worker`;

// Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

// Test Command
client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith("Test")) return;
  try {
    msg.channel.send(`The bot is active!`)
  } catch (err) {
    msg.channel.send(`${err}`)
  }
});

// Howcool
client.on('messageCreate', msg => {
  let mention = msg.mentions.users.first();
  let args = msg.content.includes("howcool");
  if (args && mention) {
    msg.channel.send(`${mention} is ${Math.floor(Math.random() * 100) + 1}% cool!`)
  } else if (args) {
    msg.channel.send(`You are ${Math.floor(Math.random() * 100) + 1}% cool!`)
  }
});

// Open AI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// command prefixes
const aitextprefix = "!";
const artaiprefix = ":art";
const imageaiprefix = ":remix";
const resumeprefix = ":resume";

// URL for OpenAI
const url = 'https://api.openai.com/v1/chat/completions'

// Slash Commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Events
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

// Welcome Message
client.on('messageCreate', msg => {
  let welcomeChannel = msg.channel.toString() == '<#736380654396244058>';
  let isNotNew = msg.member.roles.cache.some(r => ["Developer", "Admin", "Member"].includes(r.name));
  let isNotBot = msg.author.id != client.user.id;

  if (isNotBot && welcomeChannel && !isNotNew) {
    console.log(`A message was sent in Welcome: ${msg.channel}`)
    msg.channel.send(`Hey @${msg.author.username}, Welcome to the Server! My name is ${client.user}. 
    To use Open AI in here, start your message with "!" Followed by your prompt. 
    For Example:`);
    msg.channel.send(`! write a poem for @${msg.author.username}`);
  }
});

// AI Image
client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(artaiprefix)) return;
  const commandBody = msg.content.slice(artaiprefix.length);
  const args = commandBody.split(' ');

  try {

    const response = await openai.createImage({
      prompt: `${args}`,
      n: 1,
      size: "512x512",
      user: msg.author.username
    })

    let answers = response.data
    if (answers && answers.data[0].url) {
      msg.channel.send(`${answers.data[0].url}`)
    } else {
      msg.channel.send(`${JSON.stringify(response.data)}`)
    }

  } catch (err) {
    msg.channel.send(`${err}`)
  }
});

// AI Image Variation
client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(imageaiprefix)) return;
  const commandBody = msg.content.slice(imageaiprefix.length);
  const args = commandBody.split(' ');
  let recievedImages = msg.attachments
  let attachment = recievedImages.first();

  if (attachment.length > 0) {
    try {
      const response = await openai.createImageVariation({
        image: attachment,
        n: 1,
        size: '512x512',
        response_format: 'url'
      })

      let answers = response?.data
      if (answers) {
        answers?.forEach((item) => {
          msg.channel.send(`${item.url}`)
        })
      }
    } catch (err) {
      msg.channel.send(`Something Happened!: ${err}`)
    }
  } else {
    msg.channel.send('Waiting for Image Upload');
  }
});

// AI Text
client.on('messageCreate', async msg => {
  if (!msg.content.startsWith(aitextprefix)) return;
  const commandBody = msg.content.slice(aitextprefix.length);
  const args = commandBody.split(' ');
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${args}`,
      max_tokens: 2048,
      temperature: 0.8,
    })

    let answers = response.data.choices
    if (answers) {
      answers.forEach((item) => {
        msg.channel.send(`${item.text}`)
      })
    } else {
      console.warn(response)
    }
  } catch (err) {
    msg.channel.send(`${err}`)
  }
});

function attachIsPDF(msgAttach) {
  return msgAttach.indexOf("pdf", msgAttach.length - "pdf".length /*or 3*/) !== -1;
}

// Resume Review Command
client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(resumeprefix)) return;

  let recievedResume = msg.attachments
  let file = recievedResume.first();
  let resume = file.attachment
  let resumetext;
  try {
    if (attachIsPDF(resume)) {
      // Load the PDF document
      var loadingTask = pdfjsLib.getDocument(resume);

      loadingTask.promise.then(function(pdf) {
        console.log('PDF loaded', pdf.numPages);
        var maxPages = pdf.numPages;
        var countPromises = []; // collecting all page promises

        for (var j = 1; j <= maxPages; j++) {
          var page = pdf.getPage(j);
          var txt = "";

          countPromises.push(page.then(function(page) { // add page promise
            var textContent = page.getTextContent();
            return textContent.then(function(text) { // return content promise
              return text.items.map(function(s) { return s.str; }).join(''); // value page text 
            });
          }));
        }

        // Wait for all pages and join text
        return Promise.all(countPromises).then(async function(texts) {
          console.log(texts)
          resumetext = texts

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                { role: "user", content: `Review and Critique this resume: ${resumetext}` }
              ],
              temperature: 0.7,
              top_p: 1,
              frequency_penalty: 0,
              presence_penalty: 0,
              max_tokens: 200,
              stream: false,
              n: 1,
            }),
          });

          const json = await response.json();
          let answers = json.choices;

          if (answers) {
            answers.forEach((item) => {
              msg.channel.send(`RESUME REVIEW: ${item.message.content}`)
            })
          }
        });
      });
    } else {
      msg.channel.send(`File must be PDF`)
    }
  } catch (err) {
    msg.channel.send(`${err}`)
  }
});

// Ready Message
client.once('ready', () => {
  console.log('Ready!');
});

client.login(process.env.DISCORD_BOT_SECRET);