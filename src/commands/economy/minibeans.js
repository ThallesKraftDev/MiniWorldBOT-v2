import db from "../../mongodb/user.js";
import language from "../../language/economia.js";
import tempo from "ms";

export default [{
  structure: {
  //Grupo de Comando
  name: "minibeans",
  name_localizations: {
    "pt-BR": "minifeijões"
  },
  description: "Grupo de Comandos",
  type: 1,
    integration_types: [0, 1],
      contexts: [0, 1, 2],
  //Sub Command => "DAILY"
  options: [{
    name: "daily",
    description: "Redeem your Mini Beans every 24 hours!",
    type: 1,
    //Definição de Idioma
    name_localizations: {
      "pt-BR": "diárias"
    },
    description_localizations: {
      "pt-BR": "Resgate seus Mini Feijões a cada 24 horas!"
    }
  },{
    //Sub cmd => "VIEW"
    name: "view",
    description: "Check your Mini Beans balance",
    type: 1,

    //Idiomas
    name_localizations: {
      "pt-BR": "ver"
    },
    description_localizations: {
      "pt-BR": "Veja seu saldo de Mini Feijões"
    },
    //Opções do sub cmd

    options: [{
      name: "user",
      description: "Mention or enter the ID of the user",
      type: 6,
      required: false
    }]
  },{
    //Sub cmd: PAY
    name: "pay",
    description: "Send Mini Beans to another member",
    type: 1,

    //Definição de Idioma
    name_localizations: {
      "pt-BR": "pagar"
    },

    description_localizations: {
      "pt-BR": "Envie Mini Feijões pra outro membro"
    },
    //Opções do Comando
    options: [{
      name: "user",
      description: "Mention or enter the ID of user",
      type: 6,
      required: true
    },{
      name: "amount",
      description: "Enter the amount of Mini Beans to send",
      type: 10,
      min_value: 1,
      required: true
    }]
  }]
  },

  onCommand: async(client, interaction) => {

    //Sub cmd => "PAY",
    if (interaction.options.getSubcommand() === "pay"){

      let user = interaction.options.getUser("user");

      let amount = interaction.options.getNumber("amount");

      let data = language[interaction.locale] ? language[interaction.locale]["pay"] : {
        userError: "You cannot send Mini Beans to yourself!",
        noBeans: "You don't have that amount to send the Mini Beans!",
        confirmar: `🌟 **|** (@author), you're about to transfer (beans) Mini Beans to (@user)!
🤝 **|** To confirm the transaction, both you and (@user) need to click ✅!\n🚫 **|** **Remember:** Trading Mini Beans for real-life items (like Nitro, money, invites, illegal/NSFW content, etc.) and selling Mini Beans for money are strictly prohibited. Only send Mini Beans to people you trust! Think of lending Mini Beans like lending a pen at school - you might never see them again! Avoid unsafe transactions!`,
        send: "Transaction completed! (@author) sent (beans) Mini Beans to (@user)!"
      };

      if (user === interaction.user){
        return await interaction.editReply({
          content: data.userError
        })
      } else {

        let userdb_1 = await db.findOne({
          userId: interaction.user.id
        })

        if (!userdb_1){
          let newUser = new db({
            userId: interaction.user.id
          })

          await newUser.save();

          userdb_1 = await db.findOne({
          userId: interaction.user.id
        })
        }

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

        if (userdb_1.economia.feijoes < amount){
          return await interaction.editReply({
            content: data.noBeans
          })
        } else {


          let msg = await interaction.editReply({
            content: data.confirmar.replace("(@user)", user).replace("(beans)", formatarNumero(amount)).replace("(@author)", interaction.user).replace("(@user)", user)
          })

          await msg.react("✅")

    let collectorFilter = (reaction, user) => {
	return ['✅'].includes(reaction.emoji.name) && reaction.message.id == msg.id
};

const collector = msg.createReactionCollector({ filter: collectorFilter, time: tempo("1h") });

          let user_confirm_1 = false;
          let user_confirm_2 = false;

collector.on('collect', (reaction, user_reaction) => {
	if (user_reaction.id === user.id){
    user_confirm_2 = true;

    pay(user_confirm_2, user_confirm_1)
  } else if (user_reaction.id === interaction.user.id){
    user_confirm_1 = true;

    pay(user_confirm_2, user_confirm_1)
  }

  async function pay(x, y){
    if (x && y){
      userdb_1.economia.feijoes -= amount;
      userdb_2.economia.feijoes += amount;

      await userdb_1.save();
      await userdb_2.save();

      await collector.stop()
      await interaction.followUp({
        content: data.send.replace("(@user)", user).replace("(beans)", formatarNumero(amount)).replace("(@author)", interaction.user)
      })
    }
  }
});
          
        }
        
      }
    }

    //Sub Cmd => "VIEW"
    if (interaction.options.getSubcommand() === "view"){

      let user = interaction.options.getUser("user") || interaction.user;

      let userdb = await db.findOne({
          userId: user.id
        })

        if (!userdb) {
          let newUser = new db({
            userId: user.id
          })

          await newUser.save();

          userdb = await db.findOne({
          userId: user.id
        })
        }

        

        const rankedUsers = await db.find({
              "economia.feijoes": { 
                $gt: 0 
              }
            })
                .sort({ 
                  "economia.feijoes": -1 
                })
                .exec();
    //console.log(db.userID)
            let userPosition = rankedUsers.findIndex(user => user.userId === userdb.userId) + 1;

            if (userdb.economia.feijoes === 0) {
              userPosition = rankedUsers.length + 1;
            }

      let data = language[interaction.locale] ? language[interaction.locale]["view"] : {
        mentionUser: "(@user) has (beans) Mini Beans and is in (position) position on the rank!",
        noMention: "You have (beans) Mini Beans and are in (position) position on the rank!"
      };

      if (user === interaction.user){
        return await interaction.editReply({
          content: data.noMention.replace("(position)", `#${userPosition}`).replace("(beans)", formatarNumero(userdb.economia.feijoes))
        })
      } else {

        return await interaction.editReply({
          content: data.mentionUser.replace("(position)", `#${userPosition}`).replace("(beans)", formatarNumero(userdb.economia.feijoes)).replace("(@user)", user)
        })
        
      }

      
    }
    //Sub Command => "DAILY"

    if (interaction.options.getSubcommand() === "daily"){

      //Verificação de Idioma
      let data = language[interaction.locale] ? language[interaction.locale]["daily"] : {
        time: "Have you redeemed your Daily Mini Beans! You will be able to redeem again (time)!",
        resgate: "You have successfully redeemed (money) mini Beans!",

        conquista_1: "🏆 | Unlocked achievement: '**Just a little bean!**'",

        conquista_2: "🏆 | Unlocked achievement: '**Treasure of Mini Beans!**'"
      };

      let userdb = await db.findOne({
        userId: interaction.user.id
      });

      if (!userdb){
        let newUser = new db({
          userId: interaction.user.id
        })

        await newUser.save();

        userdb = await db.findOne({
        userId: interaction.user.id
      });
      }

    /*  let d = Date.now() + tempo("1h");
      let x = Math.floor(d / 1000);

      await interaction.editReply({
        content: `<t:${x}:R>`
      })*/

      if(Date.now() < userdb.economia.time){
      const calc = userdb.economia.time - Date.now()

        let t = Math.floor(userdb.economia.time / 1000);

        await interaction.editReply({
          content: data.time.replace("(time)", `<t:${t}:R>`)
        })

      } else {

        let valor = getRandomNumberBetween(1000, 20000);

        let money = formatarNumero(valor);

        userdb.economia.feijoes+=valor;
        userdb.economia.time = Date.now() + tempo("24h");

        
        await interaction.editReply({
          content: data.resgate.replace("(money)", money)
        })

        if (!userdb.conquistas["2"] && valor < 4000){

          await interaction.followUp({
            content: data.conquista_1,
            ephemeral: true
          })

          userdb.conquistas["2"] = true;

          await userdb.save();
        } else if (!userdb.conquistas["3"] && valor > 6000){

          await interaction.followUp({
            content: data.conquista_2,
            ephemeral: true
          })

          userdb.conquistas["3"] = true;

          await userdb.save();
        } else {

           await userdb.save()
          
        }
      }
    }
  }
}]

function getRandomNumberBetween(x, y) {
  if (x >= y) {
    throw new Error("O valor de 'x' deve ser menor que 'y'");
  }
  const randomNumber = Math.floor(Math.random() * (y - x + 1)) + x;
  return randomNumber;
}


function formatarNumero(numero) {
    // Converter o número para string
    let numeroString = numero.toString();

    // Separar a parte inteira da parte decimal (se houver)
    let partes = numeroString.split('.');
    let parteInteira = partes[0];
    let parteDecimal = partes.length > 1 ? '.' + partes[1] : '';

    // Adicionar separadores de milhar à parte inteira
    let formatoMilhar = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Retornar número formatado (com parte decimal, se houver)
    return formatoMilhar + parteDecimal;
}
