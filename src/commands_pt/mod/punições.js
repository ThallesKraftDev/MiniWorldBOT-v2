import db from "../../mongodb/userpt.js";
import { EmbedBuilder, PermissionsBitField } from "discord.js";

export default [{
  structure: {
    name: "punições",
    description: "Veja a lista de Punições de um usuário",
    type: 1,
    options: [{
      name: "user",
      description: "Mention user",
      type: 6,
      required: true
    }]
  },

   onCommand: async(client, interaction) => {
     let user = interaction.options.getUser("user");

     if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
	     return await interaction.editReply({
         content: "Você não tem a permissão necessária para utilizar esse comando."
       })
     }

     let userdb = await db.findOne({
       userId: user.id
     });

     if (!userdb) {
       let newuser = new db({
         userId: user.id
       })

        await newuser.save();

       userdb = await db.findOne({
       userId: user.id
     });
     }

     let warns = userdb.warns;

     let fields = [];

     warns.map(warn => {
       let msg = "";
       let user = "";
       if (warn.automod) user = "AutoMod";
       if (!warn.automod) user = client.users.cache.get(warn.staff).globalName ||  client.users.cache.get(warn.staff).username;

       
          if (warn.timeout) msg = `Punição: **Castigo**\nPor: **${user}**\nMotivo: **${warn.motivo}**`;

           if (warn.kick) msg = `Punição: **Expulso**\nPor: **${client.users.cache.get(warn.staff).globalName ||  client.users.cache.get(warn.staff).username}**\nMotivo: **${warn.motivo}**`

       if (warn.ban) msg = `Punição: **Banido**\nPor: **${client.users.cache.get(warn.staff).globalName ||  client.users.cache.get(warn.staff).username}**\nMotivo: **${warn.motivo}**`
       
       fields.push({
         name: `ID do WARN: ${warn.id}`,
         value: `${msg}`
       })
     })

     let embed = new EmbedBuilder()
     .setTitle("Lista de Punições")
     .addFields(fields)
     .setColor("Blue")
     .setAuthor({
       name: user.globalName,
       iconURL: user.displayAvatarURL()
     })

     await interaction.editReply({
       embeds: [embed]
     })

//userdb.warns = []
    // userdb.save()
   }
}]