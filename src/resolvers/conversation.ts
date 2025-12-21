import { AuthContext } from "../auth/types";
import { prisma } from "../config/prisma";
import {
  createMessage,
  getMessagesByConversation,
  getOrCreateConversation,
} from "../services/conversationService";
import sendToUser from "../websocket/sendToUser.js";

export const conversationResolvers = {
  Query: {
    myConversations: async (_: unknown, __: unknown, context: AuthContext) => {
      if (!context.isAuthenticated) {
        throw new Error("Not authenticated");
      }

      return prisma.conversation.findMany({
        where: {
          OR: [
            { user1_id: context.user?.userId },
            { user2_id: context.user?.userId },
          ],
        },
        orderBy: {
          last_message_at: "desc",
        },
      });
    },

    conversationMessages: async (
      _: unknown,
      { conversationId }: { conversationId: number },
      context: AuthContext
    ) => {
      if (!context.isAuthenticated) {
        throw new Error("Not authenticated");
      }

      const userId = context.user?.userId;

      const conversation = await prisma.conversation.findUnique({
        where: { conversation_id: conversationId },
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const isParticipant =
        conversation.user1_id === userId || conversation.user2_id === userId;

      if (!isParticipant) {
        throw new Error("Access denied");
      }

      return getMessagesByConversation(conversationId);
    },
  },

  Mutation: {
    sendMessage: async (
      _: unknown,
      { receiverId, content }: { receiverId: number; content: string },
      context: AuthContext
    ) => {
      const senderId = context.user?.userId;
      if (!senderId) {
        throw new Error("Not authenticated");
      }

      const conversation = await getOrCreateConversation(senderId, receiverId);

      const isParticipant =
        conversation.user1_id === senderId ||
        conversation.user2_id === senderId;

      if (!isParticipant) {
        throw new Error("Access denied");
      }

      const message = await createMessage(
        conversation.conversation_id,
        senderId,
        content
      );

      const actualReceiverId =
        conversation.user1_id === senderId
          ? conversation.user2_id
          : conversation.user1_id;

      sendToUser(actualReceiverId, {
        type: "NEW_MESSAGE",
        payload: {
          conversationId: conversation.conversation_id,
          message,
        },
      });

      return message;
    },
  },
};
