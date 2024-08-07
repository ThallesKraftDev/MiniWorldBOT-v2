import DIG  from "discord-image-generation";
import { AttachmentBuilder } from "discord.js"

export default async function meme(interaction, type, users){
  if (type === "triggered"){
    let img = new DIG.Triggered().getImage(`${users[0]}`);

console.log(img)

    let attach = new AttachmentBuilder(img);
    await interaction.editReply({
      files: [attach]
    })
        
  }
}