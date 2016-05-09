try
{
  var Discord = require("discord.js");
}
catch(e)
{
  console.log("discord.js was not found, exiting program.");
  process.exit();
}

try
{
  var fs = require('fs');
}
catch(e)
{
  console.log("fs not found, exiting program.");
  process.exit();
}

try
{
  var AuthDetails = require("./auth.json");
}
catch(e)
{
  console.log("auth.json was not found, exiting program.");
  process.exit();
}


try {
	var yt = require("./youtube_plugin");
	var youtube_plugin = new yt();
} catch(e){
	console.log("couldn't load youtube plugin!\n"+e.stack);
}

try
{
  var cleverbot = require("cleverbot-node");
  talkbot = new cleverbot;
  cleverbot.prepare(function(){});
}
catch(e)
{
  console.log("cleverbot-node was not found. !talk will not be useable.")
}

try
{
  var Wikipedia = require("wikijs");
}
catch(e)
{
  console.log("wikijs was not found. !wiki will not be useable.");
}

try
{
  var Weather = require("weather-js");
}
catch(e)
{
  console.log("weather-js was not found. !weather will not be useable.");
}

var startTime = Date.now();
var rouletteResult = 0;
rouletteResult = Math.floor(Math.random() * 6) + 1;
var commands =
{
    "ping":
    {
        description: "Tests to see if the server/bot is alive.",
        process: function(bot, msg, suffix)
        {
          bot.sendMessage(msg.channel, "pong!");
          if(suffix)
          {
            bot.sendMessage(msg.channel, "!ping takes no arguments.");
          }
        }
    },
    "pong":
    {
      description: "Isn't this the same thing as !ping?",
      process: function(bot, msg, suffix)
      {
        bot.sendMessage(msg.channel, "What do you think I am? an Atari bot?")
        if(suffix)
        {
          bot.sendMessage(msg.channel, "!pong takes no arguments.");
        }
      }
    },
    "heresy":
    {
      description: "Do I detect heresy over here?",
      process: function(bot, msg, suffix)
      {
        fs.readFile('heresy.txt', 'utf8', function(err, data)
        {
          if(err)
          {
            bot.sendMessage(msg.channel, "heresy.txt not found. Notify beano that he has misplaced a file.");
            return;
          }
          var lines = data.split('\n');
          bot.sendMessage(msg.channel, lines[Math.floor(Math.random()*lines.length)]);
        });
        if(suffix)
        {
          bot.sendMessage(msg.channel, "!heresy takes no arguments.");
        }
      }
    },
    "roll":
    {
      usage: "<max value>",
      description: "Returns a random number between 1 and max value. If no max value is set, it defaults to 100.",
      process: function(bot,msg,suffix)
      {
        var suffixIsANumber = isNaN(suffix);
        if (suffixIsANumber)
        {
          bot.sendMessage(msg.channel, "usage: !roll <number>");
          return;
        }
        var max = 100;
        if(suffix)
        {
          max = suffix;
        }
        var val = Math.floor(Math.random() * max) + 1;
        bot.sendMessage(msg.channel, msg.sender.name + " : **" + val + "**");
      }
    },
    "yt":
    {
        usage: "<youtube search>",
        description: "Gets top result on youtube with your search query.",
        process: function(bot,msg,suffix)
        {
          if (!suffix)
          {
            bot.sendMessage(msg.channel, "usage: !yt <search terms>")
            return;
          }
            youtube_plugin.respond(suffix,msg.channel,bot);
        }
    },
    "wiki": {
        usage: "<search terms>",
        description: "Returns the summary of the first matching search result from Wikipedia",
        process: function(bot,msg,suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel,"usage: !wiki <search terms>");
                return;
            }
            new Wikipedia().search(query,1).then(function(data) {
                new Wikipedia().page(data.results[0]).then(function(page) {
                    page.summary().then(function(summary) {
                        var sumText = summary.toString().split('\n');
                        var continuation = function() {
                            var paragraph = sumText.shift();
                            if(paragraph){
                                // bot.sendMessage(msg.channel, paragraph, continuation);
                                bot.sendMessage(msg.channel,paragraph);
                            }
                        };
                        continuation();
                    });
                });
            },function(err){
                bot.sendMessage(msg.channel,err);
            });
        }
    },
    "blame":
    {
      description: "when you need someone to blame...",
      process: function(bot,msg,suffix)
      {
        bot.sendMessage(msg.channel, "https://i.imgflip.com/15vk7.jpg");
        if(suffix)
        {
          bot.sendMessage(msg.channel, "!blame takes no arguments.");
        }
      }
    },
    "talk":
    {
      usage: "<message>",
      description: "Talk directly to the bot.\n\t**Note** can also be called with an @mention to the bot.",
      process: function(bot, msg, suffix)
      {
        var conv = suffix.split(" ");
        talkbot.write(conv, function(response)
        {
          bot.sendMessage(msg.channel, response.message);
        })
      }
    },
    "d6":
    {
      usage: "<number>",
      description: "Rolls a 6 sided dice. Can also choose to roll multiple dice with a number following the command.",
      process: function(bot, msg, suffix)
      {
        if (isNaN(suffix))
        {
          bot.sendMessage(msg.channel, "usage: !d6 <number>");
          return;
        }
        if(suffix)
        {
          if(suffix == Infinity)
          {
            bot.sendMessage(msg.channel, "Are you trying to break me?");
            return;
          }
          if(suffix > 500)
          {
            bot.sendMessage(msg.channel, "Maximum amount of dice to roll at once is 500.");
            return;
          }
          if(suffix < 1)
          {
            bot.sendMessage(msg.channel, "You tried to roll a negative amount of dice... Just think about that for a second...");
            return;
          }
          var suffixNumber = 0, total = 0, one = 0, two = 0, three = 0, four = 0, five = 0, six = 0;
          var result = "";
          suffixNumber = suffix;
          for(i = 0; i < suffixNumber; i++)
          {
            var val = Math.floor(Math.random() * 6) + 1;
            result += val;
            result += ", ";
            total += val;
            switch(val)
            {
              case 1:
                one++;
                break;
              case 2:
                two++;
                break;
              case 3:
                three++;
                break;
              case 4:
                four++;
                break;
              case 5:
                five++;
                break;
              case 6:
                six++;
                break;
            }
          }
          bot.sendMessage(msg.channel, msg.sender.name + " : **" + result + "** \n\n1 rolls: **" + one + "**, 2 rolls: **" + two + "**, 3 rolls: **" + three + "**, 4 rolls: **" + four + "**, 5 rolls: **" + five + "**, 6 rolls: **" + six + "**, Total: **" + total + "**");
        }
        else
        {
          var val = Math.floor(Math.random() * 6) + 1;
          bot.sendMessage(msg.channel, msg.sender.name + " : **" + val + "**");
        }
      }
    },
    "gelbooru":
    {
      description: "NSFW! Pulls a random image form www.gelbooru.com",
      process: function(bot, msg, suffix)
      {
        if (isNaN(suffix))
        {
          bot.sendMessage(msg.channel, "usage: !gelbooru <number>");
          return;
        }
        if(suffix)
        {
          bot.sendMessage(msg.channel, "**" + msg.sender.name + "** : http://gelbooru.com/index.php?page=post&s=view&id=" + suffix);
        }
        else
        {
          var val = Math.floor(Math.random() * 3073194) + 1;
          bot.sendMessage(msg.channel, "**" + msg.sender.name + "** : http://gelbooru.com/index.php?page=post&s=view&id=" + val);
        }
      }
    },
    "xkcd":
    {
      usage: "<number>",
      description: "Pulls an XKCD comic of the number specified. If no number is specified, a random comic is chosen.",
      process: function(bot, msg, suffix)
      {
        if (isNaN(suffix))
        {
          bot.sendMessage(msg.channel, "usage: !xkcd <number>");
          return;
        }
        var comicNumber = 0;
        if(suffix)
        {
          comicNumber = suffix;
          bot.sendMessage(msg.channel, "https://www.xkcd.com/" + comicNumber + "/");
        }
        else
        {
          comicNumber = Math.floor(Math.random() * 1648) + 1;
          bot.sendMessage(msg.channel, "https://www.xkcd.com/" + comicNumber + "/");
        }
      }
    },
    "slivsenpai":
    {
      description: "NSFW! Displays a music video featuring Sliv's senpai!",
      process: function(bot, msg, suffix)
      {
        bot.sendMessage(msg.channel, "Kawaii desu ne~~。❤ ❤ かわいいです https://www.youtube.com/watch?v=M5YwpfglOwc");
        if(suffix)
        {
          bot.sendMessage(msg.channel, "!slivsenpai takes no arguments.");
        }
      }
    },
    "h_boobs":
    {
      description: "NSFW! Displays a random hentai porn image involving boobs.",
      process: function(bot, msg, suffix)
      {
        fs.readFile('h_boobs.txt', 'utf8',function(err, data)
        {
          if (err)
          {
            bot.sendMessage(msg.channel, "h_boobs.txt not found. Notify beano that he has misplaced a file.")
            return;
          }
          var lines = data.split('\n');
          bot.sendMessage(msg.channel, lines[Math.floor(Math.random()*lines.length)]);
        });
        if(suffix)
        {
          bot.sendMessage(msg.channel, "!h_boobs takes no arguments.");
        }
      }
    },
    "h_ass":
    {
      description: "NSFW! Displays a random hentai porn image involving ass.",
      process: function(bot, msg, suffix)
      {
        fs.readFile('h_ass.txt', 'utf8', function(err, data)
        {
          if(err)
          {
            bot.sendMessage(msg.channel, "h_ass.txt not found. Notify beano that he has misplaced a file.")
            return;
          }
          var lines = data.split('\n');
          bot.sendMessage(msg.channel, lines[Math.floor(Math.random()*lines.length)]);

        });
        if(suffix)
        {
          bot.sendMessage(msg.channel, "!h_ass takes no arguments.");
        }
      }
    },
    "roulette":
    {
    description: "Feeling lucky?",
    process: function(bot, msg, suffix)
      {
        if(rouletteResult > 1)
        {
          rouletteResult--;
          bot.sendMessage(msg.channel, msg.sender.name + ": Click.");
        }
        else
        {
          bot.sendMessage(msg.channel, "**BANG!** " + msg.sender.name + " had their brains blown out. Reloading and respinning the barrel.");
          rouletteResult = Math.floor(Math.random() * 6) + 1;
        }
        if(suffix)
        {
          bot.sendMessage(msg.channel, "!roulette takes no arguments.");
        }
      }
    },
    "uptime":
    {
      description: "Returns the amount of time since the bot started.",
	    process: function(bot,msg,suffix){
		      var now = Date.now();
		      var msec = now - startTime;
		      console.log("Uptime is " + msec + " milliseconds");
		      var days = Math.floor(msec / 1000 / 60 / 60 / 24);
		      msec -= days * 1000 * 60 * 60 * 24;
		      var hours = Math.floor(msec / 1000 / 60 / 60);
		      msec -= hours * 1000 * 60 * 60;
		      var mins = Math.floor(msec / 1000 / 60);
		      msec -= mins * 1000 * 60;
		      var secs = Math.floor(msec / 1000);
		      var timestr = "";
		      if(days > 0)
          {
			         timestr += days + " days ";
		      }
		      if(hours > 0)
          {
			         timestr += hours + " hours ";
		      }
		      if(mins > 0)
          {
			         timestr += mins + " minutes ";
          }
		      if(secs > 0)
          {
			         timestr += secs + " seconds ";
		      }
		      bot.sendMessage(msg.channel,"Uptime: " + timestr);
          if (suffix)
          {
            bot.sendMessage(msg.channel, "!uptime takes no arguments.");
          }
	      }
    },
    "av":
    {
      usage: "<@user>",
      description: "Posts the URL of the mentioned user's avatar.",
      process: function(bot, msg, suffix)
      {
        if(!suffix) {
            bot.sendMessage(msg.channel,"usage: !av <@user>");
            return;
        }
        try
        {
          var target = msg.mentions[0].toString().substring(2);
          target = target.substring(0, target.length-1);
          bot.sendMessage(msg.channel, "Avatar of mentioned user: " + msg.channel.server.members.get('id', target).avatarURL);
        }
        catch(e)
        {
          bot.sendMessage(msg.channel, "User was not found.")
        }
      }
    },
    "8ball":
    {
      usage: "<message>",
      description: "Consult the magic 8ball.",
      process: function(bot, msg, suffix)
      {
        fs.readFile("8ball.txt", "UTF8", function(err, data)
        {
          if (err)
          {
            bot.sendMessage(msg.channel, "8ball.txt not found. Notify beano that he has misplaced a file.");
            return;
          }
          if (!suffix)
          {
            bot.sendMessage(msg.channel, "usage: !8ball <message>");
            return;
          }
          var lines = data.split('\n');
          bot.sendMessage(msg.channel, msg.author + " " + lines[Math.floor(Math.random()*lines.length)]);
        });
      }
    },
    "salt":
    {
      description: "For when that one guy is so salty.",
      process: function(bot, msg, suffix)
      {
        fs.readFile("salt.txt", "UTF8", function(err, data)
        {
          if (err)
          {
            bot.sendMessage(msg.channel, "salt.txt not found. Notify beano that he has misplaced a file.");
            return;
          }
          var lines = data.split('\n');
          bot.sendMessage(msg.channel, lines[Math.floor(Math.random()*lines.length)]);
          if(suffix)
          {
            bot.sendMessage(msg.channel, "!salt takes no arguments.");
          }
        });
      }
    },
    "choose":
    {
      usage: "<item1>;<item2>;<item3>;etc",
      description: "For when you just can't decide, the bot will do it for you.",
      process: function(bot, msg, suffix)
      {
        if (!suffix)
        {
          bot.sendMessage(msg.channel, "usage: !choose <item1>;<item2>;<item3>;etc.")
          return;
        }
        var choice = suffix.split(';');
        bot.sendMessage(msg.channel, choice[Math.floor(Math.random()*choice.length)]);
      }
    },
    "source":
    {
      description: "links to github for the bot's sourcecode.",
      process: function(bot, msg, suffix)
      {
        bot.sendMessage(msg.channel, "Sourcecode: https://github.com/beanoman4/BeanBot");
        if (suffix)
        {
          bot.sendMessage(msg.channel, "!source takes no arguments.");
        }
      }
    },
    "triggered":
    {
      description: "TRIGGER WARNINGS PLEASE!",
      process: function(bot, msg, suffix)
      {
        fs.readFile("triggered.txt", "UTF8", function(err, data)
        {
          if (err)
          {
            bot.sendMessage(msg.channel, "triggered.txt not found. Notify beano that he has misplaced a file.");
            return;
          }
          var lines = data.split('\n');
          bot.sendMessage(msg.channel, lines[Math.floor(Math.random()*lines.length)]);
          if(suffix)
          {
            bot.sendMessage(msg.channel, "!triggered takes no arguments.");
          }
        });
      }
    },
    "weather":
    {
      usage: "!weather <location>",
      description: "Displays weather information for the described area.",
      process: function(bot, msg, suffix)
      {
        var returnInfo = "";
        if (!suffix)
        {
          bot.sendMessage(msg.channel, "usage: !weather <location>");
          return;
        }
        try
        {
          Weather.find({search: suffix, degreeType: 'C'}, function(err, result)
          {
            if(err)
            {
              bot.sendMessage(msg.channel, "unable to handle your search term: " + suffix);
              return;
            }
            result = result[0];
            returnInfo += "Weather information for location: " + result.location.name + "\n";
            returnInfo += "```";
            if (result.location.timezone > 0)
            {
              returnInfo += "timezone: GMT +" + result.location.timezone + "\n";
            }
            else
            {
              returnInfo += "timezone: GMT " + result.location.timezone + "\n";
            }
            returnInfo += "Observation time: " + result.current.observationtime + "\n";
            returnInfo += "Obeservation location: " + result.current.observationpoint + "\n\n";
            returnInfo += "Temprature: " + result.current.temperature + "°C\n\n";
            returnInfo += result.current.skytext + "\n\n";
            returnInfo += "Humidity: " + result.current.humidity + "\n";
            returnInfo += "Wind: " + result.current.winddisplay + "\n"
            returnInfo += "```";
            //console.log(result.location.name);
            bot.sendMessage(msg.channel, returnInfo);
          });
        }
        catch(e)
        {
          bot.sendMessage(msg.channel, "Unable to handle search term: " + suffix);
        }
      }
    }
}

function getDateTime()
{
  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  return hour + ":" + min + ":" + sec;
}

var bot = new Discord.Client();

bot.on("ready", function()
{
  console.log("Ready to begin.")
});

bot.on("message", function(msg)
{
  //check if message is a command
  if(msg.author.id != bot.user.id && (msg.content[0] === '!' || msg.content.indexOf(bot.user.mention()) == 0))
  {
    var now = getDateTime();
    console.log(now + " : parsing " + msg.content + " from " + msg.sender.name + " as a command");
    var cmdTxt = msg.content.split(" ")[0].substring(1);
    var suffix = msg.content.substring(cmdTxt.length+2); //add one for the ! and another for the space

    var cmd = commands[cmdTxt];
    if(cmdTxt === "help")
    {
      // help shows the list of commands.
      bot.sendMessage(msg.channel, "PMing " + msg.author.name + " a list of commands.")
      if (suffix)
      {
        bot.sendMessage(msg.channel, "!help takes no arguments.");
      }
      bot.sendMessage(msg.author, "Available Commands:", function()
      {
        var info = "";
        for(var cmd in commands)
        {
          info += "!" + cmd;
          var usage = commands[cmd].usage;
          if(usage)
          {
            info += " " + usage;
          }
          var description = commands[cmd].description;
          if(description)
          {
            info += "\n\t" + description + "\n\n";
          }
        }
        bot.sendMessage(msg.author, "```" + info + "```")
      });
    }
    else if(cmd)
    {
      try
      {
        cmd.process(bot,msg,suffix);
      }
      catch(e)
      {
        bot.sendMessage(msg.channel, "command " + cmdTxt + " failed :(\n" + e.stack);
      }
    }
    else if (msg.content.indexOf(bot.user.mention()) != 0)
    {
      bot.sendMessage(msg.channel, "Invalid command : !" + cmdTxt);
    }
  }
  else
  {
    if(msg.author == bot.user)
    {
      return;
    }
  }
  {
    if((msg.author != bot.user && msg.isMentioned(bot.user)) && msg.content[0] != '!' && msg.content[0] != ".")
    {
      var cmdTxt = msg.content.split(" ")[0].substring(1);
      var suffix = msg.content.substring(cmdTxt.length+2);
      var conv = suffix.split(" ");
      talkbot.write(conv, function(response)
      {
        bot.sendMessage(msg.channel, response.message);
      })
    }
  }

});

function tryReconnect()
{
  var now = getDateTime();
  console.log(now + " : Disconnected from server. Attempting to reconnect.");
  bot.login(AuthDetails.email, AuthDetails.password).then(success).catch(err);
  function success(token)
  {
    return;
  }
  function err(error)
  {
    setTimeout(tryReconnect, 10000);
  }
}

bot.on("disconnected", function()
{
  tryReconnect();
});

bot.login(AuthDetails.email, AuthDetails.password);
