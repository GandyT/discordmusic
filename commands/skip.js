const GuildManager = require("../guildManager.js");
const Discord = require("discord.js");

module.exports = {
    names: ["skip", "fs"],
    description: 'skips the current song',
    usage: 'skip',
    async execute(Env) {
        const { message, client, args } = Env;

        let guildData = GuildManager.getGuild(message.guild.id);

        if (!guildData) message.channel.send("Nothing is playing...");

        guildData.audioPlayer.stop(true);

        message.channel.send("Song Skipped!");
    }
}