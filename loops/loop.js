const eventLoop = require('./event_loop.js');

module.exports = client => {
    eventLoop(client);
}
