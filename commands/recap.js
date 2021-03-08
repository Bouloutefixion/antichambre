module.exports = {
    run: message => message.channel.send("Voici un récapitulatif de toutes les tentatives de la maison "+maison, { files: ["./bddMaisons/"+maison+".txt"] }),
    name: 'recap'
}