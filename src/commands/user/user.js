import db from "../../mongodb/user.js";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import language from "../../language/user.js";

export default [{
  structure: {
    name: "user",
    description: "Grupo de comandos",
    type: 1,
    name_localizations: {
      "pt-BR": "usuário"
    },
    integration_types: [0, 1],
      contexts: [0, 1, 2],

    options: [{
      name: "avatar",
      description: "See the avatar of a member.",
      description_localizations: {
        "pt-BR": "Veja o Avatar de algum membro"
      },
      type: 1,
      options: [{
        name: "user",
        description: "The user to see the avatar",
        type: 6,
        required: true
      }]
    }],
  },

  onCommand: async(client, interaction)=>{

    if (interaction.options.getSubcommand() === "profile"){

      let user = interaction.options.getUser("user") || interaction.user;

  let userdb = await db.findOne({
    userId: user.id
  })

if (!userdb){
  let newuser = new db({
    userId: user.id
  })

  await newuser.save();

  userdb = await db.findOne({
    userId: user.id
  })

  let data = language[interaction.locale] ? language[interaction.locale] : {
   description: ``
};

  let embed = new EmbedBuilder()
  .setTitle(`${user.globalName || user.username}`)
  .setDescription(data.description)
}
    }

    if (interaction.options.getSubcommand() === "avatar"){
      let user = interaction.options.getUser("user");

      
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
    

      let embed = new EmbedBuilder()
      .setTitle(`${user.globalName || user.username}`)
      .setImage(`${user.displayAvatarURL({ dynamic: true, size: 2048 })}`)
      .setColor("Random")

      let button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setLabel("Download")
        .setStyle(5)
        .setURL(`${user.displayAvatarURL({ dynamic: true, size: 2048 })}`)
      )

      await interaction.editReply({
        content: `${interaction.user}`,
        embeds: [embed],
        components: [button]
      })

      let data = language[interaction.locale] ? language[interaction.locale]["avatar"] : {
          conquista: "🏆 | Achievement Unlocked: '**Self-contemplation**'",
        conquista_2: "🏆 | Achievement Unlocked: '**Robotic Vision**'"
        };
    

      if (!userdb.conquistas["4"] && user.id === interaction.user.id){

        await interaction.followUp({
          content: data.conquista,
          ephemeral: true
        })

        userdb.conquistas['4'] = true;
        await userdb.save();
        
      } else if (!userdb.conquistas["5"] && user.id === client.user.id){

        await interaction.followUp({
          content: data.conquista_2,
          ephemeral: true
        })

        userdb.conquistas['5'] = true;
        await userdb.save();
        
      }
  }
    }
}]