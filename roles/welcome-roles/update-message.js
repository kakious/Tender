const addReactions = (message, reactions) => {
    message.react(reactions[0]);
    reactions.shift()
    if (reactions.length > 0) {
        setTimeout(() => addReactions(message, reactions), 750);
    }
}

module.exports = async (client, id) => {
    const channel = await client.channels.fetch(id);
    channel.messages.fetch({
        around: messageid,
        limit: 1
    }).then((messages) => {
        if (messages.size === 0) {
            console.log('Tried to run reaction role update but did not find the message');
            return;
        } else {
            // Edit the exising messages
            for (const message of messages) {
                message[1].edit(text, reactions);
                addReactions(message[1], reactions);
            }
        }
    })
}