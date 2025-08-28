import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Send, Download, Search, Phone, Clock, User } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import ChatList from './components/ChatList';
import MessageList from './components/MessageList';
import ContactList from './components/ContactList';
import SendMessage from './components/SendMessage';
import WhatsAppConnection from './components/WhatsAppConnection';
import { Chat, Message, Contact } from './types';
import { fetchChats, fetchMessages, fetchContacts, searchMessages } from './api';

function App() {
  const [activeTab, setActiveTab] = useState<'connection' | 'chats' | 'messages' | 'contacts' | 'send'>('connection');
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadChats();
    loadContacts();
  }, []);

  const loadChats = async () => {
    setLoading(true);
    try {
      const data = await fetchChats();
      setChats(data);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatJid?: string, query?: string) => {
    setLoading(true);
    try {
      const data = query 
        ? await searchMessages(query)
        : await fetchMessages({ chat_jid: chatJid });
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const data = await fetchContacts('');
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    loadMessages(chat.jid);
    setActiveTab('messages');
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await loadMessages(undefined, searchQuery);
      setActiveTab('messages');
    }
  };

  const formatTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-whatsapp-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">WhatsApp MCP Dashboard</h1>
            </div>
            
            {/* Search */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-whatsapp-500 text-white rounded-lg hover:bg-whatsapp-600 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm border">
            <nav className="p-4 space-y-2">
              <button
                onClick={() => setActiveTab('connection')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'connection' 
                    ? 'bg-whatsapp-100 text-whatsapp-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Phone className="w-5 h-5" />
                <span>Connection</span>
              </button>
              
              <button
                onClick={() => setActiveTab('chats')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'chats' 
                    ? 'bg-whatsapp-100 text-whatsapp-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chats</span>
              </button>
              
              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'messages' 
                    ? 'bg-whatsapp-100 text-whatsapp-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>Messages</span>
              </button>
              
              <button
                onClick={() => setActiveTab('contacts')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'contacts' 
                    ? 'bg-whatsapp-100 text-whatsapp-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Contacts</span>
              </button>
              
              <button
                onClick={() => setActiveTab('send')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'send' 
                    ? 'bg-whatsapp-100 text-whatsapp-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border">
            {activeTab === 'connection' && (
              <WhatsAppConnection />
            )}
            
            {activeTab === 'chats' && (
              <ChatList 
                chats={chats} 
                loading={loading} 
                onChatSelect={handleChatSelect}
                formatTime={formatTime}
              />
            )}
            
            {activeTab === 'messages' && (
              <MessageList 
                messages={messages} 
                loading={loading}
                selectedChat={selectedChat}
                formatTime={formatTime}
              />
            )}
            
            {activeTab === 'contacts' && (
              <ContactList 
                contacts={contacts} 
                loading={loading}
                onContactSelect={(contact) => {
                  // Find or create chat for this contact
                  const existingChat = chats.find(chat => chat.jid.includes(contact.phone_number));
                  if (existingChat) {
                    handleChatSelect(existingChat);
                  }
                }}
              />
            )}
            
            {activeTab === 'send' && (
              <SendMessage 
                contacts={contacts}
                onMessageSent={() => {
                  // Refresh chats after sending
                  loadChats();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;