import { prisma } from "../config/prisma.js";

export const getConversationForUser = async (
  conversationId: number,
  userId: number
) => {
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

  return conversation;
};

export const sendMessageService = async (
  senderId: number,
  receiverId: number,
  content: string
) => {
  if (!content.trim()) {
    throw new Error("Message content cannot be empty");
  }

  const [user1_id, user2_id] =
    senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];

  return prisma.$transaction(async (tx) => {
    let conversation = await tx.conversation.findFirst({
      where: { user1_id, user2_id },
    });

    if (!conversation) {
      conversation = await tx.conversation.create({
        data: {
          user1_id,
          user2_id,
          last_message_at: new Date(),
          last_message_content: content,
        },
      });
    }

    const message = await tx.conversationMessage.create({
      data: {
        conversation_id: conversation.conversation_id,
        sender_id: senderId,
        content,
      },
    });

    const isExistingConversation = !!conversation.last_message_at;

    if (isExistingConversation) {
      await tx.conversation.update({
        where: { conversation_id: conversation.conversation_id },
        data: {
          last_message_at: new Date(),
          last_message_content: content,
        },
      });
    }

    return { conversation, message };
  });
};

export const getMessagesByConversation = async (conversationId: number) => {
  return prisma.conversationMessage.findMany({
    where: {
      conversation_id: conversationId,
    },
    orderBy: {
      created_at: "asc",
    },
  });
};
