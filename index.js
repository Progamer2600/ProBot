const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });
const fs = require("fs");

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online`)
    bot.user.setActivity("something", `${'STREAMING'}`);
});

bot.on("message", function (message) {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (cmd === `${prefix}hello`) {

        return message.channel.send("Hello");

    }

    if (cmd === `${prefix}botinfo`) {
        let botembed = new Discord.RichEmbed()
            .setDescription("Bot Information")
            .setColor("#3e18f2")
            .addField("Bot Name", bot.user.username)
            .setTitle("Bot Info");

        return message.channel.send(botembed);
    }

    if (cmd === `${prefix}report`) {
        let rUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if (!rUser) {
            return message.channel.send("Couldn't find user!");
        }
        let reason = args.join(" ").slice(22);

        let reportEmbed = new Discord.RichEmbed()
            .setDescription("Reports")
            .setColor("#3e18f2")
            .addField("Reported User", `${rUser} with ID ${rUser.id}`)
            .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
            .addField("Channel", message.channel)
            .addField("Time", `${message.channel.createdAt}`)
            .addField("Reason", reason);

        let reportChannel = message.guild.channels.find(`name`, "reports");
        if (!reportChannel) {
            let makeChannel = new Discord.Guild();
            makeChannel.createChannel("reports", `text`)
                .then(console.log)
                .catch(console.error);

        }
        if (rUser.hasPermission(`MANAGE_ROLES_OR_PERMISSIONS`)) {
            message.delete();
        }

        reportChannel.send(reportEmbed);
        message.delete();

    }

    if (cmd === `${prefix}suggest`) {
        let suggestion = args.join(" ");
        let suggestionChannel = message.guild.channels.find(`name`, "suggestions");
        let suggestEmbedAvatar = new Discord.RichEmbed()
            .setColor("#3e98f2")
            .setAuthor(`${message.author.username}`)
            .setThumbnail(`${message.author.avatarURL}`)
            .addField("Suggestion", suggestion);

        let suggestEmbedNoAvatar = new Discord.RichEmbed()
            .setColor("#3e18f2")
            .setAuthor(`${message.author.username}`)
            .addField("Suggestion", suggestion);

        if (message.author.avatarURL) {
            suggestionChannel.send(suggestEmbedAvatar);
            message.delete();
        }
        if (message.author.avatarURL === null) {
            suggestionChannel.send(suggestEmbedNoAvatar);
            message.delete();
        }
    }

    if (cmd === `${prefix}purge`) {

        let messagecount = parseInt(args);
        if (message.member.hasPermission(`ADMINISTRATOR`)) {
            message.channel.fetchMessages({ limit: messagecount }).then(messages => message.channel.bulkDelete(messages));
        }
    }
    if (cmd === `${prefix}announce`) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            let announcement = args.join(" ");
            let announcementChannel = message.guild.channels.find(`name`, "announcements");
            let announceEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.username)
                .setColor("#3e98f2")
                .addField("Announcement", announcement)
                .addField("Time", `${message.channel.createdAt}`);

            announcementChannel.send(announceEmbed);
            message.delete();
        } else {
            message.reply("You dont have permission to use this command!");
        }
    }
});

bot.login(botconfig.token);
