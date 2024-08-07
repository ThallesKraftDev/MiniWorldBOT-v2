import language from "../../language/skins.js";
import db from "../../mongodb/user.js";
import skins from "../../functions/img/data.js";
import { EmbedBuilder } from "discord.js";
import tempo from "ms";
export default [{
  structure: {
    name: "skin",
    description: "Grupo de Comandos",
    type: 1,
    options: [{
      name: "view",
      description: "See all the skins you have.",
      name_localizations: {
        "pt-BR": "ver"
      },
      description_localizations: {
        "pt-BR": "Veja todas as skins que você tem"
      },
      type: 1,
      integration_types: [0, 1],
        contexts: [0, 1, 2],
      options: [{
        name: "user",
        description: "Mention user or user ID",
        type: 6,
        required: false
      }]
    },{
      name: "gift",
      description: "Send a skin as a gift to another user",
      name_localizations: {
        "pt-BR": "presentear"
      },
      description_localizations: {
        "pt-BR": "Envie uma skin como presente pra algum usuário"
      },
      type: 1,
      options: [{
        name: "user",
        description: "Mention user or user ID",
        type: 6,
        required: true
      },{
        name: "id",
        description: "Skin ID",
        type: 10,
        min_value: 1,
        max_value: 70,
        required: true
      },{
        name: "amount",
        description: "Amount of skins",
        type: 10,
        min_value: 1,
        max_value: 70,
        required: true
      }]
    }]
  },

  onCommand: async(client, interaction) => {
    let data = language[interaction.locale] ? language[interaction.locale] : {
        noHave: "(@user) doesn't have any skins!",
        title: "List of Skins",
        noResponse: "You don't have that skin or you don't have the quantity entered.",
        start: `🌟 **|** (@author), you are about to send the skin (@skin) to (@user)!\n🤝 **|** By accepting this transaction, you agree to pay 2,000 Mini Beans.\nTo confirm the transaction, both parties must click on ✅!\n\n🚫 **|** **Remember:** By accepting, you agree to abide by the rules. Trading Mini Beans for real-life items (such as Nitro, money, invites, illegal/NSFW content, etc.) and selling Mini Beans for money are strictly prohibited. Send skins only to people you trust! Think of sending skins like lending a valuable item - it may be irreversible! Avoid unsafe transactions!`,
      noMoney: "You don't have 2,000 mini beans to send the skin!",
      response: "Transaction completed! The skin has been sent!"

      };

    if (interaction.options.getSubcommand() === "gift"){

      let user = interaction.options.getUser("user");

      let id = interaction.options.getNumber("id");

      let amount = interaction.options.getNumber("amount");

      let userdb_2 = await db.findOne({
        userId: user.id
      })

      if (!userdb_2){
        let newUser = new db({
          userId: user.id
        })

        await newUser.save();

        userdb_2 = await db.findOne({
        userId: user.id
      })
      }

      let userdb = await db.findOne({
        userId: interaction.user.id
      })

      if (!userdb){
        let newUser = new db({
          userId: interaction.user.id
        })

        await newUser.save();

        userdb = await db.findOne({
        userId: interaction.user.id
      })
      }

      
      if (userdb.skins.length === 0){
        return await interaction.editReply({
          content: data.noHave.replace("(@user)", interaction.user)
        })
      } else {
        let personagens = [];

        let ocorrencias = contarOcorrencias(userdb.skins);

        Object.keys(ocorrencias).forEach(numero => {
    let personagem = {
        número: parseInt(numero),
        quantidade: ocorrencias[numero]
    };
    personagens.push(personagem);
});

        

        function atualizarOuRemover(id, quantidade) {
    let encontrado = false;

    
    for (let i = 0; i < personagens.length; i++) {
        if (personagens[i].número === id) {
            if (personagens[i].quantidade === quantidade) {
              personagens.splice(i, 1);
              encontrado = true;
            } else if (quantidade > personagens[i].quantidade) {
              encontrado = false;
            } else {
      personagens[i].quantidade -= quantidade;
              encontrado = true;
            }
        
            break; 
        }
      

      continue;
    }

          

    if (!encontrado) {
      return "não";
          
    } else if (encontrado) {
        return personagens;
    }
}

        let lista = atualizarOuRemover(id, amount)

        

        if (lista === "não"){
          return await interaction.editReply({
            content: data.noResponse
          })
        } else {

          if (userdb.economia.feijoes < 2000){
            return await interaction.editReply({
              content: data.noMoney
            })
          } else {

          let msg = await interaction.editReply({
            content: data.start.replace("(@author)", interaction.user).replace("(@skin)", skins[`${id}`]).replace("(@user)", user)
          })


          await msg.react("✅")


                let collectorFilter = (reaction, user) => {
	return ['✅'].includes(reaction.emoji.name) && reaction.message.id == msg.id
};

            

const collector = msg.createReactionCollector({ filter: collectorFilter, time: tempo("1h") });

            

          let user_confirm_1 = false;
          let user_confirm_2 = false;

collector.on('collect', (reaction, user_reaction) => {
  interaction.channel.send("Evento recebido")
	if (user_reaction.id === user.id){
    user_confirm_2 = true;

    pay(user_confirm_2, user_confirm_1)
  } else if (user_reaction.id === interaction.user.id){
    user_confirm_1 = true;

    pay(user_confirm_2, user_confirm_1)
  }


            async function pay(user_confirm_2, user_confirm_1){

              if (user_confirm_1 && user_confirm_2){
                userdb_2.skins.push(id);
                userdb.skins = [];
                personagens.map(x => {
                  userdb.skins.push(x["número"])
                })
                
                userdb.economia.feijoes -= 2000;
            await userdb.save()
             await userdb_2.save()

await collector.stop()

                return await interaction.followUp({
                  content: data.response
                })
              }
            

      

            }
})



            
          }
        }
    }
    }


    
    if (interaction.options.getSubcommand() === "view"){

      let user = interaction.options.getUser("user") || interaction.user;
      

      let userdb = await db.findOne({
        userId: user.id
      })

      if (!userdb){
        let newUser = new db({
          userId: user.id
        })

        await newUser.save();

        userdb = await db.findOne({
        userId: user.id
      })
      }

      if (userdb.skins.length === 0){
        return await interaction.editReply({
          content: data.noHave.replace("(@user)", user)
        })
      } else {
        let personagens = [];

        let ocorrencias = contarOcorrencias(userdb.skins);

        Object.keys(ocorrencias).forEach(numero => {
    let personagem = {
        número: parseInt(numero),
        quantidade: ocorrencias[numero]
    };
    personagens.push(personagem);
});

        console.log(userdb.skins, personagens)

        let texto = ``

        personagens.map(skin => {
          texto += `**${skins[`${skin["número"]}`]}**     | ID: \`${skin["número"]}\`  | Total: \`${skin.quantidade}\`\n`
        })

        let embed = new EmbedBuilder()
        .setDescription(texto)
        .setColor("Green")
        .setAuthor({
          name: user.globalName,
          iconURL: user.displayAvatarURL()
        })
        .setTitle(data.title)

        await interaction.editReply({
          embeds: [embed],
          content: `${interaction.user}`
        })

      }
      
    }
  }
}]

function contarOcorrencias(arr) {
    let ocorrencias = {};
    arr.forEach(numero => {
        ocorrencias[numero] = ocorrencias[numero] ? ocorrencias[numero] + 1 : 1;
    });
    return ocorrencias;
}

