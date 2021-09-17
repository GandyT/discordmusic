const GuildManager = require("../guildManager.js");
const Discord = require("discord.js");

module.exports = {
    names: ["np", "current"],
    description: 'gets the current playing song',
    usage: 'np',
    async execute(Env) {
        const { message, client, args } = Env;

        let guildData = GuildManager.getGuild(message.guild.id);

        if (!guildData) return message.channel.send({
            embeds: [new Discord.MessageEmbed()
                .setDescription("Nothing is playing...")]
        });

        if (!guildData.songQueue.length) return message.channel.send({
            embeds: [new Discord.MessageEmbed()
                .setDescription("Nothing is playing...")]
        });

        let songTitle = guildData.songQueue[0].name;
        let thumbnailUrl = guildData.songQueue[0].thumbnailUrl;

        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("**NOW PLAYING - " + songTitle + "**")
                    .setThumbnail(thumbnailUrl.url)
            ]
        });
    }
}