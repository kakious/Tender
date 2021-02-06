const {
    prefix,
} = require('../config.json');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const eventsAdapter = new FileSync('./db/events_db.json')
const eventsDB = low(eventsAdapter)

module.exports = {
    name: 'allowevents',
    // ->createevent 'Event Title' 'Event Description' (Ping who is hosting it) (Time in UTC) 'imageurl'
    description: 'Allow a user to create events',
    execute(message, client) {
        const withoutPrefix = message.content.slice(prefix);
        const split = withoutPrefix.split(/ +/);
        const args = split.slice(1);

        if (args[0] == 'undefined') {
            return message.reply('Please specify a user to give this permission to.')
        }
        if (args[0].startsWith('<@') && args[0].endsWith('>')) {
            mention = args[0].slice(2, -1);
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }
            pcheck = eventsDB.get('allowed_users').find({id: message.author.id}).value();

            if(!pcheck) {
                console.log(message.author.username + ' tried to add a user but is not allowed.')
                return message.reply('You do not have permissions to do this!');
            }
            
            entries = eventsDB.get('allowed_users').find({id: mention}).value();

            if (entries) {
                    return message.reply('That user is already allowed to create events!');
            }

            user = client.users.cache.get(mention);
            eventsDB.get('allowed_users').push({id: mention}).write();
            console.log(user.username + ' has been permitted to create events.')
            return message.channel.send(`${user.username} has been allowed to create events!`);
        }
    }
}