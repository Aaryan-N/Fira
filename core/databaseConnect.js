import chalk from 'chalk';
import 'dotenv/config'
import mongoose from "mongoose";

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

