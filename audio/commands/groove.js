
const {
    SpotifyParser
} = require('spotilink');


const {
    prefix,
    spotifyClient,
    spotifySecret
} = require('../../config.json');

const node = {
    host: 'localhost',
    port: 1234,
    password: 'password'
};
const spotilink = new SpotifyParser(node, spotifyClient, spotifySecret);

module.exports = {
        name: 'groove',
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
                        res = await player.search('https://open.spotify.com/playlist/0yLRzFv22ZUQLOtwqwwnkn?si=ywe4mbSKSEu8CzzkVHZlVA', message.author);
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
                        case 'PLAYLIST_LOADED':
                            player.queue.add(res.tracks);
                            player.queue.shuffle();
                            if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                            return message.reply(`enqueuing playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks.`);
                            break;
                    }
            }
        }
    }