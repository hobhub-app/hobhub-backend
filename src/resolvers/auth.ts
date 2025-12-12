import { generateToken, hashPassword, verifyPassword } from "../auth/utils";
import { prisma } from "../config/prisma";
import { CreateUserArgs, LoginInput } from "../types";

export const authResolvers = {
  Query: {},

  Mutation: {
    registerUser: async (_: unknown, args: CreateUserArgs) => {
      const { email, password, firstname, lastname } = args.input;

      if (password.length < 8) {
        const hashedPassword = await hashPassword(password);
        try {
          const user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              firstname,
              lastname,
            },
          });

          const token = generateToken(user.user_id, user.email);

          return {
            token,
            user,
          };
        } catch {
          throw new Error("Failed to register user");
        }
      }
    },

    loginUser: async (_: unknown, args: LoginInput) => {
      const { email, password } = args.input;

      if (!email || !password) {
        throw new Error("Invalid credentials");
      }

      try {
        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        // User not found
        if (!user) {
          throw new Error("Invalid credentials");
        }

        // No password set
        if (!user?.password) {
          throw new Error(
            "No password set for this account. Please log in with Google."
          );
        }

        const isMatch = await verifyPassword(password, user.password);

        // Check password
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        const token = generateToken(user.user_id, user.email);
        return {
          token,
          user,
        };
      } catch {
        throw new Error("Login failed");
      }
    },
  },
};
