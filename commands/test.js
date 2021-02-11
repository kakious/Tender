module.exports = {
    name: 'test',
    // ->test ( Tests if the bot is working....)
    description: 'Test',
        execute(message) {
            console.log(message.content);
            message.channel.send('The test command works!!!');
        },
}