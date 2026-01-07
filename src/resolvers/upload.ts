import { AuthContext } from "../auth/types";
import cloudinary from "../config/cloudinary.js";

export const uploadResolvers = {
  Mutation: {
    getUploadSignature: async (
      _: unknown,
      __: unknown,
      context: AuthContext
    ) => {
      if (!context.isAuthenticated) {
        throw new Error("Not authenticated");
      }

      const timestamp = Math.round(Date.now() / 1000);

      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp,
          folder: "hobhub/profiles",
        },
        process.env.CLOUDINARY_API_SECRET!
      );

      return {
        timestamp,
        signature,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
      };
    },
  },
};
