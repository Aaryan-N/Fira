import { ClusterManager, HeartbeatManager, ReClusterManager } from 'discord-hybrid-sharding';
import 'dotenv/config';
import chalk from 'chalk';

const __dirname = import.meta.dirname;

const manager = new ClusterManager(`${__dirname}/fira.js`, {
 totalShards: 'auto',
 totalClusters: 'auto',
 shardsPerClusters: 2,
 mode: 'process',
 token: process.env.TOKEN,
 restarts: {
  max: 4,
  interval: 60000 * 60,
 },
});

manager.on('clusterCreate', cluster => console.log(chalk.greenBright(`Launched Cluster ${cluster.id}`)));

manager.extend(
 new HeartbeatManager({
  interval: 3000,
  maxMissedHeartbeats: 6,
 })
)

manager.spawn().then(() => console.log(chalk.greenBright(`Cluster manager has been spawned!`))).catch((err) => {console.log(chalk.redBright(`Cluster manager died due to: ${err.message}`))})

