const { ClusterManager } = require('discord-hybrid-sharding');
const chalk = require('chalk');
require('dotenv').config()

const manager = new ClusterManager(`${__dirname}/hydra.js`, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process',
    token: process.env.TOKEN,
});

manager.on('clusterCreate', cluster => console.log(chalk.greenBright(`Launched shard ${cluster.id}`)));

manager.spawn();