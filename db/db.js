const Enmap = require('enmap');

module.exports = client => {

    client.reactionroles = new Enmap({
        name: "reactionroles",
        persistent: true,
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
        autoEnsure: {
            channel: null,
            message: null,
            roles: []
        }
    });

    client.welcomeroles = new Enmap({
        name: "welcomeroles",
        persistent: true,
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
        autoEnsure: {
            channel: null,
            message: null,
            emote: null,
            role: null,
            removeJoinRole: false
        }
    });

    client.events = new Enmap({
        name: "events",
        persistent: true,
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
        autoEnsure: {
            events: []
        }
    });

    client.settings = new Enmap({
        name: "settings",
        persistent: true,
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
        autoEnsure: {
            modRole: null,
            adminRole: null,
            welcomeMessage: null,
            joinRole: null,
            memeChannel: null,
            welcomeChannel: null,
            announcementChannel: null,
        }
    });

    client.birthdays = new Enmap({
        name: "birthdays",
        persistent: true,
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep',
        autoEnsure: {
            channel: null,

        }
    });
}