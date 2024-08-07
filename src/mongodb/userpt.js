import { Schema, model } from "mongoose";

export default model('Ayami-Users-Oficial', new Schema({
  userId: { type: String },
  estrelas: { type: Number, default: 0 },
  warns: { type: Array, default: [] }
}));