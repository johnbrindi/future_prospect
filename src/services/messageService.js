import React from 'react';
import { supabase } from '@/lib/supabase';

export const getConversations = async (userId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const conversations = new Map();
  
  for (const message of data) {
    const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
    
    if (!conversations.has(otherUserId)) {
      conversations.set(otherUserId, {
        userId: otherUserId,
        lastMessage: message,
        unreadCount: message.receiver_id === userId && !message.read ? 1 : 0
      });
    } else {
      const conversation = conversations.get(otherUserId);
      if (message.receiver_id === userId && !message.read) {
        conversation.unreadCount += 1;
      }
    }
  }

  return Array.from(conversations.values());
};

export const getMessagesBetweenUsers = async (userId1, userId2) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const sendMessage = async (senderId, receiverId, content) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      read: false
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const markMessagesAsRead = async (userId, otherUserId) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('receiver_id', userId)
    .eq('sender_id', otherUserId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};