import "reflect-metadata";
import { startStandaloneServer } from "@apollo/server/standalone";
import getServer from "./getServer";

const run = async () => {
  const { prisma, server } = await getServer();
  const { url } = await startStandaloneServer(server, {
    context: async () => ({ prisma }),
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

run().catch((e) => console.error(e));
