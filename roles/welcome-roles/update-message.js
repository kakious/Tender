const addReactions = (message, reactions) => {
    message.react(reactions[0]);
    reactions.shift()
    if (reactions.length > 0) {
        setTimeout(() => addReactions(message, reactions), 750);
    }
}

module.exports = async (client, guildID) => {
    welcomeData = client.welcomeroles.get(guildID);

    const channel = await client.channels.fetch(welcomeData.channel);
    const emoji = getEmoji(welcomeData.emote);
    let emojiText = 'Click the emote to gain entry to the server\n\n'
    reactions = [];
    if (typeof emoji == 'undefined') {
        reactions.push(welcomeData.emote);
    } else {
        reactions.push(emote);
    }
    channel.messages.fetch({
        around: welcomeData.message,
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
}