const fs = require("fs");
const Discord = require("discord.js");

function setupDiscordPlaysBot(klass, options) {
  // Make datadir and subfolders
  if (!fs.existsSync(options.datadir)) fs.mkdirSync(options.datadir);
  if (!fs.existsSync(options.guildSettingsPath)) fs.mkdirSync(options.guildSettingsPath);
  if (!fs.existsSync(options.userSettingsPath)) fs.mkdirSync(options.userSettingsPath);
  if (!fs.existsSync(options.gameDataPath)) fs.mkdirSync(options.gameDataPath);

  var bot = null;

  const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGES],
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  client.on("ready", () => {
    console.log(`${klass.getName()} v${klass.getVersion()}`);
    console.log(`Do \`>credits\` to see the people who made this crazy bot`);
    console.log(`Do \`>deploy guild\` to setup slash commands in the guild`);
    bot = new klass(client, myServer, options);

    myServer.sendMinesweeperBot(bot);
    myServer.sendBotData({ tag: client.user.tag });
  });

  client.on("messageCreate", (message) => {
    if (bot == null) return;
    if (message.guild == null && bot.menuController.waitingForInput(message.author)) return bot.menuController.sendInput(message);

    // Respond to messages for the server's prefix or the default if the server doesn't have settings or the text channel is in a DM
    let config = bot.getPerServerSettings(message.guild == null ? "dm-" + message.author.id : message.guild.id.toString());
    if (message.mentions.has(client.user)) return bot.processPing(message.channel, config);
    if (message.content.startsWith(config.prefix) && !message.content.startsWith(`${config.prefix} `)) return bot.processMessageCommand(message, config);
  });

  client.on("guildCreate", (guild) => {
    if (bot == null) return;
    let config = bot.getPerServerSettings(guild.id.toString());
    var embed = new Discord.MessageEmbed()
      .setColor("#5334cf")
      .setAuthor({name:klass.getName(),iconURL:bot.jsonfile.logo})
      .setTitle("Welcome")
      .setDescription(["Thanks for inviting me to your server, here's how to get started.", `Run \`${config.prefix}play\` to create a new game`, `Run \`${config.prefix}help\` for more information`].join("\n"));

    guild.channels.fetch().then((channels) => {
      channels = channels.filter((x) => x.isText());
      if (channels.size > 0) {
        let goodChannelRegex = /.+(general).+/i;
        let outChannel = channels.first();
        for (const value of channels.values()) {
          if (goodChannelRegex.test(value.name)) {
            outChannel = value;
            break;
          }
        }
        outChannel.send({ embeds: [embed] });
      }
    });
  });

  client.on("interactionCreate", (interaction) => {
    if (interaction.isButton()) {
      bot.menuController.clickButton(interaction, interaction.user);
    } else if (interaction.isCommand()) {
      let config = bot.getPerServerSettings(interaction.guild == null ? "dm-" + interaction.user.id : interaction.guild.id.toString());
      bot.processInteractionCommand(interaction, config);
    }
  });

  function execute() {
    // login stuffs
    client.login(process.env.DISCORD_TOKEN);
  }

  function shutdown() {
    // Gracefully close and cleanup bot class
    bot.end();
    // Gracefully logout and terminate the Discord client
    client.destroy();
  }

  return { execute, shutdown };
}

module.exports = setupDiscordPlaysBot;
