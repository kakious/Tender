const firstMessage = require('./first-message');
//const firstJoin = require('./first-join');
const fs = require('fs');

const {
    prefix
} = require('../../config.json');

// Core Module for Reaction Roles and New Roles

module.exports = async (client) => {
    //const getEmoji = emojiName => client.emojis.cache.get(emojiName);
    const getEmoji = emojiName => client.emojis.cache.find(emoji => emoji.name === emojiName);

    fs.readFile(__dirname + '/../../db/events_db.json', (err, datas) => {
        parsedData = JSON.parse(datas);
        rchannels = parsedData.reaction_channels;
        rroles = parsedData.reaction_roles;

        rchannels.forEach(function (server) {
            const guild = client.guilds.cache.get(server.serverID);
            //console.log(guild)
            //console.log(server.reactionsID + ':' + server.messageID)
            const reactions = [];
            let emojiText = 'Add an reaction to claim a role\n\n'
            rroles.forEach(function (key) {
                const emoji = getEmoji(key.emoji);
                if (typeof emoji == 'undefined') {
                    reactions.push(key.emoji);
                    const role = guild.roles.cache.get(key.roleID).name
                    emojiText += `${key.emoji} = ${role}\n`
                } else {
                    reactions.push(emoji);
                    const role = guild.roles.cache.get(key.roleID).name
                    emojiText += `${emoji} = ${role}\n`
                }
            })
            firstMessage(client, server.reactionsID, emojiText, reactions, server.messageID);
        })
    });

    const handleReaction = (reaction, user, add) => {
        if (user.id === client.user.id) {
            return;
        }

        fs.readFile(__dirname + '/../db/events_db.json', (err, datas) => {
            parsedData = JSON.parse(datas);
            rchannels = parsedData.reaction_channels;
            rroles = parsedData.reaction_roles;
            var channel;
            var roleName;

            rchannels.some(function (data) {
                if (data.reactionsID === reaction.message.channel.id) {
                    //console.log(data);
                    if (data.messageID === reaction.message.id) {
                        channel = data;
                        return true;
                    }
                }
            })

            //console.log(channel.serverID)
            if (!channel)
                return;

            rroles.some(function (data) {
                if (data.emoji === reaction._emoji.name) {
                    roleName = data.roleID;
                    return true;
                }
            })

            //console.log(reaction);
            const emoji = reaction._emoji.name;

            const {
                guild
            } = reaction.message

            if (!roleName) {
                return;
            }

            const role = guild.roles.cache.get(roleName);
            const member = guild.members.cache.find(member => member.id === user.id)
            if (add) {
                //console.log(reaction)
                console.log('Assigning role ' + role.name + ' to user ' + member.user.username)
                member.roles.add(role);
            } else {
                console.log('Removing role ' + role.name + ' to user ' + member.user.username)
                member.roles.remove(role);
            }
        });
    }

    client.on('messageReactionAdd', (reaction, user) => {
        handleReaction(reaction, user, true);
    })

    client.on('messageReactionRemove', (reaction, user) => {
        handleReaction(reaction, user, false);
    })
}