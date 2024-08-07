import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import db from "../../mongodb/user.js";
import language from "../../language/rpg/coletar.js";
import ms from "ms"

export default [{
  structure: {
    name: "collect",
    description: "Grupo de Comandos",
    type: 1,

    name_localizations: {
      "pt-BR": "coletar"
    },

    options: [{
      name: "wood",
      name_localizations: {
        "pt-BR": "madeira"
      },

      description: "Collect some wood.",
      description_localizations: {
        "pt-BR": "Colete algumas madeiras"
      },
      type: 1
    },{
      name: "rocks",
      description: "Collect stones in your world.",
      name_localizations: {
        "pt-BR": "rochas"
      },
      description_localizations: {
        "pt-BR": "Colete rochas em seu mundo"
      },

      type: 1
    }]
    
  },

  onCommand: async(client, interaction) => {

    let userdb = await db.findOne({
      userId: interaction.user.id
    })

   if (!userdb){
     let newuser = new db({
       userId: interaction.user.id
     })

      await newuser.save()

     userdb = await db.findOne({
      userId: interaction.user.id
    })
   }

    let data = language[interaction.locale] ? language[interaction.locale] : {
      noMundo: "You don't have a world created. Use </start:12345>",
      wood: "🌲 | You collected (@wood) woods.",
      noUser: "Wait a moment... you're not (@author)!",
      pedra: "You collected (@pedra) rocks!"
    }

    if (userdb.rpg.mundo === "indefinido") return await interaction.editReply({
      content: data.noMundo
    })


          if (interaction.options.getSubcommand() === "rocks"){

        userdb.rpg.itens.pedra++;

        await userdb.save();

     let msg = await interaction.editReply({
          content: data.pedra.replace("(@pedra)", userdb.rpg.itens.pedra),
          components: [
            new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setLabel("🚶‍♂️")
              .setCustomId("rocks")
              .setStyle(ButtonStyle.Secondary)
            )
          ]
        })

        const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: ms("2m") });
    

collector.on('collect', async(i) => {
  
	if (i.message.id !== msg.id) return;

  if (i.user.id !== interaction.user.id){
    return await i.reply({
      content: data.noUser.replace("(@author)", interaction.user),
      ephemeral: true
    })
  } else {

    if (i.customId === "rocks"){

      userdb = await db.findOne({
        userId: interaction.user.id
      })

        userdb.rpg.itens.pedra++;

      await i.deferUpdate();

      await i.editReply({
        content: data.pedra.replace("(@pedra)", userdb.rpg.itens.pedra)
      })

      await userdb.save()
  }
  }
})

          }

   
      if (interaction.options.getSubcommand() === "wood"){

        userdb.rpg.itens.madeira++;

        await userdb.save();

     let msg = await interaction.editReply({
          content: data.wood.replace("(@wood)", userdb.rpg.itens.madeira),
          components: [
            new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setLabel("🪓")
              .setCustomId("wood")
              .setStyle(ButtonStyle.Secondary)
            )
          ]
        })

        const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: ms("2m") });
    

collector.on('collect', async(i) => {
  
	if (i.message.id !== msg.id) return;

  if (i.user.id !== interaction.user.id){
    return await i.reply({
      content: data.noUser.replace("(@author)", interaction.user),
      ephemeral: true
    })
  } else {

    if (i.customId === "wood"){

      userdb = await db.findOne({
        userId: interaction.user.id
      })

        userdb.rpg.itens.madeira++;

      await i.deferUpdate();

      await i.editReply({
        content: data.wood.replace("(@wood)", userdb.rpg.itens.madeira)
      })

      await userdb.save()
  }
  }
})

      }
  }
}]