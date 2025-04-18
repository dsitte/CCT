import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./prisma/generated/type-graphql";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "./prisma/generated/prisma";
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
