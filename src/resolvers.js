import { prisma } from "./config/prisma.js";

export const resolvers = {
  Query: {
    // Get all users
    async users(_, __, context) {
      return await prisma.user.findMany();
    },

    // Get single user by ID
    async user(_, { id }) {
      return await prisma.user.findUnique({
        where: { user_id: id },
      });
    },

    // Get all hobbies
    async hobbies(_, __, context) {
      return await prisma.hobby.findMany();
    },
  },

  Mutation: {
    // Create a new user
    async createUser(_, { input }) {
      return await prisma.user.create({
        data: input,
      });
    },

    // Create a new hobby
    async createHobby(_, { name }) {
      return await prisma.hobby.create({
        data: { hobby_name: name },
      });
    },
  },
};
