const Discord = require('discord.js');
const Client = require('./client/client');
const client = new Client();
const roles= require('./roles/roles')
const eventLoop = require('./events/event_loop');
const fs = require('fs');
const {
    prefix,
    botToken,
} = require('./config.json');
var moment = require('moment-timezone'); // require



client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const {
    promisify
} = require('util')

var s0 = new Array()

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const eventsAdapter = new FileSync('./db/events_db.json')
const eventsDB = low(eventsAdapter)

eventsDB.defaults({
        events: [],
        allowed_users: [],
        announcement_channels: [],
    })
    .write()
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}



client.once('disconnect', () => {
    console.log('Disconnected from Discord!!!');
});

client.once('reconnecting', () => {
    console.log('Lost connection to Discord. Reconnecting....');
});

client.once('ready', () => {
    console.log(' ____________\n<____________>\n|            |\n|            |\n|            |\n \\          / \n  \\________/ \n      ||\n      ||\n      ||\n      ||\n   ___||___ \n  /   ||   \\ \n  \\________/ \n');
    console.log('Tender has began serving drinks!');
    roles(client);
    setInterval(function () {
        eventLoop();
    }, 60000);
});

client.on('message', message => {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    try {
        if (commandName == 'createevent') {
            command.execute(message, client);
        } else if (commandName == 'allowevents') {
            command.execute(message, client);
        } else {
            command.execute(message, client);
        }
    } catch (error) {
        console.log(error);
        message.reply('There was an issue processing that command! Please contact your admin.')
    }
});


client.login(botToken);