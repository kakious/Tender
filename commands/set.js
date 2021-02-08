const Discord = require('discord.js');
const updateMessage = require('../roles/reaction-roles/update-message');

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

        pcheck = eventsDB.get('allowed_users').find({
            id: message.author.id
        }).value();

        if (!pcheck) {
            console.log(message.author.username + ' tried to add a user but is not allowed.')
            return message.reply('You do not have permissions to do this!');
        }

        switch (args[0]) {
            case ('achannel'):
                if (!message.guild.id) {
                    return message.reply('You need to be in a server to do this!')
                }
                eventsDB.get('announcement_channels').push({
                    serverID: message.guild.id,
                    announcementID: args[1],
                }).write();
                client.channels.fetch(args[1]).then(function (data) {
                    return message.reply('You have set your announcement channel to ' + data.name);
                });
                break;
            case ('admin'):
                break;
            case ('mod'):
                break;
            case ('rchannel'):
                if (!message.guild.id) {
                    return message.reply('You need to be in a server to do this!');
                }
                client.channels.fetch(args[1]).then(function (data) {
                    data.send('Add an reaction to claim a role').then(function (fData) {
                        eventsDB.get('reaction_channels').push({
                            serverID: message.guild.id,
                            reactionsID: args[1],
                            messageID: fData.id
                        }).write();
                    });
                    message.reply('You have set your reaction role channel to ' + data.name);
                });
                break;
            case ('rrole'):
                // Create a new react role.
                if (!message.guild.id) {
                    return message.reply('You need to be in a server to do this!');
                }

                var splitargs = [];
                var myRegexp = /[^\s"]+|"([^"]*)"/gi;
                do {
                    var match = myRegexp.exec(withoutPrefix)
                    if (match != null) {
                        splitargs.push(match[1] ? match[1] : match[0]);
                    }
                } while (match != null);
                //console.log(splitargs);
                console.log('ran');
                var role = message.guild.roles.cache.find(role => role.name === splitargs[2])
                //var getEmoji = emojiName => client.emojis.cache.find(emoji => emoji.name === emojiName);
                if (!role)
                    return message.reply('There is no role with that name.');
                console.log(splitargs[3].split(':'));
                splitemote = splitargs[3].split(':');
                if (splitemote[2]) {
                    emoteValue = splitemote[1]
                    console.log(splitemote[1])
                } else {
                    console.log('Unicode emote')
                    emoteValue = splitargs[3];
                }
                rcheck1 = eventsDB.get('allowed_users').find({
                    emote: emoteValue,
                    serverID: message.guild.id
                }).value();

                if (rcheck1) {
                    return message.reply('This emote is already in use for a role.');
                }

                rcheck2 = eventsDB.get('allowed_users').find({
                    roleID: role.id,
                    serverID: message.guild.id
                }).value();

                if (rcheck2) {
                    return message.reply('There is already a emote for this role.')
                }

                eventsDB.get('reaction_roles').push({
                    serverID: message.guild.id,
                    roleID: role.id,
                    emoji: emoteValue
                }).write();
                updateMessage(client, message.guild.id);
                break;
            case ('joinrole'):
                if (!message.guild.id) {
                    return message.reply('You need to be in a server to do this!');
                }
                var splitargs = [];
                var myRegexp = /[^\s"]+|"([^"]*)"/gi;
                do {
                    var match = myRegexp.exec(withoutPrefix)
                    if (match != null) {
                        splitargs.push(match[1] ? match[1] : match[0]);
                    }
                } while (match != null);
                var role = message.guild.roles.cache.find(role => role.name === splitargs[2])
                eventsDB.get('new_member_roles').push({
                    serverID: message.guild.id,
                    roleID: role.id
                }).write();
                message.reply('You have set your join role channel to ' + role.name);
                break;
            default:
                // Pretty help text go burr. <3
                var embed = new Discord.MessageEmbed()
                    .setTitle('Tender\'s Help Menu')
                    .setDescription('Changes Tenders\'s settings.')
                    .setColor('#af10e8')
                    .addFields({
                        name: "Subcommands",
                        value: "**achannel** Set your announcement channel \n**rchannel** Set your reaction channel\n **rrole** Set up a reaction role\n **admin** Set a user as a bot admin \n **mod** Set a user as a bot mod \n **joinrole** Set the default join role",
                    })
                    .setFooter('Created by Kakious')
                message.channel.send(embed);
                break;
        }
    }
}