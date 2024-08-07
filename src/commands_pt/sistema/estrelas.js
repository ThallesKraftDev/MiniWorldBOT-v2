import db from "../../mongodb/userpt.js";
import { EmbedBuilder, AttachmentBuilder } from "discord.js"
export default [{
  structure: {
    name: "estrelinhas",
    description: "Grupo de comandos",
    type: 1,
    integration_types: [0, 1],
      contexts: [0, 1, 2],
    options: [{
      name: "ver",
      description: "Veja quantas estrelinhas você tem",
      type: 1,
      options: [{
        name: "user",
        description: 'Mencione um usuário ou insira o ID',
        type: 6 ,
        required: false
      }]
    },{
      name: "rank",
      description: "Veja o rank de estrelinhas",
      type: 1
    }]
  },

   onCommand: async(client, interaction) => {

     if (interaction.options.getSubcommand() === "rank"){

       let rank = await db.find({})

  rank.sort((a,b) => (b.estrelas + b.estrelas) - (a.estrelas + a.estrelas))

     let userdb = rank.slice(0, 30);

       let file = new AttachmentBuilder(`./src/functions/img/icons/Arell.png`, `Arell.png`);

       let texto = ``;
       let rank_ = 1;

       userdb.map((user, i) => {

         let userD = client.users.cache.get(user.userId);

         let nome = "";
         if (!userD) {
           return;
         } else {
           nome = userD.globalName || userD.username
         }

            texto += `\n**#${rank_}** | **[${nome}](https://discord.com/users/${user.userId}) ** (**${user.estrelas} ⭐️**)`;

rank_ = rank_ + 1;
       })

      // console.log(texto)
      let embed = new EmbedBuilder()
       .setDescription(`${texto}`)
       .setColor("Yellow")
       .setTitle("🌠 | **Rank de Estrelinhas**")
       .setTimestamp()
       .setAuthor({
         name: interaction.user.globalName,
         iconURL: interaction.user.displayAvatarURL()
       })
       .setThumbnail(`attachment://Arell.png`)
       

       await interaction.editReply({
         embeds: [embed],
         files: [file]
       })

       
       
     }
     if (interaction.options.getSubcommand() === "ver"){

       let user = interaction.options.getUser("user") || interaction.user;

       let userdb = await db.findOne({
          userId: user.id
        })

        if (!db) {
          let newUser = new db({
            userId: user.id
          })

          await newUser.save();

          userdb = await db.findOne({
          userId: user.id
        })
        }


        const rankedUsers = await db.find({
              "estrelas": { 
                $gt: 0 
              }
            })
                .sort({ 
                  "estrelas": -1 
                })
                .exec();
    
            let userPosition = rankedUsers.findIndex(user => user.userId === userdb.userId) + 1;

            if (userdb.estrelas === 0) {
           userPosition = rankedUsers.length + 1;
            }

       await interaction.editReply({
         content: `${user} tem ${userdb.estrelas} estrelas e está na posição #${userPosition} do rank!`
       })
       
     }
   }
}]