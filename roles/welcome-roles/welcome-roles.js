// Processing the emote reaction for rules;

const fs = require('fs');

const firstMessage = require('./first-message')

const {
    prefix
} = require('../../config.json')
module.exports = async (client) => {
    const getEmoji = emojiName => client.emojis.cache.find(emoji => emoji.name === emojiName);

    fs.readFile(__dirname + '/../../db/events_db.json', (err, data) => {
        parsedData = JSON.parse(data);
        wSettings = parsedData.welcome_roles;
        let emojiText = 'Click the emote to gain entry to the servers\n\n'

        const reactions = [];
        wSettings.forEach(function (settings) {
            const guild = client.guilds.cache.get(settings.serverID);



            const emoji = getEmoji(client, settings.emoji);
            if (typeof emojis == 'undefined') {
                reactions.push(settings.emoji);
                const role = guild.roles.cache.get(settings.roleID).name;
                emojiText += `${role}\n`
            } else {
                reactions.push(emoji);
                const role = guild.roles.cache.get(settings.roleID).name;
                emojiText += `${role}\n`
            }
            firstMessage(client, settings.channelID, emojiText, reactions, settings.messageID)
        })
    })

    const handleReaction = (reaction, user) => {
        if (user.id === client.user.id) {
            return;
        }
        fs.readFile(__dirname + '/../../db/events_db.json', (err, data) => {
            parsedData = JSON.parse(data);
            wSettings = parsedData.welcome_roles;
            jServers = parsedData.new_member_roles;

            var wData;
            var jData;

            var found1 = jServers.some(function (datas) {
                if (reaction.message.guild.id === datas.serverID) {
                    jData = datas;
                    return true;
                }
            });
            if (!found1) {
                return;
            };

            var found2 = wSettings.some(function (datas) {
                if (datas.messageID === reaction.message.id) {
                    wData = datas;
                    return true
                }
            });

            if (!found2) {
                return;
            };

            const emoji = reaction._emoji.name;

            const {
                guild
            } = reaction.message;

            const addRole = guild.roles.cache.get(wData.roleID);
            const remRole = guild.roles.cache.get(jData.roleID);
            console.log(addRole.name + ':' + remRole.name)
            const member = guild.members.cache.find(member => member.id === user.id)

            console.log(`${member.user.username} has accepted the rules.`);
            try {
                member.roles.add(addRole);
                member.roles.remove(remRole);
            } catch {
                console.log('There was an error applying the welcome roles');
            }
        })
    }
    client.on('messageReactionAdd', (reaction, user) => {
        handleReaction(reaction, user);
    })

}