const {
    prefix,
    defaultColor
} = require('../config.json');
var moment = require('moment-timezone'); // require
const Discord = require('discord.js');
const customUtils = require('../utils/utils');

module.exports = {
    name: 'createevent',
    // ->createevent (Ping who is hosting it) 'Event Title' 'Event Description'  (Time in UTC) 'imageurl'
    description: 'Create a new event in your announcement channel',
    execute(message, client) {

        pcheck = customUtils.permCheck(client, message);

        if (!pcheck)
            return;
            
        channelID = client.settings.get(message.guild.id, 'announcementChannel');
        if (channelID === null) {
            return message.reply(`You do not have an announcement channel setup. Please do that and then try again.`);
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


            if (splitargs.length < 5) {
                return message.reply('You have too many or too few arguments to run this command.');
            }

            var color = splitargs[7] ? splitargs[7] : defaultColor;

            // Process Date
            var now = new Date();
            var date = new Date('2021-' + splitargs[4] + 'T' + splitargs[5] + ':00Z');
            if (isNaN(date) == true)
                return message.reply('There was an issue with your date or time. Please check it and try again.');

            if (date < now)
                return message.reply('You can\'t make a event for a past time or date.')

            var time = moment.utc(date);
            var embed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(splitargs[2])
                .setDescription(`@everyone, ${splitargs[3]}`)
                .addFields({
                    name: "Time until event starts",
                    value: moment(time).fromNow(),
                }, {
                    name: "Hosted By",
                    value: args[0],
                }, {
                    name: "CST",
                    value: moment(time).tz("America/Chicago").format('LLL'),
                    inline: true
                }, {
                    name: "UTC",
                    value: time.format('LLL'),
                    inline: true,
                }, {
                    name: "CET",
                    value: moment(time).tz("Europe/Vienna").format('LLL'),
                    inline: true,
                })
                .setFooter('Created by ' + message.author.username)
                .setImage(splitargs[6]);

            // Doing channel setup
            channel = client.channels.cache.get(channelID);
            return channel.send(embed).then(function (dMessage) {
                client.events.push(message.guild.id, {
                    message: dMessage.id,
                    channel: channelID,
                    eventHost: args[0],
                    eventAuthor: message.author.tag,
                    eventTitle: splitargs[2],
                    eventDescription: splitargs[3],
                    eventTime: date,
                    eventImageURL: splitargs[6],
                    eventColor: color
                }, 'events');
            });
        }
    }
}