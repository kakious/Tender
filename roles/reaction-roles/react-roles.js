const firstMessage = require('./first-message');
//const firstJoin = require('./first-join');
// Core Module for Reaction Roles and New Roles

module.exports = async (client) => {
    const getEmoji = emojiName => client.emojis.cache.find(emoji => emoji.name === emojiName);
    var guildList = client.reactionroles.indexes;
    // Handle first bot update and cache initalization.
    guildList.forEach(function (guild) {
        const guilds = client.guilds.cache.get(guild);
        guildData = client.reactionroles.get(guild);
        const reactions = [];
        let emojiText = 'Add an reaction to claim a role\n\n'
        emotes = client.reactionroles.get(guild, 'emotes');
        if (emotes.length != '0') {
            emotes.forEach(function (reactionRole) {
                const emoji = getEmoji(reactionRole.emote);
                if (typeof emoji == 'undefined') {
                    reactions.push(reactionRole.emote);
                    const role = guilds.roles.cache.get(reactionRole.role).name
                    emojiText += `${reactionRole.emote} = ${role}\n`
                } else {
                    reactions.push(emoji);
                    const role = guilds.roles.cache.get(reactionRole.role).name
                    emojiText += `${emoji} = ${role}\n`
                }
                //console.log(reactionRole);
            })
            firstMessage(client, guildData.channel, emojiText, reactions, guildData.message);
        }
    })

    // Handle reaction to emote;
    const handleReaction = (reaction, user, add) => {
        if (user.id === client.user.id) {
            return;
        }

        reactionRole = client.reactionroles.get(reaction.message.guild.id);
        //console.log(channel.serverID)
        if (typeof reactionRole == 'undefined')
            return;

        //console.log(reaction);

        var emote;
        reactionRole.emotes.forEach(function (emoteData) {
            if (emoteData.emote === reaction._emoji.name) {
                emoteData.emote = emote;
            }
        })

        const {
            guild
        } = reaction.message

        if (!emote)
        {
            return;
        }
        if (!emote.role) {
            return;
        }

        const role = guild.roles.cache.get(emote.role);
        const member = guild.members.cache.find(member => member.id === user.id)
        if (add) {
            console.log('Assigning role ' + role.name + ' to user ' + member.user.username)
            member.roles.add(role);
        } else {
            console.log('Removing role ' + role.name + ' to user ' + member.user.username)
            member.roles.remove(role);
        }
    }

    client.on('messageReactionAdd', (reaction, user) => {
        handleReaction(reaction, user, true);
    })

    client.on('messageReactionRemove', (reaction, user) => {
        handleReaction(reaction, user, false);
    })
}