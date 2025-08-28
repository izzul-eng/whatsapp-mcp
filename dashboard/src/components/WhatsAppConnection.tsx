import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, WifiOff, QrCode, CheckCircle, AlertCircle, RefreshCw, Power, PowerOff } from 'lucide-react';
import { ConnectionStatus } from '../types';
import { getConnectionStatus, initiateConnection, disconnectWhatsApp } from '../api';

const WhatsAppConnection: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    checkStatus();
    // Poll status every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const connectionStatus = await getConnectionStatus();
      setStatus(connectionStatus);
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const result = await initiateConnection();
      if (result.success) {
        // Start polling more frequently during connection
        const pollInterval = setInterval(async () => {
          const newStatus = await getConnectionStatus();
          setStatus(newStatus);
          if (newStatus.authenticated) {
            clearInterval(pollInterval);
            setConnecting(false);
          }
        }, 2000);
        
        // Stop polling after 3 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          setConnecting(false);
        }, 180000);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      if (!connecting) {
        setConnecting(false);
      }
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await disconnectWhatsApp();
      await checkStatus();
    } catch (error) {
      console.error('Disconnect failed:', error);
    } finally {
      setDisconnecting(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await checkStatus();
    setLoading(false);
  };

  if (!status) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-6 h-6 text-whatsapp-600" />
          <h2 className="text-xl font-semibold text-gray-900">WhatsApp Connection</h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh status"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Connection Status Card */}
        <div className={`p-4 rounded-lg border-2 ${
          status.connected && status.authenticated
            ? 'border-green-200 bg-green-50'
            : status.connected
            ? 'border-yellow-200 bg-yellow-50'
            : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center space-x-3">
            {status.connected && status.authenticated ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : status.connected ? (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            ) : (
              <WifiOff className="w-6 h-6 text-red-600" />
            )}
            
            <div className="flex-1">
              <h3 className={`font-medium ${
                status.connected && status.authenticated
                  ? 'text-green-800'
                  : status.connected
                  ? 'text-yellow-800'
                  : 'text-red-800'
              }`}>
                {status.connected && status.authenticated
                  ? 'Connected & Authenticated'
                  : status.connected
                  ? 'Connected (Not Authenticated)'
                  : 'Disconnected'
                }
              </h3>
              <p className={`text-sm ${
                status.connected && status.authenticated
                  ? 'text-green-600'
                  : status.connected
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {status.status_message}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {status.connected ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>

          {/* Device Info */}
          {status.device_id && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Device ID:</span> {status.device_id}
              </div>
              {status.phone_number && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Phone:</span> {status.phone_number}
                </div>
              )}
            </div>
          )}
        </div>

        {/* QR Code Display */}
        {status.qr_code && !status.authenticated && (
          <div className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-lg text-center">
            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Scan QR Code with WhatsApp
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Open WhatsApp on your phone, go to Settings → Linked Devices → Link a Device, and scan this QR code
            </p>
            
            {/* QR Code would be displayed here */}
            <div className="w-64 h-64 mx-auto bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">QR Code will appear here</p>
                <p className="text-xs text-gray-400 mt-1">
                  (Implement QR code display from bridge)
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> The QR code will refresh automatically. 
                Make sure your phone and computer are connected to the internet.
              </p>
            </div>
          </div>
        )}

        {/* Connection Actions */}
        <div className="flex space-x-4">
          {!status.connected ? (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="flex items-center space-x-2 px-6 py-3 bg-whatsapp-500 text-white rounded-lg hover:bg-whatsapp-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {connecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Power className="w-4 h-4" />
                  <span>Connect WhatsApp</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {disconnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Disconnecting...</span>
                </>
              ) : (
                <>
                  <PowerOff className="w-4 h-4" />
                  <span>Disconnect</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Connection Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Make sure the WhatsApp bridge server is running</li>
            <li>Click "Connect WhatsApp" to initiate the connection</li>
            <li>Scan the QR code with your WhatsApp mobile app</li>
            <li>Wait for authentication to complete</li>
            <li>Once connected, you can use all dashboard features</li>
          </ol>
        </div>

        {/* Troubleshooting */}
        {!status.connected && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Troubleshooting:</h4>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>Ensure the WhatsApp bridge is running on port 8080</li>
              <li>Check that your firewall isn't blocking the connection</li>
              <li>Make sure you have a stable internet connection</li>
              <li>Try refreshing the page if the QR code doesn't appear</li>
              <li>If authentication fails, try disconnecting and reconnecting</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppConnection;