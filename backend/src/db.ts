import { PrismaClient } from "./prisma/generated/prisma";

const withDB = async (
  fn: (client: PrismaClient) => Promise<unknown> | unknown
) => {
  const client = new PrismaClient();
  try {
    await fn(client);
  } catch (e) {
    console.error(e);
    try {
      await client.$disconnect();
    } catch (e) {
      console.error(e);
    }
  }
};

export default withDB;
