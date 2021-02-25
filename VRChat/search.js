const {
    prefix,
    defaultColor
} = require('../config.json');
const Discord = require('discord.js');
const color = defaultColor;

module.exports = {
    name: 'search',
    // ->test ( Tests if the bot is working....)
    description: 'Search VRChat User',
    execute(message, client) {
        var splitargs = [];
        const withoutPrefix = message.content.slice(prefix);
        var myRegexp = /[^\s"]+|"([^"]*)"/gi;
        do {
            var match = myRegexp.exec(withoutPrefix)
            if (match != null) {
                splitargs.push(match[1] ? match[1] : match[0]);
            }
        } while (match != null);

        //console.log(splitargs);
        client.VRCapi.user.getByName(splitargs[1]).then(function (data) {
            var embed = new Discord.MessageEmbed()
                .setTitle(`${data.displayName} (${data.username})`)
                .setFooter(`Created By ${message.author.tag}`)
                .addFields({
                    name: "ID",
                    value: data.id
                }, {
                    name: "Tags",
                    value : data.tags.join('\n')
                }, {
                    name: "Developer Type",
                    value: data.developerType,
                    inline: true
                }, {
                    name : "Last Platform",
                    value : data.last_platform,
                    inline : true,
                })
                .setThumbnail(data.currentAvatarImageUrl)
                .setColor(color);
            message.channel.send(embed);
        })
    },
}