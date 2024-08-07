import { Schema, model } from "mongoose";

export default model('Ayami-Starboard', new Schema({
  msgId: { type: String },
  channelId: { type: String },
  reactions: { type: Number, default: 0 },
  sendId: { type: String }
}));