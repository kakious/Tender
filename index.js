const Discord = require('discord.js');
const Client = require('./client/client');
const roles = require('./roles/roles')
const loops = require('./loops/loop');
const PACKAGE = require('./package.json');
const audio = require('./audio/audio');
const db = require('./db/db');
const vrc = require('vrchat-client');
const fs = require('fs');

//const socket = io ("https://asset.uno.vrwubz.net/socket.io")

const {
    prefix,
    botToken,
    vrchatName,
    vrchatPass
} = require('./config.json');

var moment = require('moment-timezone'); // require

const client = new Client();

client.commands = new Discord.Collection();
const generalCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const vrChatCommandFiles = fs.readdirSync('./VRChat').filter(file => file.endsWith('.js'));

const {
    promisify
} = require('util')

var s0 = new Array()




for (const file of vrChatCommandFiles) {
    const command = require(`./VRChat/${file}`);
    client.commands.set(command.name, command);
}

for (const file of generalCommandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('disconnect', () => {
    console.log('Disconnected from Discord!!!');
});

client.once('reconnecting', () => {
    console.log('Lost connection to Discord. Reconnecting....');
});

db(client);
audio(client);

vrc.login(vrchatName, vrchatPass).then(function (api) {
    console.log('VRChat bot logged in successfully')
    client.VRCapi = api;
});

client.once('ready', () => {
    console.log(' ____________\n<____________>\n|            |\n|            |\n|            |\n \\          / \n  \\________/ \n      ||\n      ||\n      ||\n      ||\n   ___||___ \n  /   ||   \\ \n  \\________/ \n');
    console.log('Tender has began serving drinks!');
    client.manager.init(client.user.id);
    roles(client);
    loops(client);
});

client.on("raw", (d) => client.manager.updateVoiceState(d));

client.on('message', message => {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    try {
        if (command) {
            command.execute(message, client);
        } else {
            return;
        }
    } catch (error) {
        console.log(`There was an error processing a command for server ${message.guild.id}`)
        console.log(error);
        message.react('❌');
    }
});

client.login(botToken);