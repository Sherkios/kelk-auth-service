import fs from "fs";
import path from "path";
import winston, { format } from "winston";

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger: winston.Logger = winston.createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: "auth-service" },
  transports: [
    new winston.transports.Console({
      format: format.combine(format.colorize(), format.simple(), format.timestamp()),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      format: format.json(),
    }),
    new winston.transports.File({ filename: path.join(logDir, "info.log"), level: "info" }),
    new winston.transports.File({ filename: path.join(logDir, "combined.log") }),
  ],
});

export default logger;
