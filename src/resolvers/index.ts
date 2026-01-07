import { userResolvers } from "./user.js";
import { hobbyResolvers } from "./hobby.js";
import { authResolvers } from "./auth.js";
import { conversationResolvers } from "./conversation.js";
import { mappingResolvers } from "./mappings.js";
import { GraphQLDateTime } from "graphql-scalars";

export const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    ...userResolvers.Query,
    ...hobbyResolvers.Query,
    ...conversationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...hobbyResolvers.Mutation,
    ...authResolvers.Mutation,
    ...conversationResolvers.Mutation,
  },

  ...mappingResolvers,
};
