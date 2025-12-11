import { prisma } from "../config/prisma";
import { CreateHobbyArgs } from "../types";

export const hobbyResolvers = {
  Query: {
    // Get all hobbies
    hobbies: async () => {
      return await prisma.hobby.findMany();
    },
  },

  Mutation: {
    // Create a new hobby
    createHobby: async (_: unknown, args: CreateHobbyArgs) => {
      return await prisma.hobby.create({
        data: { hobby_name: args.name },
      });
    },
  },
};
