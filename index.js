const { ShardingManager: Index } = require('discord.js');
require('dotenv').config()

const manager = new Index('./hydra.js', { token: process.env.TOKEN });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();