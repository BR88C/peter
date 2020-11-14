const Discord = require(`discord.js`);
const GphApiClient = require('giphy-js-sdk-core');
const giphyToken = process.env.GIPHY_TOKEN;
const giphy = GphApiClient(giphyToken);
const log = require(`../utils/log.js`);
const randomhex = require(`../utils/randomhex.js`);

module.exports = {
	name: `gif`,
    description: `Searches giphy for a gif based on your search query.`,
    args: true,
	guildOnly: true,
	cooldown: 3,
	usage: `<search query>`,
	async execute(client, message, args) {
        // Gets the search query based off of arguments
        let giphysearch = args.slice(0).join(` `);
        
        // Determines rating filter based on channel's nsfw setting
        let rating;
        if(!message.channel.nsfw) {
            rating = `pg`
        } else {
            rating = `r`
        }

        // Searchs giphy for [search query]
        giphy.search('gifs', {'q': giphysearch, 'rating': rating})
            .then((response) => {
                    
                // Gets One Random Image from search results
                const totalResponses = response.data.length;
                const responseIndex =Math.floor((Math.random() * 15) +1) % totalResponses;
                const responseFinal = response.data[responseIndex];
                const imageURL = responseFinal.images.fixed_height.url;

                // Creates Embed with Gif, "Here ya go!" heading and a random color
                let gifEmbed = new Discord.MessageEmbed()
                    .setColor(randomhex())
                    .setAuthor(`Here ya go!`)
                    .setImage(imageURL)
                    .setFooter(`Images courtesy of giphy`)
                    .setTimestamp(new Date());
                
                message.channel.send(gifEmbed);

                // If there is an error with the code, Giphy, or if it couldnt find the image based on the query it sends an error message
                }).catch(() => {
                    message.reply(`Looks like I couldn't get a gif based on your search query... sorry :tired_face:`);
                })
	},
}