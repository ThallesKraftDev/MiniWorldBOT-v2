import db from "../mongodb/user.js";
import { EmbedBuilder } from "discord.js";
import language from "../language/level.js";

class Level {
  construtor() {
    this.xp = 100;
  }

  async xpAdd(interaction){
    let data = language[interaction.locale] ? language[interaction.locale] : {
      title: "Level Up!",
      description: 'You have reached level (@level) and now have (@xp) XP stored!',
      response: "If you no longer wish to receive notifications for new levels, use the command </user notification:1245> to deactivate or reactivate notifications."
    };
    
    let userdb = await db.findOne({
      userId: interaction.user.id
    })

    if (!userdb){
      let newUser = new db({
        userId: interaction.user.id
      })

      await newUser.save();

      userdb = await db.findOne({
      userId: interaction.user.id
    })
    }
 //   console.log(userdb)

    
    userdb.xp += 100;
    userdb.xp_resta -= 100;

    if (userdb.xp_resta <= 0){
      userdb.xp_resta = userdb.xp_total_resta + 1000;
      userdb.level++;
      userdb.xp_total_resta += 1000;
      await userdb.save();

      if (!userdb.dmNotification) return;

      let embed = new EmbedBuilder()
      .setTitle(`${data.title}`)
      .setDescription(`${data.description.replace("(@xp)", userdb.xp).replace("(@level)", userdb.level)}`)
      .setColor("Green")
      .setAuthor({
        name: interaction.user.globalName,
        iconURal: interaction.user.displayAvatarURL()
      })

     let msg = await interaction.user.send({
        embeds: [embed],
        content: `${interaction.user}`
      })

      await msg.reply({
        content: data.response
      })
    } else {
      await userdb.save();
    }
  }
}


export default Level;