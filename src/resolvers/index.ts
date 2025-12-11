import { userResolvers } from "./user";
import { hobbyResolvers } from "./hobby";

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
