const Discord = require(`discord.js`);
const GphApiClient = require('giphy-js-sdk-core');
const giphyToken = process.env.GIPHY_TOKEN;
const giphy = GphApiClient(giphyToken);

module.exports = {
	name: `gif`,
    description: `Searches giphy for a gif based on your search query.`,
    args: true,
	guildOnly: true,
	cooldown: 3,
	usage: `<search query>`,
	async execute(client, message, args) {
        // Logs that its starting the gif post process
        console.log(`\x1b[33m`, `\n    [STARTING GIF SEARCH]`);

        // Sets up the random integer function
        function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Gets the search query based off of arguments
        giphysearch = args.slice(0).join(` `);
        console.log('\x1b[33m', `   Search query: ${giphysearch}`);
        
        // Searchs giphy for [search query]
        giphy.search('gifs', {"q": `${giphysearch}`})
            .then((response) => {
                    
                // Gets One Random Image from search results
                const totalResponses = response.data.length;
                const responseIndex =Math.floor((Math.random() * 15) +1) % totalResponses;
                const responseFinal = response.data[responseIndex];
                const imageURL = responseFinal.images.fixed_height.url;

                // Prints the final url in the console log
                console.log('\x1b[33m', `   URL: ${imageURL}`);

                // Creates Embed with Gif, "Here ya go!" heading and a random color
                let gifEmbed = new Discord.MessageEmbed()
                    .setColor(getRandomInt(1,16777215))
                    .setAuthor(`Here ya go!`)
                    .setImage(imageURL)
                    .setFooter(`Images courtesy of giphy`)
                
                // Logs that the embed is created
                console.log(`\x1b[33m`,`   Created Embed`);

                // Logs that the message is done then posts it"
                console.log(`\x1b[32m`, `   [FINISHED GIF SEARCH`);
                message.channel.send(gifEmbed);

                // If there is an error with the code, Giphy, or if it couldnt find the image based on the query it sends an error message
                }).catch(() => {
                    console.log(`\x1b[31m`,`   [ERROR] Unable to send, create, or find an image for the gif post.\n`);
                    message.reply(`Looks like I couldn't get a gif based on your search query... sorry :tired_face:`);
                })
	},
}