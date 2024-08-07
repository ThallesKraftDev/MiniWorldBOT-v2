export default [{
  structure: {
    name: "dm",
    description: "tezts",
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2]
  },

  onCommand: (client, interaction) => {
    interaction.editReply({
      content: "Funcionando!"
    })
  }
}]