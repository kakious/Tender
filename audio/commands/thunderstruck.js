const {
    prefix,
} = require('../../config.json');


module.exports = {
    name: 'thunderstruck',
    // ->test ( Tests if the bot is working....)
    description: 'Groovy Time',
    async execute(message, client) {
        const withoutPrefix = message.content.slice(prefix);
        const split = withoutPrefix.split(/ +/);
        const args = split.slice(1);
        const {
            channel
        } = message.member.voice;
        switch (args[0]) {
            default:
                const player = message.client.manager.create({
                    guild: message.guild.id,
                    voiceChannel: channel.id,
                    textChannel: message.channel.id,
                });

                if (player.state !== "CONNECTED") player.connect();

                let res;

                try {
                    res = await player.search('https://www.youtube.com/watch?v=v2AC41dglnM', message.author);
                    if (res.loadType === 'LOAD_FAILED') {
                        if (!player.queue.current) player.destroy();
                        throw res.exception;
                    }
                } catch (err) {
                    return message.reply(`there was an error while searching: ${err.message}`);
                }

                switch (res.loadType) {
                    case 'NO_MATCHES':
                        if (!player.queue.current) player.destroy();
                        return message.reply('there were no results found.');
                    case 'TRACK_LOADED':
                        player.play(res.tracks[0]);
                        return message.reply(`GET YOUR GLASSES READY!`);
                }
        }
    }
}