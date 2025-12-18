import { generateToken, hashPassword, verifyPassword } from "../auth/utils.js";
import { prisma } from "../config/prisma.js";
import { CreateUserArgs, LoginInput } from "../types";
import { OAuth2Client } from "google-auth-library";

export const authResolvers = {
  Query: {},

  Mutation: {
    registerUser: async (_: unknown, args: CreateUserArgs) => {
      const { email, password, firstname, lastname } = args.input;

      if (!password || password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      try {
        const hashedPassword = await hashPassword(password);

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

    loginWithGoogle: async (_: unknown, { token }: { token: string }) => {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new Error("Invalid Google token");

      const {
        sub: google_id,
        email,
        given_name,
        family_name,
        picture,
      } = payload;

      if (!email) {
        throw new Error("Google account did not return an email address.");
      }

      let user = await prisma.user.findUnique({ where: { google_id } });
      if (!user && email) {
        user = await prisma.user.findUnique({ where: { email } });

        if (user && !user.google_id) {
          user = await prisma.user.update({
            where: { email },
            data: { google_id },
          });
        }
      }

      if (!user) {
        user = await prisma.user.create({
          data: {
            google_id,
            email,
            firstname: given_name,
            lastname: family_name,
            profile_image_url: picture,
            password: null,
          },
        });
      }

      const jwt = generateToken(user.user_id, user.email);

      return {
        token: jwt,
        user,
      };
    },
  },
};
