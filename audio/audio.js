// Handles initalization of the audio tap
const Discord = require('discord.js');
const customUtils = require('../utils/utils');
const fs = require('fs');
const {
    Manager
} = require("erela.js");

const {
    spotifyClient,
    spotifySecret,
    defaultColor
} = require('../config.json');

const Spotify = require("erela.js-spotify");

const clientID = spotifyClient;
const clientSecret = spotifySecret;
const color = defaultColor;

module.exports = client => {
    // Start Lavalink

    client.manager = new Manager({
            // Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
            nodes: [
                // If you pass a object like so the "host" property is required
                {
                    host: "localhost", // Optional if Lavalink is local
                    port: 2333, // Optional if Lavalink is set to default
                    password: "youshallnotpass", // Optional if Lavalink is set to default
                },
            ],


            // Spotify Plugin
            plugins: [
                // Initiate the plugin and pass the two required options.
                new Spotify({
                    clientID,
                    clientSecret
                })
            ],

            // A send method to send data to the Discord WebSocket using your library.
            // Getting the shard for the guild and sending the data to the WebSocket.
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            },
        })
        .on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`))
        .on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))
        .on("trackStart", (player, track) => {
            var embed = new Discord.MessageEmbed()
                .setTitle('Now Playing')
                .setDescription(`${track.title}`)
                .setFooter(`Track Length: ${customUtils.msToTime(track.duration)} | Requested By: ${track.requester.tag}`)
                .setThumbnail(track.thumbnail)
                .setColor(color);
                
            client.user.setPresence({
                status: "online", //You can show online, idle....
                game: {
                    name: `${track.title}`, //The message shown
                    type: "PLAYING" //PLAYING: WATCHING: LISTENING: STREAMING:
                }
            });
            client.channels.cache
                .get(player.textChannel)
                .send(embed);
        })
        .on("queueEnd", (player) => {
            client.channels.cache
                .get(player.textChannel)
                .send("Queue has ended.");
            player.destroy();

        });


    const audioCommandFiles = fs.readdirSync('./audio/commands').filter(file => file.endsWith('.js'));

    for (const file of audioCommandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }

    console.log('Audio tap has been poured.')
}