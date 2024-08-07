
import CustomError from "../../utils/errors/CustomError.js";
import Shop from "../../functions/shop.mjs";
import logger from "../../utils/Logger.js";
import { Skin } from "../../functions/skinColecionavel.js";
let SkinColecionavel = new Skin();
import Level from "../../functions/level.js";
let LevelSistema = new Level();
export default [
    {
        name: "ready",
        once: true,

        /**
         * Handle client connection
         *
         * @param client {ExtendedClient} - The extended client
         * @returns {Promise<void>}
         */
        onEvent: async(client) => {
            client.user.setPresence({
                activities: [{
                    name: "I'm back :)",
                    type: 3
                }],
                status: "online",
                afk: false
            });
            new Shop();



            logger.log("success", `Client connected on Discord as "@${client.user.globalName || client.user.tag}".`);
        }
    },

    {
        name: "interactionCreate",
        once: false,

        /**
         * Handle all interactions (commands, buttons, modals, selects)
         *
         * @param client {ExtendedClient} - The extended client
         * @param interaction {import("discord.js").Interaction} - The interaction
         * @returns {Promise<void>}
         */
        onEvent: async(client, interaction) => {


            try {
                if(interaction.isCommand()) {


                    await LevelSistema.xpAdd(interaction);

                    await interaction.deferReply();

                    await client.collection.commands.get(interaction.commandName)?.onCommand(client, interaction);

                    await SkinColecionavel.start(interaction, client);


                }

                if(interaction.isButton()) {
                    await client.collection.components.get(interaction.customId)?.onButton(client, interaction);
                }

                if(interaction.isModalSubmit()) {
                    await client.collection.components.get(interaction.customId)?.onModalSubmit(client, interaction);
                }

                if(interaction.isAnySelectMenu()) {
                    await client.collection.components.get(interaction.customId)?.onSelectMenu(client, interaction);
                }
            } catch (exception) {
                if(exception instanceof CustomError) {
                    interaction.reply({
                        content: client.formatter.format("error", exception.message),
                        ephemeral: true
                    });
                } else {
                    logger.log("error", `An error occurred while user '${interaction.user}' executed command '${interaction.commandName}' >> ${exception}`);
                }
            }
        }
    }
]