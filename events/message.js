const { PREFIX } = require("../config.js");

module.exports = {
    event: "messageCreate",
    async execute(message) {
        const client = this;

        if (message.author.bot || !message.guild) return;

        if (!message.content.startsWith(PREFIX)) return;
        var env = {
            message: message,
            args: message.content
                .toLowerCase()
                .substr(PREFIX.length)
                .split(" "),
            client: client
        };

        var command = client.commands.find(env.args[0]);
        if (command) command.execute(env);
    }
}