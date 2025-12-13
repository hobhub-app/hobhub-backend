import { userResolvers } from "./user.js";
import { hobbyResolvers } from "./hobby.js";
import { authResolvers } from "./auth.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...hobbyResolvers.Query,
  },
  Mutation: {
    // ...userResolvers.Mutation,
    ...hobbyResolvers.Mutation,
    ...authResolvers.Mutation,
  },
};
