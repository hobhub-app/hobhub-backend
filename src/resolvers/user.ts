import { AuthContext } from "../auth/types.js";
import { prisma } from "../config/prisma.js";
import { UserArgs } from "../types";
import rankUsers from "../utils/rankUsers.js";

export const userResolvers = {
  Query: {
    // Get all users
    browseUsers: async (_: unknown, __: unknown, context: AuthContext) => {
      const meFromContext = context.user;
      if (!meFromContext || !context.isAuthenticated) {
        throw new Error("Not authenticated");
      }

      const me = await prisma.user.findUnique({
        where: { user_id: meFromContext.userId },
        include: {
          hobbies: {
            include: {
              hobby: true,
            },
          },
        },
      });

      if (!me) {
        throw new Error("User not found");
      }

      const users = await prisma.user.findMany({
        where: {
          user_id: { not: meFromContext.userId },
        },
        include: {
          hobbies: {
            include: {
              hobby: true,
            },
          },
        },
      });

      return rankUsers(users, me);
    },

    // Get single user by ID
    user: async (_: unknown, args: UserArgs, context: AuthContext) => {
      if (!context.isAuthenticated) {
        throw new Error("Not authenticated");
      }

      return await prisma.user.findUnique({
        where: { user_id: args.id },
        include: {
          hobbies: {
            include: {
              hobby: true,
            },
          },
        },
      });
    },

    // Get current user info
    me: async (_: unknown, __: unknown, context: AuthContext) => {
      if (!context.isAuthenticated) {
        throw new Error("Not authenticated");
      }
      return await prisma.user.findUnique({
        where: { user_id: context.user?.userId },
        include: {
          hobbies: {
            include: {
              hobby: true,
            },
          },
        },
      });
    },
  },
};
