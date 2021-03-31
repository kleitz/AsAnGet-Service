import { createLogger, format, transports } from 'winston';
require('winston-daily-rotate-file');
import fs from 'fs';
import path from 'path';


const env = process.env.NODE_ENV || 'dev';
const logDir = 'log';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-results.log`,
    datePattern: 'YYYY-MM-DD'
});

const logger = createLogger({
    level: env === 'dev' ? 'verbose' : 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        dailyRotateFileTransport
    ]
});

const errorLog = {};
errorLog.saveError = (err) => {
    logger.error(err);
};

export default errorLog;