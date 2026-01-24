// logger.js
const isprod = process.env.NODE_ENV === "production";

const format = (level, message) => {
  const time = new Date().toISOString();
  return `[${time}] [${level.toUpperCase()}] ${message}`;
};

export const logger = {
  info: (message) => console.log(format("INFO", message)),
  warn: (message) => console.log(format("WARN", message)),
  error: (message, err = null) => {
    console.log(
      format("ERROR", message),
      err && !isprod ? err.stack || err : "",
    );
  },
};
