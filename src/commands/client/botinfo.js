import { EmbedBuilder } from "discord.js";
import language from "../../language/bot.js";
export default [{
  structure: {
    name: "botinfo",
    description: "See my current information!",
    type: 1,

    description_localizations: {
      "pt-BR": "Veja minhas informações atuais"
    }
  },

  onCommand: async(client, interaction) => {

    let data = {
  embeds: [{
    title: `${language[interaction.locale] ? language[interaction.locale]["info"].embed_title : "My Information"}`,
    description: `${language[interaction.locale] ? language[interaction.locale]["info"].embed_description.replace("(botName)", client.user.username).replace("(guilds)", client.guilds.cache.size) : `My name is ${client.user.username}, and I am a bot fully inspired by the game **Mini World: CREATA**!\nI am a bot for: **Economy** and **Information** for your server. My currency is called "Mini Beans," which is one of the in-game currencies.\n\nI was developed by **ThallesKraft** and hosted on **SquareCloud**.\n\nCurrently, I am in **\`${client.guilds.cache.size}\`** servers.`}`,
    thumbnail: {
      url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=2048`
    },
    color: 255
  }],
  components: [{
    type: 1,
    components: [{
      label: "Add",
      style: 5,
      url: `https://discord.com/api/oauth2/authorize?client_id=1180550435464020028&permissions=2339214585024&scope=bot+applications.commands`,
      type: 2
    }, {
      label: "GitHub",
      style: 5,
      url: `https://github.com/ThallesKraft009/Mini-World-BOT/tree/main`,
      type: 2
    }]
  }]
    }

    await interaction.editReply(data);
  }
}]