var guilds = {};
/*
    guildId: {
        audioPlayer: audioPlayer,
        connection: connection,
        songQueue: [{ url: String, name: String, requester: id, playing: bool }],
        loop: bool
    }
*/

module.exports = {
    setGuild: (id, data) => {
        guilds[id] = data;
    },
    getGuild: (id) => {
        return guilds[id];
    }
}