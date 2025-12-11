import { prisma } from "./config/prisma.js";
export const resolvers = {
    Query: {
        // Get all users
        users: async () => {
            return await prisma.user.findMany();
        },
        // Get single user by ID
        user: async (_, args) => {
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
        createUser: async (_, args) => {
            return await prisma.user.create({
                data: args.input,
            });
        },
        // Create a new hobby
        createHobby: async (_, args) => {
            return await prisma.hobby.create({
                data: { hobby_name: args.name },
            });
        },
    },
};
