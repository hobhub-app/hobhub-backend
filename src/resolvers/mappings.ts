import { prisma } from "../config/prisma";

export const mappingResolvers = {
  User: {
    id: (parent: any) => parent.user_id,
    googleId: (parent: any) => parent.google_id,
    profileImageUrl: (parent: any) => parent.profile_image_url,
    profileDescription: (parent: any) => parent.profile_description,
    createdAt: (parent: any) => parent.created_at,
  },

  Hobby: {
    id: (parent: any) => parent.hobby_id,
    name: (parent: any) => parent.hobby_name,
  },

  UserHobby: {
    userId: (parent: any) => parent.user_id,
    hobbyId: (parent: any) => parent.hobby_id,
    skillLevel: (parent: any) => parent.skill_level,
  },

  SavedUser: {
    userId: (parent: any) => parent.user_id,
    savedUserId: (parent: any) => parent.saved_user_id,
    createdAt: (parent: any) => parent.created_at,
  },

  Conversation: {
    id: (parent: any) => parent.conversation_id,
    user1Id: (parent: any) => parent.user1_id,
    user2Id: (parent: any) => parent.user2_id,
    createdAt: (parent: any) => parent.created_at,
    lastMessageAt: (parent: any) => parent.last_message_at,
    lastMessageContent: (parent: any) => parent.last_message_content,
  },

  ConversationMessage: {
    id: (parent: any) => parent.message_id,
    conversationId: (parent: any) => parent.conversation_id,
    senderId: (parent: any) => parent.sender_id,
    createdAt: (parent: any) => parent.created_at,
    readAt: (parent: any) => parent.read_at,

    sender: async (parent: any) => {
      const user = await prisma.user.findUnique({
        where: { user_id: parent.sender_id },
      });

      if (!user) {
        throw new Error(`User not found for sender_id ${parent.sender_id}`);
      }

      return user;
    },
  },
};
