// Process new members and assigning them the default role.

module.exports = async (client) => {
    client.on('guildMemberAdd', (guildMember) => {
        handleNewMember(client, guildMember)
    })

    const handleNewMember = (client, guildMember) => {
        if (guildMember.user.id === client.user.id) {
            return;
        }

        joinRole = client.settings.get(guildMember.guild.id, 'joinRole');
        if (joinRole === null) {
            return;
        }

        const role = guildMember.guild.roles.cache.get(joinRole);
        guildMember.roles.add(role);
        console.log('New user has joined server ' + guildMember.guild.name + '. Now assigning default role.')
    }
}