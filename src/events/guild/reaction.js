import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from "discord.js";
import ms from "ms";
import starboarddb from "../../mongodb/starboard.js";
import db from "../../mongodb/userpt.js";

let guildId = "751534674723078174";
let star = "751536510347509801";
let logs = "788359527657373717";
let gartic = "767888039552352297";

export default [{
  name: "messageReactionAdd",
  once: false,
  onEvent: async(client, reaction, user) => {

  // console.log(reaction.message.guildId)
 // console.log(reaction.message.channelId)

    if (reaction.message.guildId !== guildId) return;
    
    let embed = new EmbedBuilder()
    .setTitle("Nova reação adicionada")
    .setDescription(`Reação "${reaction.emoji.name}" adicionada por ${user}`)
    .setThumbnail(`${user.displayAvatarURL()}`)
    .setTimestamp()
    .setColor("Green")



    if (reaction.emoji.name === "🖕") embed.setColor("Red");

    if (reaction.emoji.name === "⭐") embed.setColor("Yellow");

    await client.channels.cache.get(logs)
    .send({
      embeds: [embed],
      content: `User ID: ${user.id}`
    })

    
      if (reaction.emoji.name === "🖕"){

        await reaction.message.reactions.removeAll();
        let member = client.guilds.cache.get(guildId)
        .members.cache.get(user.id);

        await member.timeout(ms("5m"), "Reação inapropriada.");
        
      } else if (reaction.emoji.name === "⭐"){
        if (reaction.message.channelId === gartic) return;
        if (reaction.message.author.id === user.id) return;
        

       

        let setdb = await starboarddb.findOne({
          msgId: reaction.message.id
        });

         if (!setdb){
           let newdb = new starboarddb({
             msgId: reaction.message.id
          });

           await newdb.save();

           setdb = await starboarddb.findOne({
             msgId: reaction.message.id
           });
         }

     // console.log(setdb)

        if (setdb.reactions === 0){
          setdb.reactions++;
          

      let channel = client.channels.cache.get(star);

          let embed_star = new EmbedBuilder()
          .setColor("Yellow")
          .setDescription(`${reaction.message.content}`)
          .setAuthor({name: `${reaction.message.author.globalName || reaction.message.author.username}`, iconURL: `${reaction.message.author.displayAvatarURL()}`})
          .setTimestamp()

         let msg = await channel.send({
            embeds: [embed_star],
            content: `1 ⭐️ - <#${reaction.message.channelId}>`,
            components: [new ActionRowBuilder()
                        .addComponents(
                          new ButtonBuilder()
                          .setLabel("Ir para a Mensagem")
                          .setStyle(ButtonStyle.Link)
                          .setURL(`https://discord.com/channels/${guildId}/${reaction.message.channelId}/${reaction.message.id}`)
                        )]
          })

          setdb.sendId = msg.id;
          await setdb.save();

          let userdb = await db.findOne({
            userId: reaction.message.author.id
          });

          if (!userdb){
            let newuser = new db({
              userId: reaction.message.author.id
            })

            await newuser.save();

            userdb = await db.findOne({
            userId: reaction.message.author.id
          });
          }

          userdb.estrelas++;
          await userdb.save();
          let stars = [5, 10, 15, 20, 25];
          if (stars.includes(userdb.estrelas)){
            let file = new AttachmentBuilder(`./src/functions/img/icons/Arell.png`, `Arell.png`);


            let role = {
              "5": "⭐️",
              "10": "⭐️⭐️",
              '15': "⭐️⭐️⭐️",
              "20": "⭐️⭐️⭐️⭐️",
              "25": '⭐️⭐️⭐️⭐️⭐️'
            }

            role = role[`${userdb.estrelas}`];

    let embed = new EmbedBuilder()
      .setAuthor({ name: `${reaction.message.author.globalName || reaction.message.author.username}`, iconURL: `${reaction.message.author.displayAvatarURL()}`})
      .setThumbnail(`attachment://Arell.png`)
      .setDescription(`Olá ${reaction.message.author}!\nParabéns por ter ajudado **${userdb.estrelas} pessoas**!\ Agora você pode reivindicar o cargo de **${userdb.estrelas} (${role}) estrelinhas** em  https://discord.com/channels/751534674723078174/751552398245494884!`)
      .setTimestamp()
      .setColor("Yellow")

            await reaction.message.author.send({
              embeds: [embed],
              files: [file], 
              content: `A mensagem a seguir foi enviada automaticamente pelo servidor **${reaction.message.guild.name}**!`
            })
            
          }
          
        } else {
              let channel = client.channels.cache.get(star);

  let msg = await channel.messages.fetch({
    message: setdb.sendId,
    cache: false,
    force: true
  })

          msg.edit({
            content: `${reaction.count} ⭐️ - <#${reaction.message.channelId}>`
          })
        }
      }
  }
},{
  name: 'messageReactionRemove',
  once: false,
  onEvent: async(client, reaction, user) => {
    if (reaction.message.guildId !== guildId) return;

    if (reaction.emoji.name === "⭐"){
    let setdb = await starboarddb.findOne({
          msgId: reaction.message.id
        });

         if (!setdb) return;

console.log(reaction.count)

if (reaction.count === 0){
  let userdb = await db.findOne({
            userId: reaction.message.author.id
          });

          if (!userdb){
            let newuser = new db({
              userId: reaction.message.author.id
            })

            await newuser.save();

            userdb = await db.findOne({
            userId: reaction.message.author.id
          });
          }

     userdb.estrelas--;
  await userdb.save();

    let channel = client.channels.cache.get(star);

  let msg = await channel.messages.fetch({
    message: setdb.sendId,
    cache: false,
    force: true
  })

     await msg.delete()
    
} else {
  let channel = client.channels.cache.get(star);

  let msg = await channel.messages.fetch({
    message: setdb.sendId,
    cache: false,
    force: true
  })

          msg.edit({
            content: `${reaction.count} ⭐️ - <#${reaction.message.channelId}>`
          })
}
      
    }
    
  }
}]