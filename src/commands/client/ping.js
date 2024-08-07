import { SlashCommandBuilder } from "discord.js";

export default [{
        structure: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("See my current latency")
    .setNameLocalizations({
        "pt-BR": "ping"
    })
    .setDescriptionLocalizations({
        "pt-BR": "Veja meu ping atual"
    }),

        onCommand: async(client, interaction) => {
            await interaction.editReply(`Pong! ${client.ws.ping}ms`);
        }
    }, 
]