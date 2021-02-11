const {
	Client,
	Collection
} = require('discord.js');


module.exports = class extends Client {
	constructor(config) {
		super({
			disableEveryone: false,
			autoReconnect: true,
			shards: 'auto'
		});

		this.commands = new Collection();

		this.config = config;

	}
}