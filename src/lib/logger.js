import chalk from 'chalk';

const stamp = () => chalk.gray(new Date().toISOString());
const prefix = () => {
 const cluster = process.env.CLUSTER;
 return cluster === undefined ? '' : chalk.magenta(`[cluster ${cluster}] `);
};

export const log = {
 info: (...args) => console.log(stamp(), prefix() + chalk.blueBright('info '), ...args),
 ok: (...args) => console.log(stamp(), prefix() + chalk.greenBright('ok   '), ...args),
 warn: (...args) => console.warn(stamp(), prefix() + chalk.yellowBright('warn '), ...args),
 error: (...args) => console.error(stamp(), prefix() + chalk.redBright('error'), ...args),
};
