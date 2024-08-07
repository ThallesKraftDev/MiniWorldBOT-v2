import { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import dbuser from "../../mongodb/user.js";
import dbshop from "../../mongodb/shop.js";
import lojaN from "../../functions/img/data.js";
import language from "../../language/shop.js";
import ms from "ms";

export default [{
  structure: {
    name: "shop",
    name_localizations: {
      "pt-BR": "loja"
    },
    description_localizations: {
      "pt-BR": "Veja a loja disponível"
    },
    description: "See the daily store",
    type: 1,
    integration_types: [0, 1],
      contexts: [0, 1, 2],
  },

  onCommand: async(client, interaction) => {


    let data = language[interaction.locale] ? language[interaction.locale] : {
      item: "Price: 20,000 Mini Beans",
      noUser: "Wait a moment... you're not (@author)!",
      noMoney: "You don't have a sufficient amount of Mini Beans to buy that skin.",
      buy: "You have successfully purchased the skin!",
      conquista: "🏆 | Achievement Unlocked: '**Character Debut!**'"
    };
    
    let userdb = await dbuser.findOne({
      userId: interaction.user.id
    });

    if (!userdb){
      let newUser = new dbuser({
        userId: interaction.user.id
      });

      await newUser.save();

      userdb = await dbuser.findOne({
      userId: interaction.user.id
    });
    }

    let shopdb = await dbshop.findOne({
      id: "1"
    });

    let embeds = [];
    let page = 0;
    let files = [];
    
for (let i = 0; i < shopdb.itens.length; i++){
     
      let file = new AttachmentBuilder(`./src/functions/img/${shopdb.itens[i]}.png`, { name: `${shopdb.itens[i]}.png`})

      embeds.push(
        new EmbedBuilder()
        .setTitle(`${lojaN[shopdb.itens[i]]}`)
        .setImage(`attachment://${shopdb.itens[i]}.png`)
        .setColor("Yellow")
        .setDescription(`${data.item}`)
      )

      files.push(file)
    }

  //  console.log(embeds[0])

    let msg = await interaction.editReply({
      embeds: [embeds[page]],
      files: [files[page]],
      components: [
        new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setLabel("⬅️")
          .setCustomId("voltarShop")
          .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
          .setLabel("🛒")
          .setCustomId("buyItem")
          .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
          .setLabel("➡️")
          .setCustomId("proximoShop")
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
    if (i.customId === "voltarShop"){
      page--;
      if (page < 0) page = 4;
      await i.deferUpdate();
      await i.editReply({
        embeds: [embeds[page]],
        files: [files[page]],
      })
    } else if (i.customId === "proximoShop"){
      page++;
      if (page > 4) page = 0;
      await i.deferUpdate();
      await i.editReply({
        embeds: [embeds[page]],
        files: [files[page]],
      })
    } else if (i.customId === "buyItem"){
      let item = shopdb.itens[page];

      await i.deferUpdate();
      if (userdb.economia.feijoes < 20000){
        return await i.followUp({
          content: data.noMoney,
          ephemeral: true
        })
      } else {

        userdb.skins.push(item);
        userdb.economia.feijoes -= 20000;
        

          let response = await i.followUp({
            content: data.buy,
            ephemeral: true
          });

          if (!userdb.conquistas["6"]){

            userdb.conquistas["6"] = true;

            await interaction.followUp({
              content: data.conquista,
              ephemeral: true
            })

            await userdb.save()
          } else {
            await userdb.save();
          }
      }
    }
  }
});

    
  }
}]