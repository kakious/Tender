const fs = require('fs');

// Process new members and assigning them the default role.

module.exports = async (client) => {
    client.on('guildMemberAdd', (guildMember) => {
        handleNewMember(client, guildMember)
    })
    const handleNewMember = (client, guildMember) => {
        if (guildMember.user.id === client.user.id) {
            return;
        }
        fs.readFile(__dirname + '/../db/events_db.json', (err, datas) => {
            parsedData = JSON.parse(datas);
            jservers = parsedData.new_member_roles;
            var foundServer = false;
            
            var found = jservers.some(function (data) {
                if (guildMember.guild.id === data.serverID){
                    foundServer = data;
                    return true;
                }
            })
            if (!found)
            {
                return;
            }
            const role = guildMember.guild.roles.cache.get(foundServer.roleID);
            guildMember.addRole(role);
            console.log('New user has joined server ' + guildMember.guild.name + '. Now assigning default role.')
        })
    }
}