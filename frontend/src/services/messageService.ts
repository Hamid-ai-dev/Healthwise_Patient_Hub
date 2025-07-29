import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface Contact {
  _id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  lastMessage?: {
    content: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
    senderName: string;
  };
  unreadCount: number;
}

export interface MessageData {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  receiverId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  content: string;
  messageType: 'text' | 'image' | 'document';
  isRead: boolean;
  readAt?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationResponse {
  success: boolean;
  messages: MessageData[];
  contact: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ContactsResponse {
  success: boolean;
  contacts: Contact[];
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: MessageData;
}

export interface UnreadCountResponse {
  success: boolean;
  unreadCount: number;
}

class MessageService {
  private getAuthHeaders(token: string) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async getContacts(token: string): Promise<Contact[]> {
    try {
      const response = await axios.get<ContactsResponse>(
        `${API_BASE_URL}/messages/contacts`,
        this.getAuthHeaders(token)
      );
      return response.data.contacts;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async getConversation(
    token: string,
    contactId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<ConversationResponse> {
    try {
      const response = await axios.get<ConversationResponse>(
        `${API_BASE_URL}/messages/conversation/${contactId}?page=${page}&limit=${limit}`,
        this.getAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  async sendMessage(
    token: string,
    receiverId: string,
    content: string,
    messageType: 'text' | 'image' | 'document' = 'text'
  ): Promise<MessageData> {
    try {
      const response = await axios.post<SendMessageResponse>(
        `${API_BASE_URL}/messages/send`,
        {
          receiverId,
          content,
          messageType,
        },
        this.getAuthHeaders(token)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async markAsRead(token: string, contactId: string): Promise<void> {
    try {
      await axios.put(
        `${API_BASE_URL}/messages/read/${contactId}`,
        {},
        this.getAuthHeaders(token)
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  async getUnreadCount(token: string): Promise<number> {
    try {
      const response = await axios.get<UnreadCountResponse>(
        `${API_BASE_URL}/messages/unread-count`,
        this.getAuthHeaders(token)
      );
      return response.data.unreadCount;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }
}

export const messageService = new MessageService();
