import { AuthContext } from "../auth/types.js";
import { prisma } from "../config/prisma.js";
import { UserArgs } from "../types";

export const userResolvers = {
  Query: {
    // Get all users
    users: async (_: unknown, __: unknown, context: AuthContext) => {
      if (!context.isAuthenticated) {
        throw new Error("Not authenticated");
      }
      return await prisma.user.findMany();
    },

    // Get single user by ID
    user: async (_: unknown, args: UserArgs, context: AuthContext) => {
      if (!context.isAuthenticated) {
        throw new Error("Not authenticated");
      }

      return await prisma.user.findUnique({
        where: { user_id: args.id },
      });
    },

    // Get current user info
    me: async (_: unknown, __: unknown, context: AuthContext) => {
      if (!context.isAuthenticated) {
        throw new Error("Not authenticated");
      }
      return await prisma.user.findUnique({
        where: { user_id: context.user?.userId },
      });
    },
  },
};
