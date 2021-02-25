const moment = require('moment-timezone')
const Discord = require('discord.js');

module.exports = client => {
    setInterval(function () {
        guildList = client.events.indexes;

        let now = new Date();

        guildList.forEach(function (guildID) {
            channelID = client.settings.get(guildID, 'announcementChannel');
            eventData = client.events.get(guildID, 'events')
            if (channelID === null)
                return;
            channel = client.channels.cache.get(channelID);

            if (!channel)
                return;

            eventData.forEach(function (event) {
                channel.messages.fetch(event.message,).then(message => {
                    var color = event.eventColor ? event.eventColor : '#af10e8';
                    var time = moment.utc(event.eventTime);
                    let eventDate = new Date(event.eventTime);
                    var embed = new Discord.MessageEmbed()
                        .setColor(color)
                        .setTitle(event.eventTitle)
                        .setDescription(`@everyone, ${event.eventDescription}`)
                        .addFields({
                            name: "Time until event starts",
                            value: moment(time).fromNow(),
                        }, {
                            name: "Hosted By",
                            value: event.eventHost,
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
                        .setFooter('Created by ' + event.eventAuthor)
                        .setImage(event.eventImageURL)
                    try {
                        message.first().edit(embed);
                    } catch {
                        console.log(`There was an error with event ID ${event.id} from serverID ${guildID}. Deleting event from database.`)
                        client.events.remove(guildID, event, 'events');
                    }
                    if (eventDate < now) {
                        channel.send("@everyone" + ", The event " + event.eventTitle + ' has started!!!');
                        client.events.remove(guildID, event, 'events');
                    }
                })
            })
        })
    }, 5000);
}