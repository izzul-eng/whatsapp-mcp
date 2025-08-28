export interface Chat {
  jid: string;
  name: string | null;
  last_message_time: string | null;
  last_message: string | null;
  last_sender: string | null;
  last_is_from_me: boolean | null;
  is_group: boolean;
}

export interface Message {
  id: string;
  timestamp: string;
  sender: string;
  content: string;
  is_from_me: boolean;
  chat_jid: string;
  chat_name: string | null;
  media_type: string | null;
}

export interface Contact {
  phone_number: string;
  name: string | null;
  jid: string;
}

export interface SendMessageRequest {
  recipient: string;
  message: string;
  media_path?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ConnectionStatus {
  connected: boolean;
  authenticated: boolean;
  qr_code?: string;
  device_id?: string;
  phone_number?: string;
  status_message: string;
}