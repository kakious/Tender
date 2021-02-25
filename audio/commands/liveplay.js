module.exports = {
    name: "liveplay",
    description: "Play a song in your channel!",
    async execute(message, client) {
        const {
            channel
        } = message.member.voice;

        if (!channel) return message.reply('you need to join a voice channel.');

        channel.join()
            .then((connection) => {
                voice = connection
                player = voice.play("rtmp://stream.vrcdn.live/live/neon");
                console.log(`${message.author.name} has started playing ${requestedURL}`)
            });
    }
}