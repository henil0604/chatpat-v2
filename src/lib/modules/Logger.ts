import { t } from '$trpc/t';
import chalk from 'chalk';

export default class Logger {
    public static PREFIX = "> "

    private constructor() { }

    public static log(type: 'log' | 'info' | 'success' | 'error' | 'warn' = "log", data: any) {

        let toLog = `${Logger.PREFIX}`;

        let color: typeof chalk["whiteBright"] | typeof chalk["greenBright"] | typeof chalk["cyanBright"] | typeof chalk["yellowBright"] | typeof chalk["redBright"] = chalk.whiteBright;

        if (type == "log") {
            color = chalk.whiteBright
        }
        if (type == "success") {
            color = chalk.greenBright;
        }
        if (type == "info") {
            color = chalk.cyanBright;
        }
        if (type == "warn") {
            color = chalk.yellowBright;
        }
        if (type == "error") {
            color = chalk.redBright;
        }

        toLog = color(toLog)

        toLog += data;

        if (typeof data === 'string') {
            const formatRegex = /\{.+?\}/g;

            let matches = data.match(formatRegex);

            matches?.forEach(e => {
                const formattedString = e.replace(/\{|\}/g, ``)
                const coloredString = color(formattedString);
                toLog = toLog.replace(e, coloredString);
            })

        }

        console.log(toLog);
    }

}