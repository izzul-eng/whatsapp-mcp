import React from 'react';
import { Users, MessageSquare, Clock } from 'lucide-react';
import { Chat } from '../types';

interface ChatListProps {
  chats: Chat[];
  loading: boolean;
  onChatSelect: (chat: Chat) => void;
  formatTime: (date: Date) => string;
}

const ChatList: React.FC<ChatListProps> = ({ chats, loading, onChatSelect, formatTime }) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Chats</h2>
        <span className="text-sm text-gray-500">{chats.length} conversations</span>
      </div>

      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.jid}
            onClick={() => onChatSelect(chat)}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-whatsapp-400 to-whatsapp-600 rounded-full flex items-center justify-center">
                {chat.is_group ? (
                  <Users className="w-6 h-6 text-white" />
                ) : (
                  <MessageSquare className="w-6 h-6 text-white" />
                )}
              </div>
              {chat.is_group && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-2 h-2 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {chat.name || chat.jid.split('@')[0]}
                </h3>
                {chat.last_message_time && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(new Date(chat.last_message_time))}
                  </span>
                )}
              </div>
              
              {chat.last_message && (
                <p className="text-sm text-gray-600 truncate mt-1">
                  {chat.last_is_from_me && (
                    <span className="text-whatsapp-600 mr-1">You:</span>
                  )}
                  {chat.last_message}
                </p>
              )}
              
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs text-gray-400">
                  {chat.is_group ? 'Group' : 'Direct'}
                </span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-400 truncate">
                  {chat.jid}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {chats.length === 0 && !loading && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No chats found</p>
        </div>
      )}
    </div>
  );
};

export default ChatList;