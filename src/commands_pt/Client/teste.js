import db from "../../mongodb/userpt.js";

export default [{
  structure: {
    name: 'salvar',
    description: "Apenas um teste!",
    type: 1
  },
  onCommand: async(client, interaction)=>{
    console.log("iniciando...")
    const jsonData = [
    { id: "423095096897175552", estrelas: "281" },
    { id: "1133133684237680800", estrelas: "280" },
    { id: "746811932316663968", estrelas: "276" },
    { id: "673636763637383178", estrelas: "181" },
    { id: "603971111616512031", estrelas: "152" },
    { id: "1107374090119028808", estrelas: "111" },
    { id: "850134703473426493", estrelas: "107" },
    { id: "965003786819092500", estrelas: "98" },
    { id: "73422547675486630", estrelas: "88" },
    { id: "739974201464848424", estrelas: "88" },
    { id: "769146049054507020", estrelas: "80" },
    { id: "831933304366301224", estrelas: "74" },
    { id: "685897256292974632", estrelas: "55" },
    { id: "1040802284306702367", estrelas: "54" },
    { id: "639594268947906589", estrelas: "39" },
    { id: "875035814785060894", estrelas: "37" },
    { id: "1095070580107128943", estrelas: "33" },
    { id: "814121569949057065", estrelas: "30" },
    { id: "744350577357750342", estrelas: "28" },
    { id: "890320875142930462", estrelas: "27" },
    { id: "1059185143048314932", estrelas: "26" },
    { id: "918652857044058193", estrelas: "80" }, // Novo item adicionado
    { id: "996581976578474024", estrelas: "15" },
    { id: "878032961004523572", estrelas: "13" },
    { id: "926900502208335944", estrelas: "11" },
    { id: "970038874032197642", estrelas: "11" },
    { id: "1172567793288359978", estrelas: "11" },
    { id: "882913524291088384", estrelas: "10" },
    { id: "523207337238986752", estrelas: "10" },
    { id: "859144376143315005", estrelas: "10" },
    { id: "906499641829384202", estrelas: "10" },
    { id: "826209941685665792", estrelas: "9" },
    { id: "957712655840329749", estrelas: "8" },
    { id: "1098964988300886066", estrelas: "8" },
    { id: "1068363549585461290", estrelas: "6" },
    { id: "1181751952468623400", estrelas: "5" },
    { id: "1087117498110967808", estrelas: "4" },
    { id: "1044037597242085429", estrelas: "4" },
    { id: "141122719", estrelas: "4" },
    { id: "1184537052629434439", estrelas: "4" },
    { id: "889902577444077698", estrelas: "3" },
    { id: "1064692259846635560", estrelas: "3" },
    { id: "961459430002679870", estrelas: "3" },
    { id: "910322195350306856", estrelas: "3" },
    { id: "610499682551988225", estrelas: "3" },
    { id: "859173890793930767", estrelas: "3" },
    { id: "1108512206775144499", estrelas: "3" },
    { id: "864753373621256212", estrelas: "3" },
    { id: "802586187760009237", estrelas: "3" },
    { id: "883409605168861294", estrelas: "3" },
];

    let i = 0;

    await interaction.editReply({
      content: 'Começando ...'
    })

    jsonData.map(async(x) => {
      let userdb = await db.findOne({
        userId: x.id
      })

     if (!userdb) {
       let newuser = new db({
         userId: x.id
       })

       await newuser.save();

       userdb = await db.findOne({
        userId: x.id
      })

       userdb.estrelas += x.estrelas;
       await userdb.save();

       await interaction.channel.send({
         content: `${i}/50 => ${x.estrelas} estrelas`
       })

       i = i + 1;
       console.log(i)
     }
    })

  }
}]