const fs = require('fs');

module.exports = client => {
    setInterval(function () {
        fs.readFile(__dirname + '/../db/events_db.json', (err, datas) => {
            parsedData = JSON.parse(datas);
            events = parsedData.events
            announcementChannels = parsedData.announcement_channels
            let now = new Date();
            events.forEach(function (data) {
                announcementChannels.forEach(function (channel) {
                    if (data.serverID == channel.serverID) {
                        client.channels.fetch(channel.announcementID).then(channel => {
                            channel.messages.fetch({
                                around: data.eventID,
                                limit: 1
                            }).then(messages => {
                                var color = data.eventColor ? data.eventColor : '#af10e8';
                                var time = moment.utc(data.eventTime);
                                let eventDate = new Date(data.eventTime);
                                var embed = new Discord.MessageEmbed()
                                    .setColor(color)
                                    .setTitle(data.eventTitle)
                                    .setDescription(data.eventDescription)
                                    .addFields({
                                        name: "Time until event starts",
                                        value: moment(time).fromNow(),
                                    }, {
                                        name: "Hosted By",
                                        value: data.eventHost,
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
                                    .setFooter('Created by ' + data.eventAuthor)
                                    .setImage(data.eventImageUrl)
                                messages.first().edit(embed);
                                if (eventDate < now) {
                                    channel.send("<@everyone>" + ", The event " + data.eventTitle + ' has started!!!');
                                    parsedData.events = events.filter((events) => {
                                        return events.eventID !== data.eventID
                                    });
                                    fs.writeFileSync(__dirname + '/../db/events_db.json', JSON.stringify(parsedData, null, 2));
                                }
                            })
                        })
                    }
                });
            });
        });
    }, 60000);
}