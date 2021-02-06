const Discord = require('discord.js');

module.exports = {
    name: 'info',
    description: 'Get info about the bot.',
    execute(message) {
        seconds = process.uptime();
        var numdays = Math.floor((seconds % 31536000) / 86400) ? Math.floor((seconds % 31536000).toFixed(0) / 86400) + ' days ' : '';
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600)? Math.floor(((seconds % 31536000) % 86400) / 3600).toFixed(0) + ' hours ': '';
        var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60) ? Math.floor((((seconds % 31536000) % 86400) % 3600) / 60).toFixed(0)  + ' minutes ': '';
        var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60).toFixed(0) + ' seconds';
        var embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .addFields({
                name: 'Instance owned by',
                value: 'Kakious#0443',
                inline: true
            }, {
                name: 'Node.JS Version',
                value: process.version,
                inline: true
            }, {
                name: 'About Tender',
                value: 'Handcrafted from the finest brewerys Tender is a purpose made bot for the Drunk\'n\'Stupid Discord Server to help track events and other functions.'
            }, {
                name: 'Uptime',
                value: numdays +  numhours + numminutes + numseconds,
            });

        return message.channel.send(embed);
    }
}