module.exports = {
	name: 'stop',
	description: 'Stop all songs in the queue!',
	execute(message, client) {
		const player = message.client.manager.get(message.guild.id);
		customQueue = client.customQueue.get(message.guild.id);
		
		if (customQueue) {
			console.log('Stopped queue')
			message.reply('Stopped custom audio stream.')
			customQueue.connection.disconnect();
			client.customQueue.delete(message.guild.id)
			return;
		}
		
		if (!player) return message.reply("there is no player for this guild.");

		const {
			channel
		} = message.member.voice;

		if (!channel) return message.reply("you need to join a voice channel.");
		if (channel.id !== player.voiceChannel) return message.reply("you're not in the same voice channel.");
		player.destroy();
		return message.reply("destroyed the player.");
	}
};