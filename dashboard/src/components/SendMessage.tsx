import React, { useState } from 'react';
import { Send, Upload, User, Users, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { Contact } from '../types';
import { sendMessage } from '../api';

interface SendMessageProps {
  contacts: Contact[];
  onMessageSent: () => void;
}

const SendMessage: React.FC<SendMessageProps> = ({ contacts, onMessageSent }) => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [mediaPath, setMediaPath] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [recipientType, setRecipientType] = useState<'phone' | 'jid' | 'contact'>('phone');

  const handleSend = async () => {
    if (!recipient.trim()) {
      setResult({ success: false, message: 'Please enter a recipient' });
      return;
    }

    if (!message.trim() && !mediaPath.trim()) {
      setResult({ success: false, message: 'Please enter a message or select a media file' });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const response = await sendMessage({
        recipient: recipient.trim(),
        message: message.trim(),
        media_path: mediaPath.trim() || undefined,
      });

      setResult(response);

      if (response.success) {
        setMessage('');
        setMediaPath('');
        onMessageSent();
      }
    } catch (error) {
      setResult({ success: false, message: 'Network error occurred' });
    } finally {
      setSending(false);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setRecipient(contact.jid);
    setRecipientType('contact');
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Send className="w-6 h-6 text-whatsapp-600" />
        <h2 className="text-xl font-semibold text-gray-900">Send Message</h2>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Recipient Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Recipient Type
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setRecipientType('phone')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                recipientType === 'phone'
                  ? 'border-whatsapp-500 bg-whatsapp-50 text-whatsapp-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Phone Number</span>
            </button>
            <button
              onClick={() => setRecipientType('jid')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                recipientType === 'jid'
                  ? 'border-whatsapp-500 bg-whatsapp-50 text-whatsapp-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>JID (Groups)</span>
            </button>
            <button
              onClick={() => setRecipientType('contact')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                recipientType === 'contact'
                  ? 'border-whatsapp-500 bg-whatsapp-50 text-whatsapp-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Select Contact</span>
            </button>
          </div>
        </div>

        {/* Recipient Input */}
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
            {recipientType === 'phone' && 'Phone Number (with country code, no +)'}
            {recipientType === 'jid' && 'JID (e.g., 123456789@s.whatsapp.net or 123456789@g.us)'}
            {recipientType === 'contact' && 'Selected Contact'}
          </label>
          
          {recipientType === 'contact' ? (
            <div className="space-y-2">
              <input
                type="text"
                value={recipient}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Select a contact below"
              />
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                {contacts.map((contact) => (
                  <button
                    key={contact.jid}
                    onClick={() => handleContactSelect(contact)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 text-left transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {contact.name || 'Unknown Contact'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {contact.phone_number}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent"
              placeholder={
                recipientType === 'phone' 
                  ? 'e.g., 1234567890' 
                  : 'e.g., 123456789@s.whatsapp.net'
              }
            />
          )}
        </div>

        {/* Message Input */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent"
            placeholder="Type your message here..."
          />
        </div>

        {/* Media Path Input */}
        <div>
          <label htmlFor="mediaPath" className="block text-sm font-medium text-gray-700 mb-2">
            Media File Path (Optional)
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="mediaPath"
              value={mediaPath}
              onChange={(e) => setMediaPath(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:border-transparent"
              placeholder="e.g., /path/to/image.jpg"
            />
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Browse files"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the full path to a media file (image, video, audio, or document)
          </p>
        </div>

        {/* Result Message */}
        {result && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            result.success 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {result.success ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm">{result.message}</span>
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-whatsapp-500 text-white rounded-lg hover:bg-whatsapp-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SendMessage;