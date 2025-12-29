import { AuthContext } from "../auth/types";
import { prisma } from "../config/prisma.js";
import {
  getConversationForUser,
  getMessagesByConversation,
  sendMessageService,
} from "../services/conversationService.js";
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
        include: {
          user1: true,
          user2: true,
        },
      });
    },

    conversation: async (
      _: unknown,
      { conversationId }: { conversationId: number },
      context: AuthContext
    ) => {
      if (!context.isAuthenticated || !context.user?.userId) {
        throw new Error("Not Authenticated");
      }

      const userId = context.user.userId;

      return getConversationForUser(conversationId, userId);
    },

    conversationMessages: async (
      _: unknown,
      { conversationId }: { conversationId: number },
      context: AuthContext
    ) => {
      if (!context.isAuthenticated || !context.user?.userId) {
        throw new Error("Not authenticated");
      }

      const userId = context.user?.userId;

      await getConversationForUser(conversationId, userId);
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

      const { conversation, message } = await sendMessageService(
        senderId,
        receiverId,
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
