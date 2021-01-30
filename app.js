const path =require('path')
const fs = require('fs');
const Discord = require('discord.js');
const token = require("./token.js");
const client = new Discord.Client();
const welcome =require('./welcome');
const command = require('./command');
const roleClaim = require('./role-claim');
const poll = require('./poll');
const advancedPolls = require('./advanced-polls');
const memberCount =require('./counters/member-counter')
const { badwords } = require("./data.json") 
const antiSpam =require("./anti-spam")
const { prefix, bot_age, words_array, bot_info, } =require('./Config.json')

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
  require(`./handlers/${handler}`)(client, Discord);
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  welcome(client)
  roleClaim(client)
  poll(client)
  advancedPolls(client)
  memberCount(client)
  antiSpam(client)

  const baseFile = 'command-base.js'
  const commandBase = require(`./commands/${baseFile}`)

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file))
        commandBase(client, option)
      }
    }
  }

  readCommands('commands')
});

client.on('guildMemberAdd', guildMember =>{
  let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'Member');

  guildMember.roles.add(welcomeRole);
});

command(client, 'members', (message) => {
  client.guilds.cache.forEach((guild) => {
    message.channel.send(
      `${guild.name} has a total of ${guild.memberCount} members`
    )
  })
})

client.on('message', msg => {
  if (msg.content === `hi`) {
    msg.channel.send('Hi!')
  }
});

client.on('message', msg => {
  if (msg.content === `js!sdasa`) {
    msg.channel.send('<@755810994739085414>')
  }
});

command(client, 'status', (message) => {
  const content = message.content.replace('js!status ', '')
  
  client.user.setPresence({
    activity: {
      name: content,
      type: 'WATCHING',
    },
  })
})

client.login(token);