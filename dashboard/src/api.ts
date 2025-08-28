import { Chat, Message, Contact, SendMessageRequest, ApiResponse } from './types';

const API_BASE = '/api';
const MCP_BASE = 'http://localhost:8000'; // MCP server endpoint

// WhatsApp Bridge API calls
export const sendMessage = async (request: SendMessageRequest): Promise<ApiResponse<any>> => {
  const response = await fetch(`${API_BASE}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  return response.json();
};

export const downloadMedia = async (messageId: string, chatJid: string): Promise<ApiResponse<any>> => {
  const response = await fetch(`${API_BASE}/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message_id: messageId,
      chat_jid: chatJid,
    }),
  });
  
  return response.json();
};

// MCP Server API calls (these would need to be proxied through a backend)
// For now, we'll simulate the data structure

export const fetchChats = async (query?: string, limit = 50): Promise<Chat[]> => {
  // This would normally call the MCP server
  // For demo purposes, returning mock data
  return [
    {
      jid: "1234567890@s.whatsapp.net",
      name: "John Doe",
      last_message_time: new Date().toISOString(),
      last_message: "Hey, how are you?",
      last_sender: "1234567890",
      last_is_from_me: false,
      is_group: false
    },
    {
      jid: "0987654321@g.us",
      name: "Family Group",
      last_message_time: new Date(Date.now() - 3600000).toISOString(),
      last_message: "See you tomorrow!",
      last_sender: "1234567890",
      last_is_from_me: true,
      is_group: true
    }
  ];
};

export const fetchMessages = async (params: {
  chat_jid?: string;
  sender_phone_number?: string;
  query?: string;
  limit?: number;
  page?: number;
}): Promise<Message[]> => {
  // This would normally call the MCP server
  return [
    {
      id: "msg1",
      timestamp: new Date().toISOString(),
      sender: "1234567890",
      content: "Hello there!",
      is_from_me: false,
      chat_jid: "1234567890@s.whatsapp.net",
      chat_name: "John Doe",
      media_type: null
    },
    {
      id: "msg2",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      sender: "me",
      content: "Hi! How are you doing?",
      is_from_me: true,
      chat_jid: "1234567890@s.whatsapp.net",
      chat_name: "John Doe",
      media_type: null
    }
  ];
};

export const fetchContacts = async (query: string): Promise<Contact[]> => {
  // This would normally call the MCP server
  return [
    {
      phone_number: "1234567890",
      name: "John Doe",
      jid: "1234567890@s.whatsapp.net"
    },
    {
      phone_number: "0987654321",
      name: "Jane Smith",
      jid: "0987654321@s.whatsapp.net"
    }
  ];
};

export const searchMessages = async (query: string): Promise<Message[]> => {
  return fetchMessages({ query });
};

export const getMessageContext = async (messageId: string, before = 5, after = 5) => {
  // This would call the MCP server's get_message_context function
  return {
    message: await fetchMessages({ limit: 1 }),
    before: await fetchMessages({ limit: before }),
    after: await fetchMessages({ limit: after })
  };
};

// WhatsApp Connection API calls
export const getConnectionStatus = async (): Promise<ConnectionStatus> => {
  try {
    const response = await fetch(`${API_BASE}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to get connection status:', error);
  }
  
  // Fallback response
  return {
    connected: false,
    authenticated: false,
    status_message: "Not connected to WhatsApp"
  };
};

export const initiateConnection = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE}/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Failed to initiate connection'
    };
  }
};

export const disconnectWhatsApp = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE}/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Failed to disconnect'
    };
  }
};