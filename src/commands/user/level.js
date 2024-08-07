import { Font, RankCardBuilder } from "canvacord";
import db from "../../mongodb/user.js";

export default [{
  structure: {
    name: "level",
    description: "See your current level",
    description_localizations: {
      "pt-BR": "Veja seu level atual"
    },
    type: 1,
    integration_types: [0, 1],
      contexts: [0, 1, 2],
    options: [{
      name: "user",
      description: "Mention user",
      type: 6
    }]
  },

  onCommand: async(client, interaction) => {
    Font.loadDefault();

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

    const rankedUsers = await db.find({
              "level": { 
                $gt: 0 
              }
            })
                .sort({ 
                  "level": -1 
                })
                .exec();
    //console.log(db.userID)
            let userPosition = rankedUsers.findIndex(user => user.userId === userdb.userId) + 1;

            if (userdb.level === 0) {
              userPosition = rankedUsers.length + 1;
            }
    
    const card = new RankCardBuilder()
  .setDisplayName(`${user.globalName}`)
  .setUsername(`${user.username}`)
  .setAvatar(`${user.displayAvatarURL()}`)
  .setCurrentXP(userdb.xp)
  .setRequiredXP(userdb.xp_total_resta)
  .setLevel(userdb.level)
  .setRank(userPosition)
  .setOverlay(90)
  .setBackground("#23272a")
  .setBackground("./src/functions/img/fundo.png")
  .setStatus("online");

    const image = await card.build({
  format: "png",
});

    await interaction.editReply({
      files: [image],
      content: `${interaction.user}`
    })


  }
}]