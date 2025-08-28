import React from 'react';
import { Download, Image, Video, FileText, Mic, Clock, User } from 'lucide-react';
import { Message, Chat } from '../types';
import { downloadMedia } from '../api';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  selectedChat: Chat | null;
  formatTime: (date: Date) => string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading, selectedChat, formatTime }) => {
  const handleDownloadMedia = async (messageId: string, chatJid: string) => {
    try {
      const result = await downloadMedia(messageId, chatJid);
      if (result.success) {
        alert(`Media downloaded successfully: ${result.data?.path || 'Unknown path'}`);
      } else {
        alert(`Download failed: ${result.message}`);
      }
    } catch (error) {
      alert('Download failed: Network error');
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Mic className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs p-3 rounded-lg ${i % 2 === 0 ? 'bg-gray-200' : 'bg-blue-200'}`}>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          {selectedChat ? (
            <>
              <div className="w-10 h-10 bg-gradient-to-br from-whatsapp-400 to-whatsapp-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedChat.name || selectedChat.jid.split('@')[0]}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedChat.is_group ? 'Group Chat' : 'Direct Message'}
                </p>
              </div>
            </>
          ) : (
            <>
              <Clock className="w-6 h-6 text-gray-400" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
                <p className="text-sm text-gray-500">{messages.length} messages</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.is_from_me ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.is_from_me
                  ? 'bg-whatsapp-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {/* Sender info for group chats */}
              {!message.is_from_me && selectedChat?.is_group && (
                <div className="text-xs font-medium text-whatsapp-600 mb-1">
                  {message.sender.split('@')[0]}
                </div>
              )}

              {/* Media indicator */}
              {message.media_type && (
                <div className={`flex items-center space-x-2 mb-2 p-2 rounded ${
                  message.is_from_me ? 'bg-whatsapp-600' : 'bg-gray-200'
                }`}>
                  {getMediaIcon(message.media_type)}
                  <span className="text-xs font-medium capitalize">
                    {message.media_type}
                  </span>
                  <button
                    onClick={() => handleDownloadMedia(message.id, message.chat_jid)}
                    className={`ml-auto p-1 rounded hover:bg-opacity-20 hover:bg-black transition-colors ${
                      message.is_from_me ? 'text-white' : 'text-gray-600'
                    }`}
                    title="Download media"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Message content */}
              {message.content && (
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              )}

              {/* Timestamp */}
              <div className={`text-xs mt-2 ${
                message.is_from_me ? 'text-whatsapp-100' : 'text-gray-500'
              }`}>
                {formatTime(new Date(message.timestamp))}
                {!selectedChat && message.chat_name && (
                  <span className="ml-2">• {message.chat_name}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No messages to display</p>
            {selectedChat && (
              <p className="text-sm text-gray-400 mt-2">
                Start a conversation with {selectedChat.name || selectedChat.jid.split('@')[0]}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;