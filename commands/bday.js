const {
    prefix,
} = require('../config.json');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const eventsAdapter = new FileSync('./db/events_db.json')
const eventsDB = low(eventsAdapter)

var moment = require('moment-timezone'); // require
const Discord = require('discord.js');

module.exports = {
    name: 'bday',
    description: 'Birthday Command',
    execute(message, client) {
        
    }
}
