const Discord = require('discord.js');
const client = new Discord.Client();
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
    console.log('Bot has started');
    for (command in client.commands) {
        console.log('Loaded Command ' + command.name)
    }

    setInterval(function () {
        console.log('Refreshed event time.')
        fs.readFile('./db/events_db.json', (err, datas) => {
            parsedData = JSON.parse(datas);
            events = parsedData.events
            announcementChannels = parsedData.announcement_channels
            let now = new Date();
            events.forEach(function (data) {
                announcementChannels.forEach(function (channel) {
                    if (data.serverID == channel.serverID){
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
                                    },
                                    {
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
                                    fs.writeFileSync('./db/events_db.json', JSON.stringify(parsedData, null, 2));
                                }
                            })
                        })
                    }
                });
            });
        });
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