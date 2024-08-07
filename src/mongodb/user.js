import { Schema, model } from "mongoose";

export default model('Mwbot-Users', new Schema({
  userId: { type: String },
  uid: { type: String, default: "indefinido" },
  skins: { type: Array, default: [] },
  xp: { type: Number, default: 0 },
  xp_resta: { type: Number, default: 1000 },
  xp_total_resta: { type: Number, default: 1000 },
  level: { type: Number, default: 0 },
  dmNotification: { type: Boolean, default: true },
  

  ///////// Conquistas 

  conquistas: {
    //Identificação Unica -> "Uid Save"
   "1": { type: Boolean, default: false },

    //Apenas um grãozinho! -> MiniBeans Daily
   "2": { type: Boolean, default: false },

    //Tesouro de Mini Feijões! -> MiniBeans Daily
   "3": { type: Boolean, default: false },
    
    //Autocontemplação -> User Avatar
   "4": { type: Boolean, default: false },

    //Visão Robótica -> User Avatar
   "5": { type: Boolean, default: false } ,

    //Estreia de Personagem -> Shop
   "6": { type: Boolean, default: false }
  },

  ///////// Economia

  economia: {
    feijoes: { type: Number, default: 0 },
    time: { type: Number, default: 0 },
    minimoedas: { type: Number, default: 0 },
    depositado: { type: Number, default: 0 }
  },

  ///////// Rpg
  rpg: {
    mundo: { type: String, default: "indefinido" },

    //itens
    itens: {
      madeira: { type: Number, default: 0 },
      pedra: { type: Number, default: 0 }
    }
  }
}));