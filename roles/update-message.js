const addReactions = (message, reactions) => {
    message.react(reactions[0]);
    reactions.shift()
    if (reactions.length > 0) {
        setTimeout(() => addReactions(message, reactions), 750);
    }
}

const fs = require('fs');

module.exports = async (client, serverid) => {
    fs.readFile(__dirname + '/../db/events_db.json', (err, datas) => {
        const getEmoji = emojiName => client.emojis.cache.find(emoji => emoji.name === emojiName);
        parsedData = JSON.parse(datas);
        rchannels = parsedData.reaction_channels;
        rroles = parsedData.reaction_roles;
        var foundChannel;
        const reactions = [];
        let emojiText = 'Add an reaction to claim a role\n\n'
        //console.log(rchannels)
        //console.log(serverid)
        rchannels.some(function (data) {
            if (data.serverID === serverid) {
                foundChannel = data;
                return true;
            }
        })
        const guild = client.guilds.cache.get(foundChannel.serverID);
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
        //console.log(reactions);
        client.channels.fetch(foundChannel.reactionsID).then(function (channel) {
            channel.messages.fetch({
                around: foundChannel.messageID,
                limit: 1
            }).then((messages) => {
                if (messages.size === 0) {
                    console.log('Tried to run reaction role update but did not find the message');
                    return;
                } else {
                    // Edit the exising messages
                    for (const message of messages) {
                        message[1].edit(emojiText, reactions);
                        addReactions(message[1], reactions);
                    }
                }
            })
        });
    });

}