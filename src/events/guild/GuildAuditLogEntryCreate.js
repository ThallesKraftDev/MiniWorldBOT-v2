import { Events, AuditLogEvent, EmbedBuilder, AttachmentBuilder } from "discord.js";
import db from "../../mongodb/userpt.js";
import ms from "ms";

let guildId = "751534674723078174";
let mural = "1195375042901590177";
let logs = "1263187492237217813";
let timeout = [];

export default [{
  name: Events.GuildAuditLogEntryCreate,
  once: false,
  onEvent: async(client, log) => {
    let guild = client.guilds.cache.get(guildId);
    if (!guild) return;
    
    const { action, executorId, targetId, reason } = log;
    //UNBAN
    if (action === 23){

      let target = log.target;
  let user = target;
      
      let author = guild.members.cache.get(executorId).user;

  let motivo = log.reason || "Não especificado."

  let file = new AttachmentBuilder(`./src/functions/img/unban.gif`, `unban.gif`)
      
      let embed = {
        "title":"**DESBANIDO(A)!!! 🕊**",
      "description":`${target.globalName} foi desbanido!!\n\nPor: **${author.globalName || author.username}**\n\nMotivo: ${motivo}`,
      "author":{
         "name":`${target.username}`,
         "icon_url":`${target.displayAvatarURL()}`
      },
      "thumbnail":{
         "url":`${target.displayAvatarURL()}`
      },
	  "image": {
	     "url": "attachment://unban.gif"
	  },
    "footer": {
      "text": `ID do usuário: ${targetId}`
    }
      }

      embed = new EmbedBuilder(embed);

      embed.setColor("Green")
      embed.setTimestamp();

       await client.channels.cache.get(mural)
  .send({
    content: `${target}`,
    embeds: [embed],
    files: [file]
  })

  let msg = await target.send({
    embeds: [embed],
    files: [file],
    content: `Essa mensagem foi enviada automaticamente pelo servidor **Mini World: CREATA Português.**`
  })
    }
    //BAN
if (action === 22){
    let target = log.target;
  let user = target;
 // console.log(user)

  let author = guild.members.cache.get(executorId);

  let motivo = log.reason || "Não especificado."

  let file = new AttachmentBuilder(`./src/functions/img/ban.gif`, `ban.gif`)
  
    let embed = {
  "title": "**🔨 BANIDO(A)!!! 🔨**",
  "description": `${target.globalName} foi Banido!\n\n**Por:** ${author.user.globalName || author.user.username}\n\n**Motivo:** ${motivo}`,
  "author": {
    "name": `${target.username}`,
    "icon_url": `${target.displayAvatarURL()}`
  },
  "thumbnail": {
    "url": `${target.displayAvatarURL()}`
  },
  "image": {
    "url": "attachment://ban.gif"
  },
  "footer": {
    "text": `ID do usuário: ${target.id}`
  }
    }

   embed = new EmbedBuilder(embed);

   embed.setColor("Red")
   embed.setTimestamp()

  await client.channels.cache.get(mural)
  .send({
    content: `${target}`,
    embeds: [embed],
    files: [file]
  })

  let msg = await target.send({
    embeds: [embed],
    files: [file],
    content: `Essa mensagem foi enviada automaticamente pelo servidor **Mini World: CREATA Português.**`
  })


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
            
        }

        let data = {
          id: `${userdb.warns.length}`,
          motivo: `${motivo}`,
          timeout: false,
          staff: `${executorId}`,
          kick: false,
          automod: false,
          ban: true
        };

        userdb.warns.push(data);
        await userdb.save();

}

    //KICK
if (action === 20){

  let target = log.target;
  let user = target;
 // console.log(user)

  let author = guild.members.cache.get(executorId);

  let motivo = log.reason || "Não especificado."

  
    let embed = {
  "title": "Parece que alguém levou uma chinelada!!👡",
  "description": `${target.globalName} foi Expulso!\n\n**Por:** ${author.user.globalName || author.user.username}\n\n**Motivo:** ${motivo}`,
  "author": {
    "name": `${target.username}`,
    "icon_url": `${target.displayAvatarURL()}`
  },
  "thumbnail": {
    "url": `${target.displayAvatarURL()}`
  },
  "image": {
    "url": "https://images-ext-1.discordapp.net/external/hpmLkzAzi3vwhcYGw9861FPDLSQ680/2916300RH6.gi"
  },
  "footer": {
    "text": `ID do usuário: ${target.id}`
  }
    }

   embed = new EmbedBuilder(embed);

   embed.setColor("Red")
   embed.setTimestamp()

  await client.channels.cache.get(mural)
  .send({
    content: `${target}`,
    embeds: [embed]
  })

  await target.send({
    embeds: [embed],
    content: `Essa mensagem foi enviada automaticamente pelo servidor **Mini World: CREATA Português.**`
  })


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
            
        }

        let data = {
          id: `${userdb.warns.length}`,
          motivo: `${motivo}`,
          timeout: false,
          staff: `${executorId}`,
          kick: true,
          automod: false,
          ban: false
        };

        userdb.warns.push(data);
        await userdb.save();


}

    //CASTIGO
if (action === 145){

let user = guild.members.cache.get(targetId);


             let author = "AutoMod"

       let ver = log.extra.autoModerationRuleName;
       let tempo = 0;
       let motivo = "Palavra inapropriada";

        if (ver === "teste"){
          tempo = ms("1m")
        } else if (ver === "Bloquear spam de menções") {
          tempo = ms('1m')
          motivo = "Spam de menções"
        } else if (ver === "Leves"){
          tempo = ms("5m")
        } else if (ver === "Intermediário"){
          tempo = ms("1h")
        } else if (ver === "Pesado") {
          tempo = ms("1d")
        }

       

  
             timeout[user.id] = setTimeout(async function(){
                       let author = client;

              motivo = "Após muito tempo silenciado, o usuário aprendeu a falar novamente."

             let embed = {
        "title": "Aprendeu a falar (novamente)! 💬",
        "description": `${user.user.globalName} foi retirado do silenciamento!\n\n**Por:** ${author.user.globalName || author.user.username}\n\n**Motivo:** ${motivo}`,
          "author": {
         "name": `${user.user.username}`,
         "icon_url": `${user.user.displayAvatarURL()}`
       },
        "thumbnail": {
           "url": `${user.user.displayAvatarURL()}`
        },
        "image": {
           "url": "https://cdn.discordapp.com/emojis/757249316518756435.gif?v=1"
        },
        "footer": {
           "text": `ID do usuário: ${user.user.id}`
        }
     }

             embed = new EmbedBuilder(embed);

             embed.setColor("Green");
               embed.setTimestamp()

             await client.channels.cache.get(mural)
           .send({
             content: `${user}`,
             embeds: [embed]
           })
             }, tempo)

           let time = Date.now() + tempo;

           let t = Math.floor(time / 1000);

           


             //`<t:${t}:R>`

           let embed = {
       "title": "Parece que alguém levou uma mordida do Misra.",
       "description": `${user.user.globalName} foi Silenciado!\n\n**Por:** AutoMod\n\n**Se encerra:** <t:${t}:R>\n\n**Motivo:** ${motivo}`,
       "author": {
         "name": `${user.user.username}`,
         "icon_url": `${user.user.displayAvatarURL()}`
       },
       "thumbnail": {
         "url": `${user.user.displayAvatarURL()}`
       },
       "image": {
         "url": "https://images-ext-1.discordapp.net/external/hpmLkzAzi3vwhcYGw9861FPDLSQ680/2916300RH6.gi"
       },
       "footer": {
         "text": `ID do usuário: ${user.user.id}`
       }
     }

           embed = new EmbedBuilder(embed);
           embed.setColor("Orange")
           embed.setTimestamp()

           await client.channels.cache.get(mural)
           .send({
             content: `${user}`,
             embeds: [embed]
           });

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

             }

             let data = {
               id: `${userdb.warns.length}`,
               motivo: `${motivo}`,
               timeout: true,
               tempo: `${t}`,
               automod: true,
               kick: false,
               ban: false
             };

             userdb.warns.push(data);
             await userdb.save();

    
  } else if (action === 24){
      if (log.changes[0].key !== "communication_disabled_until") return;

      

        let user = guild.members.cache.get(targetId);


      if (!log.changes[0].new){

      await clearTimeout(timeout[user.id])

        let author = client.user;
        if (executorId) author = guild.members.cache.get(executorId).user;
        let motivo = "Após muito tempo silenciado, o usuário aprendeu a falar novamente."

        let embed = {
   "title": "Aprendeu a falar (novamente)! 💬",
   "description": `${user.user.globalName} foi retirado do silenciamento!\n\n**Por:** ${author.globalName}\n\n**Motivo:** ${motivo}`,
     "author": {
    "name": `${user.user.username}`,
    "icon_url": `${user.user.displayAvatarURL()}`
  },
   "thumbnail": {
      "url": `${user.user.displayAvatarURL()}`
   },
   "image": {
      "url": "https://cdn.discordapp.com/emojis/757249316518756435.gif?v=1"
   },
   "footer": {
      "text": `ID do usuário: ${user.user.id}`
   }
}

        embed = new EmbedBuilder(embed);

        embed.setColor("Green");
        embed.setTimestamp()

        await client.channels.cache.get(mural)
      .send({
        content: `${user}`,
        embeds: [embed]
      })

      } else {

        let author = guild.members.cache.get(executorId);

      let time = Date.parse(log.changes[0].new);
        timeout[user.id] = setTimeout(async function(){
                  let author = client;
        
        let motivo = "Após muito tempo silenciado, o usuário aprendeu a falar novamente."

        let embed = {
   "title": "Aprendeu a falar (novamente)! 💬",
   "description": `${user.user.globalName} foi retirado do silenciamento!\n\n**Por:** ${author.user.globalName || author.user.username}\n\n**Motivo:** ${motivo}`,
     "author": {
    "name": `${user.user.username}`,
    "icon_url": `${user.user.displayAvatarURL()}`
  },
   "thumbnail": {
      "url": `${user.user.displayAvatarURL()}`
   },
   "image": {
      "url": "https://cdn.discordapp.com/emojis/757249316518756435.gif?v=1"
   },
   "footer": {
      "text": `ID do usuário: ${user.user.id}`
   }
}

        embed = new EmbedBuilder(embed);

        embed.setColor("Green");
          embed.setTimestamp()

        await client.channels.cache.get(mural)
      .send({
        content: `${user}`,
        embeds: [embed]
      })
        }, getTimeToTimestamp(log.changes[0].new))

      let t = Math.floor(time / 1000);

      let motivo = reason;
      if (motivo === null) motivo = "Nenhum motivo foi informado."
      
      
        //`<t:${t}:R>`

      let embed = {
  "title": "Parece que alguém levou uma mordida do Misra.",
  "description": `${user.user.globalName} foi Silenciado!\n\n**Por:** ${author.user.globalName || author.user.username}\n\n**Se encerra:** <t:${t}:R>\n\n**Motivo:** ${motivo}`,
  "author": {
    "name": `${user.user.username}`,
    "icon_url": `${user.user.displayAvatarURL()}`
  },
  "thumbnail": {
    "url": `${user.user.displayAvatarURL()}`
  },
  "image": {
    "url": "https://images-ext-1.discordapp.net/external/hpmLkzAzi3vwhcYGw9861FPDLSQ680/2916300RH6.gi"
  },
  "footer": {
    "text": `ID do usuário: ${user.user.id}`
  }
}

      embed = new EmbedBuilder(embed);
      embed.setColor("Orange")
      embed.setTimestamp()
      
      await client.channels.cache.get(mural)
      .send({
        content: `${user}`,
        embeds: [embed]
      });

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
            
        }

        let data = {
          id: `${userdb.warns.length}`,
          motivo: `${motivo}`,
          timeout: true,
          tempo: `${t}`,
          staff: `${executorId}`,
          automod: false,
          kick: false,
          ban: false,
        };

        userdb.warns.push(data);
        await userdb.save();

      } 
    }
  }
}]

function getTimeToTimestamp(isoTimestamp) {
    const targetTime = new Date(isoTimestamp).getTime();
    const currentTime = new Date().getTime();
    return Math.max(0, targetTime - currentTime);
}