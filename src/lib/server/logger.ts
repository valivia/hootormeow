import winston, { format, transports } from "winston";

const consoleFormat = format.printf(({ level, message, label, timestamp }) => {
    const renderedLabel = label ?? "main";
    return `${timestamp} [${renderedLabel}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new transports.Console({
            level: "",
            handleExceptions: true,
            handleRejections: true,
            format: format.combine(
                format.timestamp({ format: "MM-DD HH:mm:ss" }),
                format.colorize(),
                consoleFormat,
            ),
        }),

        new transports.File({
            level: "debug",
            dirname: "logs",
            filename: "combined.log",
            handleExceptions: true,
            handleRejections: true,
            format: format.combine(
                format.uncolorize(),
                format.timestamp(),
                format.json(),
            ),
        }),

        new transports.File({
            level: "error",
            dirname: "logs",
            filename: "error.log",
            handleExceptions: true,
            handleRejections: true,
            format: format.combine(
                format.uncolorize(),
                format.timestamp(),
                format.json(),
            ),
        }),
    ],
});



export { logger };