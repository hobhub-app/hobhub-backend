import { prisma } from "../config/prisma";

export const getOrCreateConversation = async (
  userAId: number,
  userBId: number
) => {
  const [user1_id, user2_id] =
    userAId < userBId ? [userAId, userBId] : [userBId, userAId];

  const existingConversation = await prisma.conversation.findFirst({
    where: {
      user1_id,
      user2_id,
    },
  });

  if (existingConversation) {
    return existingConversation;
  }

  return prisma.conversation.create({
    data: {
      user1_id,
      user2_id,
    },
  });
};

export const createMessage = async (
  conversationId: number,
  senderId: number,
  content: string
) => {
  if (!content.trim()) {
    throw new Error("Message content cannot be empty");
  }

  const message = await prisma.conversationMessage.create({
    data: {
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    },
  });

  await prisma.conversation.update({
    where: { conversation_id: conversationId },
    data: { last_message_at: new Date() },
  });

  return message;
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
