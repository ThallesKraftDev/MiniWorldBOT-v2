import db from "../../mongodb/user.js";
import language from "../../language/rpg/start.js"

export default [{
  structure: {
    name: "start",
    description: "Start your RPG.",
    description_localizations: {
      "pt-BR": "Inicie seu Rpg"
    },

    name_localizations: {
      "pt-BR": "iniciar"
    },

    type: 1,

    options: [{
      name: "world",
      description: "Choose a name for your world.",
      type: 3,
      required: true
    }]
  },

  onCommand: async(client, interaction) => {
    
     let mundo = interaction.options.getString("world");

    let userdb = await db.findOne({
      userId: interaction.user.id
    })

   if (!userdb) {
     let newuser = new db({
       userId: interaction.user.id
     })

     await newuser.save()

     userdb = await db.findOne({
      userId: interaction.user.id
    })
   }

    let data = language[interaction.locale] ? language[interaction.locale] : {
      noUid: "You need to have a saved UID! Use the command </uid save:123456> to save it.",
      save: "You've just created a world called (@world)!"
    };

    if (userdb.uid === "indefinido") return await interaction.editReply({
      content: data.noUid
    })


     userdb.rpg.mundo = mundo;

    await interaction.editReply({
      content: data.save.replace("(@world)", mundo)
    })

    await userdb.save();
    
  }
}]