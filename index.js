const Discord = require('discord.js'),
    client = new Discord.Client({
        fetchAllMembers:true
    }),
    config = require('./config.json'),
    fs = require('fs')

function sendError(message, description){
    message.channel.send({embed:{
        color: 15158332,
        description: ':x: ' + description
    }}).then(r => r.delete({ timeout: 20000 }))
}

client.login(process.env.BOT_TOKEN)
client.commands = new Discord.Collection()

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if(!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})

client.on('message', message => {
    if(message.channel.id != config.channel.vayne && message.channel.id != config.channel.buvelle && message.channel.id != config.channel.laurent && message.channel.id != config.channel.crownguard && message.channel.id != config.channel.cloudfield) return

    if(message.channel.id === config.channel.vayne)
        maison ="Vayne"
    if(message.channel.id === config.channel.buvelle)
        maison ="Buvelle"
    if(message.channel.id === config.channel.laurent)
        maison ="Laurent"
    if(message.channel.id === config.channel.cloudfield)
        maison ="Cloudfield"
    if(message.channel.id === config.channel.crownguard)
        maison ="Crownguard"
    if(message.type !== 'DEFAULT' || message.author.bot) return

    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if(!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if(command){
        command.run(message,args,client)
        message.delete({ timeout: 20000 })
    }

    let commandAntichambre = message.content.split(" ")
    if(commandAntichambre[0] === '!antichambre'){
        message.delete({ timeout: 20000 })
        if(commandAntichambre.length === 5){
            let proposition = commandAntichambre[1]+" "+commandAntichambre[2]+" "+commandAntichambre[3]+" "+commandAntichambre[4]
            
            let contenuFichierMaison = fs.readFileSync('./bddMaisons/'+maison+'.txt')
            var lastTime = parseInt(fs.readFileSync('./bddMaisons/time'+maison+'.txt'),10)
            var lastTimeAttente = parseInt(fs.readFileSync('./bddMaisons/attente'+maison+'.txt'),10)
            var date = new Date()
            let laDate = date.getTime().toString()
            var tempsEcouleSec = (date.getTime() - lastTime)/1000
            var tempsEcouleSecAttente = (date.getTime() - lastTimeAttente)/1000


            if(tempsEcouleSec < 3600){
                var minRestantes = parseInt((3600-tempsEcouleSec)/60)
                sendError(message, 'Il reste encore : '+ minRestantes.toString() + ' min avant de retenter votre chance')
                return
                
            }

            const filter = response => {
                return ["OUI", "NON"].some(answer => answer.toLowerCase() === response.content.toLowerCase());
            };

            if(tempsEcouleSecAttente<20){
                message.reply("alors on veut tricher ? Tocard !")
                return
            }

            message.reply("confirmez-vous ce choix ? Répondez 'oui' ou 'non' (Vous avez 20 secondes pour répondre)").then(r => r.delete({ timeout: 20000 }))
            fs.writeFileSync('./bddMaisons/attente'+maison+'.txt', laDate)
            message.channel.awaitMessages(filter, {max: 1, time: 20000, errors: ['time']}).then(collected => {
                if(collected.first().content.toLowerCase() == 'oui'){
                
            //VERIFICATIONS
            let reponse = ""
            let vrai = "VRAI"
            let faux = "FAUX"

            if(commandAntichambre[1] === config.code1)
                reponse+=vrai+" "
            else
                reponse+=faux+" "
            if(commandAntichambre[2] === config.code2)
                reponse+=vrai+" "
            else
                reponse+=faux+" "
            if(commandAntichambre[3] === config.code3)
                reponse+=vrai+" "
            else
                reponse+=faux+" "
            if(commandAntichambre[4] === config.code4)
                reponse+=vrai
            else
                reponse+=faux
            if(reponse ==="VRAI VRAI VRAI VRAI")
                reponse="Nous vous remercions infiniment pour votre aide. Nous vous offrons cette besace remplie d'or en rémunération pour vos loyaux services"
            //RESULTATS
            message.channel.send("Proposition : "+proposition+"\nRéponse : "+reponse)
            fs.writeFileSync('./bddMaisons/'+maison+'.txt',"["+date.toLocaleDateString()+" => "+date.getHours()+":"+date.getMinutes()+"] Proposition : "+proposition+" --- Réponse : "+reponse+"\n"+contenuFichierMaison)
            fs.writeFileSync('./bddMaisons/time'+maison+'.txt', laDate)
        } else {
            message.channel.send('Demande annulée').then(r => r.delete({ timeout: 10000 }))
        }
        collected.first().delete({ timeout: 1 }) 
        }).catch(collected => {
            message.channel.send('Temps écoulé').then(r => r.delete({ timeout: 10000 }))
    })}
    else
        sendError(message, '!antichambre [part1] [part2] [part3] [part4]')
    }
})
