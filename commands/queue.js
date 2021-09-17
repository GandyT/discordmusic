const GuildManager = require("../guildManager.js");
const Discord = require("discord.js");

module.exports = {
    names: ["queue", "q"],
    description: 'gets the queue for the server',
    usage: 'queue',
    async execute(Env) {
        const { message, client, args } = Env;

        let guildData = GuildManager.getGuild(message.guild.id);

        if (!guildData) return message.channel.send({
            embeds: [new Discord.MessageEmbed()
                .setDescription("Nothing is in queue...")]
        });

        if (!guildData.songQueue.length) return message.channel.send({
            embeds: [new Discord.MessageEmbed()
                .setDescription("Nothing is in queue...")]
        });

        let queueStr = `**NOW PLAYING - ${guildData.songQueue[0].name} - <@${guildData.songQueue[0].requester}>**`;

        guildData.songQueue.slice(1).forEach(song => {
            queueStr += `**${song.name}** - <@${song.requester}>\n`
        })

        message.channel.send({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`**QUEUE FOR ${message.guild.name}**`)
                .setDescription(queueStr || "Nothing is in queue...")
                .setFooter(`Loop ${guildData.loop ? "Enabled" : "Disabled"}`)]
        });
    }
}