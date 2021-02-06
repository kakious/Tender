const {
    prefix,
} = require('../config.json');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const eventsAdapter = new FileSync('./db/events_db.json')
const eventsDB = low(eventsAdapter)

var moment = require('moment-timezone'); // require
const Discord = require('discord.js');

module.exports = {
    name: 'createevent',
    // ->createevent (Ping who is hosting it) 'Event Title' 'Event Description'  (Time in UTC) 'imageurl'
    description: 'Create a new event in your announcement channel',
    execute(message, client) {

        pcheck = eventsDB.get('allowed_users').find({id: message.author.id}).value();

        if (!pcheck){
            console.log(message.author.username + ' tried to add a user but is not allowed.')
            return message.reply('You do not have permissions to do this!');
        }

        announcement_channel = eventsDB.get('announcement_channels').find({
            serverID: message.guild.id
        }).value();
        
        if (!announcement_channel) {
            return message.reply('Please set an announcement channel using ' + prefix + 'set achannel (channel id)');
        }

        const withoutPrefix = message.content.slice(prefix);
        const split = withoutPrefix.split(/ +/);
        const args = split.slice(1);
        
        if (args[0].startsWith('<@') && args[0].endsWith('>')) {
            var splitargs = [];
            var myRegexp = /[^\s"]+|"([^"]*)"/gi;
            mention = args[0].slice(2, -1);
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }

            do {
                var match = myRegexp.exec(withoutPrefix)
                if (match != null) {
                    splitargs.push(match[1] ? match[1] : match[0]);
                }
            } while (match != null);
            //console.log(splitargs);
            //console.log(splitargs.length);
            if (splitargs.length < 5) {
                return message.reply('You have too many or too few arguments to run this command.');
            }

            var color = splitargs[7] ? splitargs[7] : '#af10e8';

            // Process Date
            var now = new Date();
            var date = new Date('2021-' + splitargs[4] + 'T' + splitargs[5] + ':00Z');
            if (isNaN(date) == true)
            return message.reply('There was an issue with your date or time. Please check it and try again.');

            if (date < now)
            return message.reply('You can\'t make a event for a past time or date.')
            //783166127487844363
            var time = moment.utc(date);
            var embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(splitargs[2])
            .setDescription(splitargs[3])
            .addFields({
                name: "Time until event starts",
                value: moment(time).fromNow(),
            },
            {
                name: "Hosted By",
                value: args[0],
            },
            {
                name: "CST",
                value: moment(time).tz("America/Chicago").format('LLL'),
                inline: true
            },
            {
                name: "UTC",
                value: time.format('LLL'),
                inline: true,
            })
            .setFooter('Created by ' + message.author.username)
            .setImage(splitargs[6])
            client.channels.fetch(announcement_channel.announcementID).then(function (channel){
                return channel.send(embed).then(function (dMessage) {
                    eventsDB.get('events').push({
                        eventID: dMessage.id,
                        serverID: message.guild.id,
                        eventHost: args[0],
                        eventAuthor: message.author.username,
                        eventTitle: splitargs[2],
                        eventDescription: splitargs[3],
                        eventTime: date,
                        eventImageUrl: splitargs[6],
                        eventColor: color
                    }).write();
                });
            })
        }
    }
}