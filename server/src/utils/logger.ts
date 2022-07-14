import pino from "pino";
const pretty = require("pino-pretty");

const logger = pino(
  pretty({
    prettyPrint: {
      ignore: "hostname",
    },
  })
);

export default logger;
