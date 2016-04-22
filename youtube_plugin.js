var util = require('util');
var winston = require('winston');
var youtube_node = require ('youtube-node');
var AuthDetails = require ("./auth.json");

function YoutubePlugin()
{
  this.RickrollURL = 'http://www.youtube.com/watch?v=oHg5SJYRHA0';
  this.youtube = new youtube_node();
  this.youtube.setKey(AuthDetails.youtube_api_key);
};

YoutubePlugin.prototype.respond = function (query, channel, bot)
{
  this.youtube.search(query, 3, function(error, result){
    if (error)
    {
      //winston.error("Error querying youtube: " + error);
      bot.sendMessage(channel, "Error querying youtube.");
    }
    else
    {
      if (!result || !result.items || result.items.length < 1)
      {
        //winston.error("No results from youtube");
					bot.sendMessage(channel, "No videos found.");
      }
      else {
        try
        {
          i = 0;
          if (result.items[0].id.videoId = 'undefiend')
          {
            i = 1;
          }
          if (result.items[1].id.videoId = 'undefiend')
          {
            i = 2;
          }
          bot.sendMessage(channel, "http://www.youtube.com/watch?v=" + result.items[i].id.videoId);
        }
        catch(e)
        {
          bot.sendMessage(channel, "http://www.youtube.com/watch?v=" + query);
          return;
        }
      }
    }
  });
};

module.exports = YoutubePlugin;
