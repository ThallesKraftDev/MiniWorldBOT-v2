import language from "../../language/configSkins.js"
import { PermissionsBitField, ChannelType } from "discord.js";
import db from "../../mongodb/guild.js";

export default [{
  structure: {
    name: "config-collectible-skin",
    description: "Configure the chat where the Collectible Skins system will be enabled.",
    type: 1,

    name_localizations: {
      "pt-BR": "config-skin-colecionavel"
    },

    description_localizations: {
      "pt-BR": "Configure o chat onde terá o sistema de Skins Colecionáveis"
    },

    options: [{
      name: "channel",
      description: "The channel where the Collectible Skins system will be enabled",
      type: 7,
      required: true
    }]
  },

  onCommand: async(client, interaction) => {

    let channel = interaction.options.getChannel("channel");

    let data = language[interaction.locale] ? language[interaction.locale] : {
      noPerm: "You do not have permission to MANAGE SERVER in order to use this command.",
      noChannel: "You can only mention text channels.",
      response: "(@channel) was successfully set up for the Collectible Skins system."
    };

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)){
      return await interaction.editReply({
        content: data.noPerm
      })
    } else {

    if (channel.type !== ChannelType.GuildText){
      return await interaction.editReply({
        content: data.noChannel
      })
    } else {

      let guilddb = await db.findOne({
        guildId: interaction.guild.id
      });

      if (!guilddb){
        let newGuild = new db({
          guildId: interaction.guild.id
        })

        await newGuild.save();

        guilddb = await db.findOne({
        guildId: interaction.guild.id
      });
      }

      guilddb.skinColecionavel = `${channel.id}`;
      await guilddb.save();

      return await interaction.editReply({
        content: data.response.replace("(@channel)", channel)
      })
    }
  }
  }
}]