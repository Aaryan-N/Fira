const { ShardingManager: Index } = require('discord.js');
const chalk = require('chalk');
require('dotenv').config()

const manager = new Index('./hydra.js', { token: process.env.TOKEN });

manager.on('shardCreate', shard => console.log(chalk.greenBright(`Launched shard ${shard.id}`)));

manager.spawn();