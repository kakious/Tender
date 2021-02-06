const Discord = require('discord.js');
const {
    prefix,
} = require('../config.json');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const eventsAdapter = new FileSync('./db/events_db.json')
const eventsDB = low(eventsAdapter)

var moment = require('moment-timezone'); // require

module.exports = {
    name: 'set',
    description: 'Set values of the bot.',
    execute(message, client) {
        const withoutPrefix = message.content.slice(prefix);
        const split = withoutPrefix.split(/ +/);
        const args = split.slice(1);

        pcheck = eventsDB.get('allowed_users').find({id: message.author.id}).value();

        if (!pcheck){
            console.log(message.author.username + ' tried to add a user but is not allowed.')
            return message.reply('You do not have permissions to do this!');
        }
        //console.log(args);
        switch(args[0]) {
            case('achannel'):
                if (!message.guild.id){
                    return message.reply('You need to be in a server to do this!')
                }
                
                eventsDB.get('announcement_channels').push({
                    serverID: message.guild.id,
                    announcementID: args[1],
                }).write();
                client.channels.fetch(args[1]).then(function (data)
                {
                    return message.reply('You have set your announcement channel to ' + data.name);
                });
            break;
        }
    }
}