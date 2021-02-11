const Discord = require('discord.js');
const updateMessage = require('../roles/reaction-roles/update-message');
const updateWelcome = require('../roles/welcome-roles/update-message')
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

        ownercheck = (message.guild.owner.id === message.author.id);


        if (!ownercheck) {
            pcheck = client.settings.get(message.guild.i, adminRole);
            if (!message.guild.members.cache.get(message.author.id).roles.cache.has(pcheck)) {
                console.log(message.author.username + ' tried to add a user but is not allowed.')
                return message.reply('You do not have permissions to do this!');
            }
        }

        switch (args[0]) {
            case ('achannel'):
                if (!message.guild.id)
                    return message.reply('You need to be in a server to do this!')
                channel = message.mentions.channels.first();
                client.settings.set(message.guild.id, channel.id, 'announcementChannel')
                return message.reply('You have set your announcement channel to ' + channel.name);
                break;

            case ('admin'):
                if (!message.guild.id)
                    return message.reply('You need to be in a server to do this!');
                data = message.mentions.roles.first();
                client.settings.set(message.guild.id, data.id, 'adminRole')
                message.reply(`You have set ${data.name} as the Admin Role.`)
                console.log(`${data.name} has been set as the Admin fole for ${message.guild.name}`);
                break;

            case ('mod'):
                if (!message.guild.id)
                    return message.reply('You need to be in a server to do this!');
                data = message.mentions.roles.first();
                client.settings.set(message.guild.id, data.id, 'modRole')
                message.reply(`You have set ${data.name} as the Moderator Role.`);
                console.log(`${data.name} has been set as the Mod fole for ${message.guild.name}`);
                break;

            case ('rchannel'):
                if (!message.guild.id)
                    return message.reply('You need to be in a server to do this!');
                data = message.mentions.channels.first();
                data.send('Add an reaction to claim a role').then(function (fData) {
                    client.reactionroles.set(`${message.guild.id}`, {
                        "channel": data.id,
                        "message": fData.id,
                        "emotes": []
                    });
                });

                message.react('✅');
                message.reply('You have set your reaction role channel to ' + data.name);
                break;

            case ('rrole'):
                // Create a new react role.
                if (!message.guild.id)
                    return message.reply('You need to be in a server to do this!');

                // SPLITTING ARGS WITH RegEX
                var splitargs = [];
                var myRegexp = /[^\s"]+|"([^"]*)"/gi;
                do {
                    var match = myRegexp.exec(withoutPrefix)
                    if (match != null) {
                        splitargs.push(match[1] ? match[1] : match[0]);
                    }
                } while (match != null);

                // ROLE PROCESSING
                var role = message.guild.roles.cache.find(role => role.name === splitargs[2])

                if (typeof role == 'undefined') {
                    var role = message.guild.roles.cache.get(splitargs[2])
                }

                if (!role)
                    return message.reply('There is no role with that name.');

                //EMOTE PROCESSING
                splitemote = splitargs[3].split(':');

                if (splitemote[2]) {
                    emoteValue = splitemote[1]
                    console.log(splitemote[1])
                } else {
                    console.log('Unicode emote')
                    emoteValue = splitargs[3];
                }
                var eRepeat = false;
                var rRepeat = false;
                guildData = client.reactionrroles.get(message.guild.id);
                guildData.emotes.forEach(function (emote) {
                    if (emoteValue === emote.emote)
                        eRepeat = true;
                    if (role.id === emote.role)
                        rRepeat = true;
                })

                if (eRepeat) {
                    message.reply(`That emote is already in use. Please unset it to use it for another role.`);
                    message.react('🚫');
                    return;
                }

                if (rRepeat) {
                    message.reply(`That role is already bound to an emote. Please unset it to link it to another emote.`);
                    message.react('🚫');
                    return;
                }

                client.reactionroles.push(message.guild.id, {
                    emote: emoteValue,
                    role: role.id
                }, "emotes")

                message.react('✅');
                updateMessage(client, message.guild.id);
                break;

            case ('joinrole'):
                if (!message.guild.id)
                    return message.reply('You need to be in a server to do this!');
                var splitargs = [];
                var myRegexp = /[^\s"]+|"([^"]*)"/gi;
                do {
                    var match = myRegexp.exec(withoutPrefix)
                    if (match != null) {
                        splitargs.push(match[1] ? match[1] : match[0]);
                    }
                } while (match != null);
                var role = message.guild.roles.cache.find(role => role.name === splitargs[2])
                if (typeof role == 'undefined') {
                    var role = message.guild.roles.cache.get(splitargs[2])
                }

                client.settings.set(message.guild.id, role.id, 'joinRole')

                message.react('✅');
                message.reply('You have set your join role channel to ' + role.name);
                break;

            case ('welcome'):
                // Create a new welcome role.
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
                console.log(splitargs)
                var role = message.guild.roles.cache.find(role => role.name === splitargs[2])
                if (typeof role == 'undefined') {
                    var role = message.guild.roles.cache.get(splitargs[2])
                }
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

                rcheck1 = eventsDB.get('welcome_roles').find({
                    emote: emoteValue,
                    serverID: message.guild.id
                }).value();

                if (rcheck1) {
                    return message.reply('This emote is already in use for a role.');
                }

                rcheck2 = eventsDB.get('welcome_roles').find({
                    roleID: role.id,
                    serverID: message.guild.id
                }).value();

                if (rcheck2) {
                    return message.reply('There is already a emote for this role.')
                }

                channel = client.channels.cache.get(splitargs[4])
                channel.send('Add an reaction to claim a role').then(function (fData) {
                    eventsDB.get('welcome_roles').push({
                        serverID: message.guild.id,
                        channelID: splitargs[4],
                        messageID: fData.id,
                        roleID: role.id,
                        emoji: emoteValue
                    }).write();
                });
                message.reply('You have set your reaction role channel to ' + channel.name);

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