import language from "../../language/uid.js";
import db from "../../mongodb/user.js";

export default [{
  //Definição do grupo de comandos UID
  structure: {
    name: "uid",
    description: "Grupo de Comandos",
    type: 1,
    integration_types: [0, 1],
      contexts: [0, 1, 2],
    //Sub commands: uid save
    options: [{
      name: "save",
      description: "Set the UID of your Mini World profile",
      type: 1,
      //Definição de Idioma
      name_localizations: {
        "pt-BR": "salvar",
      },
      description_localizations: {
        "pt-BR": "Defina o UID de seu perfil do MiniWorld"
      },

      //Opção do Comando

      options: [{
        name: "uid",
        description: "Enter only numbers",
        required: true,
        type: 10,
          min_value: 1000
      }]
    },{
      //Sub Command: Uid Search
      name: "search",
      description: "Check the UID of some Discord user",
      type: 1,
      //Definições de Idioma
      name_localizations: {
        "pt-BR": "buscar"
      },
      description_localizations: {
        "pt-BR": "Verifique o UID de algum usuário do Discord"
      },

      //Opções do Comando
      options: [{
        name: "user",
        description: "Mention or enter the ID of the user",
        type: 6,
        required: true
      }]
    }]
  },

  //Função dos Comandos
  onCommand: async(client, interaction) => {


    //SubCmd => "search"
    if (interaction.options.getSubcommand() === "search"){
      //Verificação de Idioma
      let data = language[interaction.locale] ? language[interaction.locale]["search"] : {
        response: "UID defined by (@user) is (UID)!",
        noResponse: "(@user) does not have a defined UID."
      };

 let user = interaction.options.getUser("user");

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

      let uid = userdb.uid;

      if (uid === "indefinido"){
        return interaction.editReply({
          content: data.noResponse.replace("(@user)", user)
        })
      } else {
        return interaction.editReply({
          content: data.response.replace("(@user)", user).replace("(UID)", uid)
        })
      }
    }

    //SubCmd => "save"

    if (interaction.options.getSubcommand() === "save"){

          //Verificação de Idioma

    let data = language[interaction.locale] ? language[interaction.locale]["save"] : {
      uidGrande: "The UID cannot have more than 15 characters.",
      save: "Your UID has been successfully set to: (UID).",
      conquista: "🏆 | Achievement Unlocked: \"**Unique Identification**\""
    };

let uid = `${interaction.options.getNumber("uid")}`;
      

      if (uid.length > 15){
        return interaction.editReply({
        content: data.uidGrande
       })
      } else {
        
        let userdb = await db.findOne({
          userId: interaction.user.id
        })

        if (!userdb) {
          let newUser = new db({
            userId: interaction.user.id
          })

          await newUser.save();

          userdb = await db.findOne({
          userId: interaction.user.id
        })
        }
        
        userdb.uid = uid;
        
        await interaction.editReply({
          content: data.save.replace("(UID)", uid)
        })

        if (!userdb.conquistas["1"]){

          userdb.conquistas["1"] = true;

          await interaction.followUp({
            content: data.conquista,
            ephemeral: true
          });

          await userdb.save();
        } else {

          await userdb.save();
          
        }
      }
    }
  }
},{
  //COMANDO DE "USER":
  structure: {
    name: "Show UID",
    type: 2,
    //Definição de Idiomas

    name_localizations: {
      "pt-BR": "Mostrar UID"
    },
  },

  //Função do Comando
  onCommand: async(client, interaction) => {
    let user = interaction.targetMember.user;

          let data = language[interaction.locale] ? language[interaction.locale]["search"] : {
        response: "UID defined by (@user) is (UID)!",
        noResponse: "(@user) does not have a defined UID."
      };

 
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

      let uid = userdb.uid;

    if (uid === "indefinido"){
        return interaction.editReply({
          content: data.noResponse.replace("(@user)", user),
          ephemeral: true
        })
      } else {
        return interaction.editReply({
          content: data.response.replace("(@user)", user).replace("(UID)", uid),
          ephemeral: true
        })
    }
  }
}]