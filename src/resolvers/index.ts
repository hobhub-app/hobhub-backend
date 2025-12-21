import { userResolvers } from "./user.js";
import { hobbyResolvers } from "./hobby.js";
import { authResolvers } from "./auth.js";
import { conversationResolvers } from "./conversation.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...hobbyResolvers.Query,
    ...conversationResolvers.Query,
  },
  Mutation: {
    // ...userResolvers.Mutation,
    ...hobbyResolvers.Mutation,
    ...authResolvers.Mutation,
    ...conversationResolvers.Mutation,
  },
};
