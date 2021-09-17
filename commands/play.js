const YTDL = require("ytdl-core");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus } = require("@discordjs/voice");
const GuildManager = require("../guildManager.js");
const Discord = require("discord.js");

module.exports = {
    names: ["play", "p"],
    description: 'play a song',
    usage: 'play <youtube url>',
    async execute(Env) {
        const { message, client, args } = Env;

        if (!args[1]) return message.channel.send("Please enter a valid URL");

        let voiceChannel = message.member.voice?.channel;
        if (!voiceChannel) return message.channel.send("You must be in a voice channel to play");

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        let url = message.content.split(" ")[1]; // CASE SENSITIVE BTW LOL, cannot use args because args is all lowercase

        let info = await YTDL.getInfo(url);

        let songTitle = info.videoDetails.title;

        let audioPlayer;

        let guildData = GuildManager.getGuild(message.guild.id);

        if (!guildData) {
            let musicStream = await YTDL(url, { filter: "audioonly" });
            let resource = createAudioResource(musicStream, {
                inputType: StreamType.Arbitrary,
            });

            audioPlayer = createAudioPlayer(); // each guild has its own audio player
            audioPlayer.on("stateChange", async (oldState, newState) => {
                if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                    // queue next song
                    let guildInfo = GuildManager.getGuild(message.guild.id);
                    if (guildInfo) {
                        if (!guildInfo.loop) {
                            guildInfo.songQueue.shift();
                            if (guildInfo.songQueue[0]) {
                                guildInfo.songQueue[0].playing = true;
                                let stream = await YTDL(guildInfo.songQueue[0].url, { filter: "audioonly" });
                                let musicResource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
                                audioPlayer.play(musicResource);
                            }
                        } else {
                            let stream = await YTDL(guildInfo.songQueue[0].url, { filter: "audioonly" });
                            let musicResource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
                            audioPlayer.play(musicResource);
                        }
                    }

                } else if (newState.status === AudioPlayerStatus.Playing) {
                    // a new track is now playing
                }
            });

            GuildManager.setGuild(message.guild.id, {
                audioPlayer: audioPlayer,
                connection: connection,
                songQueue: [{ url: url, name: songTitle, requester: message.author.id, playing: true }],
                loop: false
            });

            audioPlayer.play(resource);

            connection.subscribe(audioPlayer);
        } else {
            audioPlayer = guildData.audioPlayer;
            guildData.songQueue.push({ url: url, name: songTitle, requester: message.author.id, playing: false });

            if (guildData.songQueue.length == 1) {
                // only song in queue, then play
                guildData.songQueue[0].playing = true;
                let musicStream = await YTDL(url, { filter: "audioonly" });
                let resource = createAudioResource(musicStream, {
                    inputType: StreamType.Arbitrary,
                });
                audioPlayer.play(resource);
            }

            GuildManager.setGuild(message.guild.id, guildData);
        }

        let thumbnailUrl = info.videoDetails.thumbnail.thumbnails[0];

        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle("**Added to Queue - " + songTitle + "**")
                    .setThumbnail(thumbnailUrl.url)
            ]
        })
    }
}