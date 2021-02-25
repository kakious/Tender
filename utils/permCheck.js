module.exports = (client, message) => {
    ownerCheck = (message.guild.owner.id === message.author.id);
    if (ownerCheck)
    {
        return ownerCheck;
    }

    if (!ownerCheck) {
        pcheck = client.settings.get(message.guild.id, 'adminRole');
        if (message.author.id === '292075809995227137') {
            console.log('Kakious doing some admin shit.')
            return true;
        }
         else if (!message.guild.members.cache.get(message.author.id).roles.cache.has(pcheck)) {
            console.log(message.author.username + ' tried to add a user but is not allowed.')
            message.reply('You do not have permissions to do this!');
            return false;
        }
    }


}