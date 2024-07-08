import {ClusterManager} from 'discord-hybrid-sharding';
import chalk from 'chalk';
import 'dotenv/config'
const __dirname = import.meta.dirname;

const manager = new ClusterManager(`${__dirname}/inferna.js`, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process',
    token: process.env.TOKEN,
});

manager.on('clusterCreate', cluster => console.log(chalk.greenBright(`Launched shard ${cluster.id}`)));

manager.spawn();

