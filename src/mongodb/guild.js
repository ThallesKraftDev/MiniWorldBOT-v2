import { Schema, model } from "mongoose";

export default model('Mwbot-Guild', new Schema({
  guildId: { type: String },
  language: { type: String, default: "en" },

  skinColecionavel: { type: String, default: "off"},
  skinAtual: { type: Number, default: 0 }
}));