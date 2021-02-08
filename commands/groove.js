const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
const {
    prefix,
} = require('../config.json');

module.exports = {
    name: 'groove',
    // ->test ( Tests if the bot is working....)
    description: 'Groovy Time',
        execute(message) {
            const withoutPrefix = message.content.slice(prefix);
            const split = withoutPrefix.split(/ +/);
            const args = split.slice(1);
            switch (args[0]) {
                case('sync'):
                    return message.channel.send('Syncing those funcky beats!');
                    break
                default:
                    return message.channel.send('It\'s time to get groovy!');
                    break;
            }
        },
}