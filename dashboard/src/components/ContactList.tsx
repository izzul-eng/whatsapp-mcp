import React, { useState } from 'react';
import { User, Phone, Search, MessageSquare } from 'lucide-react';
import { Contact } from '../types';

interface ContactListProps {
  contacts: Contact[];
  loading: boolean;
  onContactSelect: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, loading, onContactSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone_number.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
        <span className="text-sm text-gray-500">{contacts.length} contacts</span>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        {filteredContacts.map((contact) => (
          <div
            key={contact.jid}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {contact.name || 'Unknown Contact'}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {contact.phone_number}
                  </span>
                </div>
                <span className="text-xs text-gray-400 truncate block">
                  {contact.jid}
                </span>
              </div>
            </div>

            <button
              onClick={() => onContactSelect(contact)}
              className="p-2 text-whatsapp-600 hover:bg-whatsapp-50 rounded-lg transition-colors"
              title="Open chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery ? 'No contacts found matching your search' : 'No contacts found'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactList;