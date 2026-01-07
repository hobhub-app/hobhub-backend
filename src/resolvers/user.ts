import { Prisma } from "@prisma/client";
import { AuthContext } from "../auth/types.js";
import { prisma } from "../config/prisma.js";
import { UserArgs, CompleteOnboardingInput } from "../types";
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
  Mutation: {
    completeOnboarding: async (
      _: unknown,
      { input }: { input: CompleteOnboardingInput },
      context: AuthContext
    ) => {
      const userId = context.user?.userId;

      if (!context.isAuthenticated || !userId) {
        throw new Error("Not authenticated");
      }

      if (!input.hobbies.length) {
        throw new Error("At least one hobby is required");
      }

      return prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { user_id: userId },
          data: {
            date_of_birth: input.dateOfBirth,
            location: input.location,
            gender: input.gender,
            profile_description: input.profileDescription,
            profile_image_url: input.profileImageUrl,
          },
        });

        await tx.userHobby.deleteMany({
          where: { user_id: userId },
        });

        await tx.userHobby.createMany({
          data: input.hobbies.map(({ hobbyId, skillLevel }) => ({
            user_id: userId,
            hobby_id: hobbyId,
            skill_level: skillLevel,
          })),
        });

        return tx.user.findUnique({
          where: { user_id: userId },
          include: {
            hobbies: { include: { hobby: true } },
          },
        });
      });
    },
  },
};
