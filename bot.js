// share https://discordapp.com/api/oauth2/authorize?client_id=696806240499531786&permissions=8&scope=bot

const config = require('./config.json');
const potions = require('./potions.json')

const Discord = require('discord.js')
const bot = new Discord.Client({disableEveryone: true});
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var BIN_ID = "5e9ee6f5435f5604bb4560d0";

bot.on('ready', async () =>{
    console.log(`Logged as ${bot.user.tag}.`)
    bot.user.setActivity('Learning js')
});

bot.on('message', async message => {
    if(message.author.bot) return ;// Vérifie si le message viens d'un utilisateur et non du bot
    if(message.channel.type === 'dm') return ;// Vérifie si les messages viennent d'un channel et non des messages privés

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    // Help
    if (command === `${prefix}help`){
        let embed = new Discord.MessageEmbed()
        .setDescription('Commands')    
        .setColor('#7289da')
        .setThumbnail('https://lh3.googleusercontent.com/proxy/3eKLGqeOwQMCfk9A2-ARyVB4ITZbSjN0brVG64564cRDRq0W7EueGgJvw_P9Tu9hmdyk1I9ItprSkgSEe_4QUblH-HqXfpMpDso_OUoNv_OkEISz454pt9s01xx_PwOOWwq20hPZ')
        .addField("Potions", `${prefix}popo : shows available potions\n${prefix}popo {potions} : shows the potion brewing`)
        .addField("Coordinates", `${prefix}coord : shows saved coordinates\n${prefix}coord add {location} {x} {y} {z} : adds coordinates of a location\n${prefix}coord edit {location} {x} {y} {z} : edits coordinates of a location\n${prefix}coord remove {location} : removes a location`)
        return message.channel.send(embed);
    }
    
    // Coordinates
    else if (command === `${prefix}coord`) {
        let serverId = message.guild.id;

        // First get the data
        var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
        let req = new XMLHttpRequest();

        req.open("GET", `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, true);
        req.setRequestHeader("X-Master-Key", config.key);
        req.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200){
                let data = JSON.parse(req.responseText)["record"];
                
                // shows saved coordinates command
                if (args.length === 0) {

                    if (data["coordinates"].hasOwnProperty(serverId) === false) { // check that the server is in the database
                        let embed = new Discord.MessageEmbed()
                            .setColor('#7289da')
                            .setThumbnail('https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png')
                            .addField("Error", "You don't have any saved coordinates")
                        return message.channel.send(embed);
                    } else if (Object.keys(data["coordinates"][serverId]).length === 0) { // checks that there are saved coordinates
                        let embed = new Discord.MessageEmbed()
                            .setColor('#7289da')
                            .setThumbnail('https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png')
                            .addField("Error", "You don't have any saved coordinates")
                        return message.channel.send(embed);
                    } else { // then send coordinates
                        let response = ''
                        for (key in data["coordinates"][serverId]) {
                            let x = data["coordinates"][serverId][key][0];
                            let y = data["coordinates"][serverId][key][1];
                            let z = data["coordinates"][serverId][key][2];
                            response += `${key} : ${x}, ${y}, ${z}\n`
                        }
                        let embed = new Discord.MessageEmbed() 
                            .setColor('#7289da')
                            .setThumbnail('https://learnopengl.com/img/getting-started/coordinate_systems_right_handed.png')
                            .addField("Coordinates", response)
                        return message.channel.send(embed);
                    }
                }

                // add and edit commands
                if (args[0].toLowerCase() === 'add' || args[0].toLowerCase() === 'edit') {
                    
                    if (args.length !== 5) { // checks that the arguments are all well provided 
                        let embed = new Discord.MessageEmbed()
                            .setColor('#7289da')
                            .setThumbnail('https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png')
                            .addField("Error", `Wrong arguments. Please see \`${prefix}help\`.`)
                        return message.channel.send(embed);
                    } else { // then edit the database and create the message
                        if (data["coordinates"].hasOwnProperty(serverId) === false) {
                            data["coordinates"][serverId] = {}
                        }
                        data["coordinates"][serverId][args[1]] = [args[2], args[3], args[4]];
                        modifiedData = JSON.stringify(data);
                        var embed = new Discord.MessageEmbed()
                            .setColor('#7289da')
                            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/OOjs_UI_icon_check-constructive.svg/1200px-OOjs_UI_icon_check-constructive.svg.png')
                            .addField("Coordinates", `Successfully saved the location of ${args[1]} : ${args[2]}, ${args[3]}, ${args[4]}`)
                    }
                }

                // remove command
                if (args[0].toLowerCase() === 'remove') {

                    if (args.length !== 2) { // checks that the arguments are all well provided
                        let embed = new Discord.MessageEmbed()
                        .setColor('#7289da')
                        .setThumbnail('https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png')
                        .addField("Error", `Wrong arguments. Please see \`${prefix}help\`.`)
                        return message.channel.send(embed);
                    } else if (data["coordinates"].hasOwnProperty(serverId) === false) { // checks that the server is in the database
                        let embed = new Discord.MessageEmbed()
                            .setColor('#7289da')
                            .setThumbnail('https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png')
                            .addField("Error", "You don't have any saved coordinates.")
                        return message.channel.send(embed);
                    } else if (data["coordinates"][serverId].hasOwnProperty(args[1]) === false) { // checks that the server has the location
                        let embed = new Discord.MessageEmbed()
                                .setColor('#7289da')
                                .setThumbnail('https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png')
                                .addField("Error", `You don't have a location ${args[1]} saved.`)
                        return message.channel.send(embed);
                    } else { // then edit the database and create the message
                            delete data["coordinates"][serverId][args[1]];
                            modifiedData = JSON.stringify(data)
                            var embed = new Discord.MessageEmbed()
                                .setColor('#7289da')
                                .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/OOjs_UI_icon_check-constructive.svg/1200px-OOjs_UI_icon_check-constructive.svg.png')
                                .addField("Coordinates", `Successfully removed the location of ${args[1]}.`)
                    }
                }

                // put modified data if exists
                if (modifiedData !== undefined) {
                    let push = new XMLHttpRequest();

                    push.onreadystatechange = function() {
                        if (this.readyState==4 && this.status==200) {
                            return message.channel.send(embed); // sends the previously defined message
                        }
                    }

                    push.open("PUT", `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
                    push.setRequestHeader("Content-Type", "application/json");
                    push.setRequestHeader("X-Master-Key", config.key);
                    push.send(modifiedData);
                }
            }
        }
        req.send();

    }

    // Potions
    else if (command === `${prefix}popo`) {
        let target = args.join(' ').toLowerCase();
        
        if (target === '') {
            let embed = new Discord.MessageEmbed()
                .setColor('#7289da')
                .setThumbnail('https://gamepedia.cursecdn.com/minecraft_gamepedia/f/fa/Brewing_Stand.png')
                .addField("List of potions", potions["list"]);
            return message.channel.send(embed);
        }
        else if (potions.hasOwnProperty(target)) {
            let potion = potions[target];
            let embed = new Discord.MessageEmbed()
                .setDescription(potion["description"])
                .setColor('#7289da')
                .setThumbnail(potion["thumbnail"])
                .addField('Brewing', potion["brewing"]);
            return message.channel.send(embed);
        }
        else {
            let embed = new Discord.MessageEmbed()
                .setColor('#7289da')
                .setThumbnail('https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png')
                .addField("Error", `${args.join(' ')} potion is unknown. Use \`${prefix}popo\` to see what potions are available.`)
            return message.channel.send(embed);
        }
    }

});

bot.login(config.token);