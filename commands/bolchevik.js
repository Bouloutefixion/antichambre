const { Client } = require("discord.js");

module.exports = {
    run: message => message.channel.send("Oui, c'est bien moi "+'<@256460721234116609>'+", le bolchevik que je suis !").then(r => r.delete({ timeout: 20000 })),
    name: 'bolchevik'
}