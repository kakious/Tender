const {
    prefix,
    defaultColor
} = require('../config.json');
const Discord = require('discord.js');
const color = defaultColor;

module.exports = {
        name: 'link',
        // ->test ( Tests if the bot is working....)
        description: 'Link your VRChat account to your Discord account',
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
                            value: data.tags.join('\n')
                        }, {
                            name: "Developer Type",
                            value: data.developerType,
                            inline: true
                        }, {
                            name: "Last Platform",
                            value: data.last_platform,
                            inline: true,
                        }, {
                            name: "System Message:",
                            value: "Do you want to link this account to your Discord Account?"
                        })
                        .setThumbnail(data.currentAvatarImageUrl)
                        .setColor(color);
                    message.channel.send(embed).then(function (embedMessage) {
                            embedMessage.react('✅');
                            embedMessage.react('❌');
                            const filter = (reaction, user) => {
                                return reaction.emoji.name === '✅' && user.id === message.author.id || reaction.emoji.name === '❌' && user.id === message.author.id;
                            };

                            embedMessage.awaitReactions(filter, {
                                    max: 1,
                                    time: 10000,
                                    errors: ['time']
                                })
                                .then(collected => {
                                        reaction = collected.first()
                                        if (reaction.emoji.name === '✅') 
                                        {
                                            client.VRCDB.set(message.author.id, {
                                                vrc_id : data.id,
                                                discord_id : message.author.id,
                                                auto_invite: false
                                            });
                                            notification.send.friendRequest(data.id);
                                        }

                                        })
                                    .catch(collected => {
                                        console.log(collected)
                                        message.reply('Timed out response.')
                                    });
                                });
                    })
            },
        }