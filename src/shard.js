

import { ShardingManager } from "discord.js";

import logger from "./utils/Logger.js";
import dotenv from "dotenv";

await dotenv.config();

const manager = new ShardingManager("./src/index.js", {


    totalShards: "auto",
    token: process.env["CLIENT_TOKEN"]
});

 const start = async() => {
    await manager.on("shardCreate", shard => logger.info(`Started shard #${shard.id}.`));
    await manager.spawn();
}
 
 start()

export default manager;