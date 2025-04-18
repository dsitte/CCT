import { ApolloServer } from "@apollo/server";
import { resolvers } from "./prisma/generated/type-graphql";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "./prisma/generated/prisma";

const getServer = async () => {
  const schema = await buildSchema({
    resolvers,
    validate: false,
  });

  const prisma = new PrismaClient();
  const server = new ApolloServer<{ prisma: PrismaClient }>({
    schema,
  });

  return { server, prisma };
};

export default getServer;
