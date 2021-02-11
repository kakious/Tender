const addReactions = (message, reactions) => {
    message.react(reactions[0]);
    reactions.shift()
    if (reactions.length > 0) {
        setTimeout(() => addReactions(message, reactions), 750);
    }
}

module.exports = async (client, serverid) => {
    const getEmoji = emojiName => client.emojis.cache.find(emoji => emoji.name === emojiName);

    const reactions = [];
    let emojiText = 'Add an reaction to claim a role\n\n'

    var guildData = client.reactionroles.get(serverid)

    if (guildData.emotes === null) {
        return;
    }

    const guild = client.guilds.cache.get(serverid);
    emotes = guildData.emotes;
    emotes.forEach(function (emote) {
        const emoji = getEmoji(emote.emote);
        if (typeof emoji == 'undefined') {
            reactions.push(emote.emote);
            const role = guild.roles.cache.get(emote.role).name
            emojiText += `${emote.emote} = ${role}\n`
        } else {
            reactions.push(emoji);
            const role = guild.roles.cache.get(emote.roleID).name
            emojiText += `${emoji} = ${role}\n`
        }
    })
    channel = client.channels.cache.get(guildData.channel)
    channel.messages.fetch({
        around: guildData.message,
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
    });
}