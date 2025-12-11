import { userResolvers } from "./user.js";
import { hobbyResolvers } from "./hobby.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...hobbyResolvers.Query,
  },
  Mutation: {
    // ...userResolvers.Mutation,
    ...hobbyResolvers.Mutation,
  },
};
