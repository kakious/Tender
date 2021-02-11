// Processing the emote reaction for rules;

const firstMessage = require('./first-message')


module.exports = async (client) => {
    const getEmoji = emojiName => client.emojis.cache.find(emoji => emoji.name === emojiName);

    var guildList = client.welcomeroles.indexes;
    console.log(guildList)
    let emojiText = 'Click the emote to gain entry to the server\n\n'
    const reactions = [];
    guildList.forEach(function (guildID) {
        guildData = client.welcomeroles.get(guildID);
        const emoji = getEmoji(guildData.emote);
        if (typeof emoji == 'undefined') {
            reactions.push(guildData.emote);
        } else {
            reactions.push(emote);
        }
        firstMessage(client, guildData.channel, emojiText, reactions, guildData.message)
    })

    const handleReaction = (reaction, user) => {
        if (user.id === client.user.id) {
            return;
        }

        guildData = client.welcomeroles.get(reaction.message.guild.id);
        settingData = client.settings.get(reaction.message.guild.id);

        if (guildData === null) {
            return;
        }

        const {
            guild
        } = reaction.message;

        const addRole = guild.roles.cache.get(guildData.role);
        console.log(addRole.name)

        const member = guild.members.cache.find(member => member.id === user.id)
        console.log(`${member.user.username} has accepted the rules.`);
        try {
            member.roles.add(addRole);
            if (settingData.joinRole !== null && guildData.removeJoinRole) {
                const remRole = guild.roles.cache.get(settingData.joinRole);
                member.roles.remove(remRole);
            }
        } catch {
            console.log('There was an error applying the welcome roles');
        }

    }

    client.on('messageReactionAdd', (reaction, user) => {
        handleReaction(reaction, user);
    })

}