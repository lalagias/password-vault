import { FastifyInstance } from "fastify";
import { disconnect } from "mongoose";
import createServer from "./utils/createServer";
import { connectToDB, disconnectFromDB } from "./utils/db";
import logger from "./utils/logger";

console.log("Hello from main!");

function gracefulShutdown(signal: string, app: FastifyInstance) {
  process.on(signal, async () => {
    logger.info(`Goodbye, got signal ${signal}`);

    app.close();

    await disconnectFromDB();

    logger.info("My work here is done");

    process.exit(0);
  });
}

async function main() {
  const app = createServer();

  try {
    const url = await app.listen(4000, "0.0.0.0");
    logger.info(`Server is ready at ${url}`);

    await connectToDB();
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }

  const signals = ["SIGTERM", "SIGINT"];

  for (const signal of signals) {
    gracefulShutdown(signal, app);
  }
}

main();
