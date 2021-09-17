const GuildManager = require("../guildManager.js");
const Discord = require("discord.js");

module.exports = {
    names: ["loop"],
    description: 'loops the playing song',
    usage: 'loop',
    async execute(Env) {
        const { message, client, args } = Env;

        let guildData = GuildManager.getGuild(message.guild.id);

        if (!guildData) return message.channel.send({
            embeds: [new Discord.MessageEmbed()
                .setDescription("Nothing is playing...")]
        });

        guildData.loop = !guildData.loop;

        GuildManager.setGuild(message.guild.id, guildData);

        message.channel.send(`**Loop ${guildData.loop ? "Enabled" : "Disabled"}**`);
    }
}