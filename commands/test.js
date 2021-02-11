const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

module.exports = {
    name: 'test',
    // ->test ( Tests if the bot is working....)
    description: 'Test',
        execute(message) {
            console.log(message.content);
            message.channel.send('The test command works!!!');
        },
}