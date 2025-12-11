import { prisma } from "../config/prisma";
import { UserArgs, CreateUserArgs } from "../types";

export const userResolvers = {
  Query: {
    // Get all users
    users: async () => {
      return await prisma.user.findMany();
    },

    // Get single user by ID
    user: async (_: unknown, args: UserArgs) => {
      return await prisma.user.findUnique({
        where: { user_id: args.id },
      });
    },
  },
};
