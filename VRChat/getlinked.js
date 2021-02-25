const {
    prefix,
    defaultColor
} = require('../config.json');
const Discord = require('discord.js');
const color = defaultColor;

module.exports = {
    name: 'getlinked',
    // ->test ( Tests if the bot is working....)
    description: 'Development Command.',
    execute(message, client) {
        //console.log(splitargs);
        VRCDB = client.VRCDB.fetchEverything();

        VRCDB.forEach(user => {
            console.log(user)
            client.VRCapi.user.getById(user.vrc_id).then(function (data) {
                var embed = new Discord.MessageEmbed()
                    .setTitle(`${data.displayName} (${data.username})`)
                    .setFooter(`Created By ${message.author.tag}`)
                    .addFields({
                        name: "Discord User",
                        value: client.users.cache.get(user.discord_id)
                    }, {
                        name: "ID",
                        value: data.id
                    }, {
                        name: "Tags",
                        value: data.tags.join('\n')
                    }, {
                        name: "Developer Type",
                        value: data.developerType,
                        inline: true
                    }, {
                        name: "Last Platform",
                        value: data.last_platform,
                        inline: true,
                    })
                    .setThumbnail(data.currentAvatarImageUrl)
                    .setColor(color);
                message.channel.send(embed);
            })
        })
    }
}