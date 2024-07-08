import {ClusterManager} from 'discord-hybrid-sharding';
import chalk from 'chalk';
import 'dotenv/config'
import mongoose from "mongoose";
const __dirname = import.meta.dirname;

export function connectDBs() {
    try {
        const economyDb = mongoose.createConnection(process.env.MONGOURLECONOMY, {})
        const birthdayDb = mongoose.createConnection(process.env.MONGOURLBIRTHDAY, {})
        const usersDb = mongoose.createConnection(process.env.MONGOURLUSERS, {})
        const ticketingDb = mongoose.createConnection(process.env.MONGOURLTICKET, {})
        const configDb = mongoose.createConnection(process.env.MONGOURLCONFIG, {})
        return { economyDb, birthdayDb, usersDb, ticketingDb, configDb }
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

try {
    console.log(chalk.greenBright("Connected to the cluster, all connections to the databases have been established!"));
} catch(err) {
    console.error(chalk.redBright("DB connection failed!" + err));
}


const manager = new ClusterManager(`${__dirname}/inferna.js`, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process',
    token: process.env.TOKEN,
});

manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn();




