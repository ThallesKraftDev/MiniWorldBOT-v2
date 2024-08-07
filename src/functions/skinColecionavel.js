import db from "../mongodb/guild.js";
import data from "./img/data.js";
import { EmbedBuilder, AttachmentBuilder } from "discord.js"; 
import ms from "ms";
import dbuser from "../mongodb/user.js";
import language from "../language/shop.js";
import data_skin from "./img/data.js";

class Skin {
  constructor(){
    this.guilds = {};
    this.ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  async start(interaction, client) {
    console.log(this.guilds);

    let guilddb = await db.findOne({
      guildId: interaction.guild.id
    });

    if (!guilddb) {
      let newGuild = new db({
        guildId: interaction.guild.id
      });
      await newGuild.save();
      guilddb = await db.findOne({
        guildId: interaction.guild.id
      });
    }

    if (!this.guilds[interaction.guild.id] && guilddb.skinColecionavel !== "off") {
      this.guilds[interaction.guild.id] = {
        i: 0,
        total: Math.floor(Math.random() * (21 - 10) + 10)
      };
    } else if (this.guilds[interaction.guild.id]) {
      this.guilds[interaction.guild.id].i++;

      if (this.guilds[interaction.guild.id].i === this.guilds[interaction.guild.id].total) {
        this.guilds[interaction.guild.id].i = 0;
        this.guilds[interaction.guild.id].total = Math.floor(Math.random() * (21 - 10) + 10);

        await this.send(interaction, guilddb.skinColecionavel, client);
      }
    }
  }

  async send(interaction, channelId, client) {
    let channel = await client.guilds.cache.get(interaction.guild.id).channels.cache.get(channelId);

    let guilddb = await db.findOne({
      guildId: interaction.guild.id
    });

    if (!guilddb) {
      let newGuild = new db({
        guildId: interaction.guild.id
      });
      await newGuild.save();
      guilddb = await db.findOne({
        guildId: interaction.guild.id
      });
    }

    let data = language[guilddb.language] ? language[guilddb.language] : {
      title: "What's the name of this character?",
      response: "You got it right! The character was (@name), and you've won a bonus of (@money) Mini Beans for getting it right!"
    };

    let i = Math.floor(Math.random() * this.ids.length);

    let file = new AttachmentBuilder(`./src/functions/img/${i}.png`, `${i}.png`);

   // console.log("ID: ", i);

    let embed = new EmbedBuilder()
      .setTitle(`${data.title}`)
      .setImage(`attachment://${i}.png`);

    let msg = await channel.send({
      embeds: [embed],
      files: [file]
    });

    console.log("Iniciando coletor");

    const collector = msg.channel.createMessageCollector({
      time: ms('5m')
    });

    collector.on('collect', async (message) => {
      if (message.author.bot) return;
      if (message.channel.id !== channel.id) return;
      if (message.guild.id !== interaction.guild.id) return;

      let resposta = data_skin[`${i}`].toLowerCase();
      let personagem = message.content.toLowerCase();

      console.log(personagem, resposta)

      if (personagem === resposta || personagem.includes(resposta)) {
        message.react("✅");
        await collector.stop();

        let userdb = await dbuser.findOne({
          userId: message.author.id
        })

        if (!userdb) {
          let newUser = new dbuser({
            userId: message.author.id
          })

          await newUser.save();

          userdb = await dbuser.findOne({
          userId: message.author.id
        })
        }

        userdb.skins.push(i);

        let money = Math.floor(Math.random() * (900 - 10) + 10)

        userdb.economia.feijoes += money;
        await userdb.save();


        await message.reply({
          content: data.response.replace("(@name)", `${resposta}`).replace("(@money)", money)
        })
      }
    });
  }
}

export { Skin };