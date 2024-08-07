import { Schema, model } from "mongoose";

export default model('Mwbot-Shop', new Schema({
  id: {type:String},
  itens: { type: Array, default: [] }
}));