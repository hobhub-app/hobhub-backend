import { prisma } from "./config/prisma.js";

// Simple TypeScript interfaces for your GraphQL args
interface UserArgs {
  id: number;
}

interface CreateUserArgs {
  input: {
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
  };
}

interface CreateHobbyArgs {
  name: string;
}

export const resolvers = {
  Query: {
    // Get all users
    users: async () => {
      return await prisma.user.findMany();
    },

    // Get single user by ID
    user: async (_: any, args: UserArgs) => {
      return await prisma.user.findUnique({
        where: { user_id: args.id },
      });
    },

    // Get all hobbies
    hobbies: async () => {
      return await prisma.hobby.findMany();
    },
  },

  Mutation: {
    // Create a new user
    createUser: async (_: any, args: CreateUserArgs) => {
      return await prisma.user.create({
        data: args.input,
      });
    },

    // Create a new hobby
    createHobby: async (_: any, args: CreateHobbyArgs) => {
      return await prisma.hobby.create({
        data: { hobby_name: args.name },
      });
    },
  },
};
