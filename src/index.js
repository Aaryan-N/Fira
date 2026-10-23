import path from 'node:path';
import { ClusterManager, HeartbeatManager } from 'discord-hybrid-sharding';
import { requireEnv } from './config.js';
import { log } from './lib/logger.js';

try {
 requireEnv('TOKEN');
} catch (error) {
 log.error(`${error.message}. Copy .env.example to .env and fill it in.`);
 process.exit(1);
}

const manager = new ClusterManager(path.join(import.meta.dirname, 'bot.js'), {
 totalShards: 'auto',
 totalClusters: 'auto',
 shardsPerClusters: Number(process.env.SHARDS_PER_CLUSTER) || 2,
 mode: 'process',
 token: process.env.TOKEN,
 restarts: { max: 4, interval: 60 * 60_000 },
});

manager.extend(new HeartbeatManager({ interval: 3_000, maxMissedHeartbeats: 6 }));

manager.on('clusterCreate', cluster => log.ok(`Launched cluster ${cluster.id}`));

manager
 .spawn({ timeout: -1 })
 .then(() => log.ok('All clusters spawned'))
 .catch(error => {
  log.error('Cluster manager failed to spawn:', error);
  process.exitCode = 1;
 });
