// src/components/PushNotificationDemo.jsx
import React, { useState, useEffect, useRef } from 'react';

const PushNotificationDemo = () => {
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDemo, setShowDemo] = useState(true);
  const [lastTestResult, setLastTestResult] = useState('');
  const [browserSupport, setBrowserSupport] = useState({
    notifications: false,
    serviceWorker: false,
    pushManager: false,
    isMobile: false,
    isIOS: false,
    browserName: ''
  });
  
  // Dragging state
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  // Detect browser and capabilities
  const detectBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    
    let browserName = 'Unknown';
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) browserName = 'Chrome';
    else if (userAgent.includes('firefox')) browserName = 'Firefox';
    else if (userAgent.includes('safari') && !userAgent.includes('chrome')) browserName = 'Safari';
    else if (userAgent.includes('edg')) browserName = 'Edge';
    else if (userAgent.includes('opera')) browserName = 'Opera';
    
    return { isMobile, isIOS, browserName };
  };

  // Check browser support
  const checkBrowserSupport = () => {
    const { isMobile, isIOS, browserName } = detectBrowser();
    
    const support = {
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      isMobile,
      isIOS,
      browserName
    };
    
    setBrowserSupport(support);
    return support.notifications && support.serviceWorker && support.pushManager;
  };

  // Load saved position
  useEffect(() => {
    const savedPosition = localStorage.getItem('notification_demo_position');
    if (savedPosition) {
      const pos = JSON.parse(savedPosition);
      setPosition(pos);
    }
  }, []);

  // Handle drag start
  const handleDragStart = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - (position.x || 0),
        y: e.clientY - (position.y || 0)
      });
    }
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const maxX = window.innerWidth - (dragRef.current?.offsetWidth || 340);
      const maxY = window.innerHeight - (dragRef.current?.offsetHeight || 400);
      
      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));
      
      setPosition({ x: boundedX, y: boundedY });
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      if (position.x !== null && position.y !== null) {
        localStorage.setItem('notification_demo_position', JSON.stringify(position));
      }
    }
  };

  // Add drag listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, dragStart]);

  // Fallback: Show alert notification (works everywhere)
  const showAlertNotification = (title, message) => {
    // Create a custom alert that looks like a notification
    const notificationDiv = document.createElement('div');
    notificationDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 16px;
      max-width: 320px;
      z-index: 10001;
      animation: slideInRight 0.3s ease;
      border-left: 4px solid #6d9eeb;
    `;
    
    notificationDiv.innerHTML = `
      <div style="display: flex; align-items: start; gap: 12px;">
        <div style="font-size: 24px;">🔔</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
          <div style="font-size: 13px; color: #666;">${message}</div>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                  style="margin-top: 8px; background: none; border: none; color: #6d9eeb; cursor: pointer; font-size: 12px;">
            Fermer
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(notificationDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notificationDiv.parentElement) {
        notificationDiv.remove();
      }
    }, 5000);
  };

  // Test notification with fallback
  const testNotification = () => {
    const { notifications, pushManager } = browserSupport;
    
    if (!notifications) {
      // Use fallback alert for unsupported browsers
      showAlertNotification('🎉 Offre Spéciale!', 'Profitez de -20% sur tous les microscopes aujourd\'hui!');
      setLastTestResult('✅ Notification affichée (mode compatibilité)');
      setMessage('📨 Notification envoyée!');
      setTimeout(() => setMessage(''), 2000);
      setTimeout(() => setLastTestResult(''), 4000);
      return;
    }
    
    if (Notification.permission !== 'granted') {
      showAlertNotification('🔔 Activation requise', 'Activez les notifications pour ne rien rater!');
      setMessage('❌ Activez d\'abord les notifications');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    try {
      const notification = new Notification('🎉 Offre Spéciale!', {
        body: 'Profitez de -20% sur tous les microscopes aujourd\'hui!',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
        alert('🔔 Offre ouverte!');
      };
      
      setLastTestResult('✅ Notification envoyée!');
      setMessage('📨 Notification test envoyée!');
      setTimeout(() => setMessage(''), 2000);
      setTimeout(() => setLastTestResult(''), 4000);
      
    } catch (error) {
      // Fallback if native notification fails
      showAlertNotification('🎉 Offre Spéciale!', 'Profitez de -20% sur tous les microscopes aujourd\'hui!');
      setLastTestResult('✅ Notification affichée (mode fallback)');
      setMessage('📨 Notification envoyée!');
      setTimeout(() => setMessage(''), 2000);
      setTimeout(() => setLastTestResult(''), 4000);
    }
  };

  // Send multiple test notifications with fallback
  const testMultipleNotifications = () => {
    const offers = [
      { title: '🔥 Flash Sale!', body: '-30% sur tous les microscopes - 24h seulement!' },
      { title: '🚚 Livraison Gratuite', body: 'Pour toute commande > 1000 MAD' },
      { title: '💎 Offre PRO', body: '-20% supplémentaire pour les pros' },
      { title: '🎁 Nouveau Produit', body: 'Découvrez notre nouvelle centrifugeuse' }
    ];
    
    setMessage(`📨 Envoi de ${offers.length} offres...`);
    
    offers.forEach((offer, index) => {
      setTimeout(() => {
        if (browserSupport.notifications && Notification.permission === 'granted') {
          new Notification(offer.title, {
            body: offer.body,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            tag: `offer-${index}`
          });
        } else {
          showAlertNotification(offer.title, offer.body);
        }
        
        if (index === offers.length - 1) {
          setMessage(`✅ ${offers.length} offres envoyées!`);
          setTimeout(() => setMessage(''), 2000);
        }
      }, index * 2000);
    });
  };

  // Activate notifications (or show instructions)
  const activateNotifications = async () => {
    setLoading(true);
    setMessage('');
    
    const { notifications, serviceWorker, pushManager, isIOS, browserName } = browserSupport;
    
    // Check if notifications are supported at all
    if (!notifications) {
      let instructions = '';
      
      if (isIOS) {
        instructions = `📱 Instructions pour iOS Safari:\n\n1. Appuyez sur le bouton "Partager" (carré avec flèche)\n2. Sélectionnez "Sur l'écran d'accueil"\n3. Ouvrez l'app depuis l'écran d'accueil\n4. Les notifications fonctionneront alors!\n\nOu utilisez Chrome/Firefox pour une meilleure expérience.`;
      } else {
        instructions = `🌐 Votre navigateur (${browserName}) ne supporte pas les notifications push.\n\nSolutions:\n• Utilisez Google Chrome\n• Utilisez Mozilla Firefox\n• Utilisez Microsoft Edge\n\nSur iOS, ajoutez le site à l'écran d'accueil.`;
      }
      
      setMessage(instructions);
      setTimeout(() => setMessage(''), 8000);
      setLoading(false);
      return;
    }
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setMessage('✅ Notifications activées!');
        
        // Try to register service worker if supported
        if (serviceWorker && pushManager) {
          try {
            await registerServiceWorker();
            const registration = await navigator.serviceWorker.ready;
            const vapidKey = getVapidPublicKey();
            const convertedKey = urlBase64ToUint8Array(vapidKey);
            
            await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedKey
            });
            
            setIsSubscribed(true);
            localStorage.setItem('push_enabled', 'true');
          } catch (swError) {
            console.log('Service worker registration failed, using basic notifications');
            // Still works with basic notifications
          }
        }
        
        setTimeout(() => setMessage(''), 3000);
        
      } else if (result === 'denied') {
        let instructions = '❌ Permission refusée. Pour activer:\n\n';
        
        if (isIOS) {
          instructions += '1. Ouvrez Réglages > Safari\n2. Activez les notifications\n3. Rafraîchissez la page';
        } else {
          instructions += '1. Cliquez sur l\'icône 🔒 dans la barre d\'adresse\n2. Autorisez les notifications\n3. Rafraîchissez la page';
        }
        
        setMessage(instructions);
        setTimeout(() => setMessage(''), 8000);
      }
    } catch (error) {
      console.error('Error activating:', error);
      setMessage('❌ Erreur: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for service worker (if supported)
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const getVapidPublicKey = () => {
    return 'BLfq_tmJqMqzvQgNtqzkIq7J6jLkqQl0rVpXxYyZzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
  };

  const createServiceWorker = () => {
    const swCode = `
      self.addEventListener('install', (event) => { self.skipWaiting(); });
      self.addEventListener('activate', (event) => { event.waitUntil(clients.claim()); });
      self.addEventListener('push', (event) => {
        let data = {};
        if (event.data) {
          try { data = event.data.json(); } catch(e) { data = { title: 'Nouvelle Offre!', body: event.data.text() }; }
        }
        event.waitUntil(self.registration.showNotification(data.title || '🎉 Nouvelle Offre!', {
          body: data.body || 'Découvrez nos dernières offres!',
          icon: data.icon || '/icon-192x192.png',
          badge: '/badge-72x72.png',
          data: { url: data.url || '/' }
        }));
      });
      self.addEventListener('notificationclick', (event) => {
        event.notification.close();
        event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
      });
    `;
    const blob = new Blob([swCode], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
  };

  const registerServiceWorker = async () => {
    try {
      const swUrl = createServiceWorker();
      const registration = await navigator.serviceWorker.register(swUrl);
      URL.revokeObjectURL(swUrl);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  };

  // Disable notifications
  const disableNotifications = async () => {
    setLoading(true);
    try {
      if (browserSupport.serviceWorker && browserSupport.pushManager) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) await subscription.unsubscribe();
      }
      setIsSubscribed(false);
      localStorage.removeItem('push_enabled');
      setMessage('🔕 Notifications désactivées');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error disabling:', error);
    } finally {
      setLoading(false);
    }
  };

  // Close demo
  const closeDemo = () => {
    setShowDemo(false);
    localStorage.setItem('notification_demo_closed', 'true');
  };

  // Reopen demo
  const reopenDemo = () => {
    setShowDemo(true);
    localStorage.removeItem('notification_demo_closed');
  };

  // Check initial state
  useEffect(() => {
    const wasClosed = localStorage.getItem('notification_demo_closed');
    if (wasClosed === 'true') setShowDemo(false);
    
    const supported = checkBrowserSupport();
    setPermission(Notification.permission || 'default');
    
    if (supported && Notification.permission === 'granted') {
      const checkSubscription = async () => {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          if (registrations.length === 0) await registerServiceWorker();
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      };
      checkSubscription();
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => style.remove();
  }, []);

  // Get position style
  const getPositionStyle = () => {
    if (position.x !== null && position.y !== null) {
      return {
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 9999,
        maxWidth: '380px'
      };
    }
    return {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '380px'
    };
  };

  // If demo is closed, show small button
  if (!showDemo) {
    return (
      <button
        onClick={reopenDemo}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#6d9eeb',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          cursor: 'pointer',
          fontSize: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        🔔
      </button>
    );
  }

  const { notifications, isIOS, browserName } = browserSupport;
  const isFullySupported = notifications;

  return (
    <div ref={dragRef} style={getPositionStyle()}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        padding: '20px',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'default'
      }}>
        {/* Drag Handle */}
        <div 
          className="drag-handle"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '40px',
            cursor: 'grab',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.5,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.5'}
          onMouseDown={handleDragStart}
        >
          <div style={{
            width: '40px',
            height: '4px',
            background: '#ddd',
            borderRadius: '2px',
            marginTop: '12px'
          }} />
        </div>

        {/* Close Button */}
        <button
          onClick={closeDemo}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#999',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f0f0f0';
            e.target.style.color = '#666';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
            e.target.style.color = '#999';
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingRight: '24px', marginTop: '8px' }}>
          <div style={{ fontSize: '32px' }}>🔔</div>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
            Notifications Offres
            {!isFullySupported && (
              <span style={{ fontSize: '10px', marginLeft: '8px', color: '#ff9800', display: 'block' }}>
                Mode compatibilité
              </span>
            )}
          </h3>
        </div>

        {/* Browser Info */}
        <div style={{
          fontSize: '11px',
          color: '#666',
          marginBottom: '12px',
          padding: '6px 10px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          🌐 {browserName} {isIOS ? '(iOS)' : ''} • 
          {isFullySupported ? '✅ Notifications supportées' : '⚠️ Mode fallback actif'}
        </div>

        {/* Permission Status */}
        {isFullySupported && (
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '16px',
            background: permission === 'granted' ? '#e8f5e9' : permission === 'denied' ? '#ffebee' : '#fff3e0',
            color: permission === 'granted' ? '#2e7d32' : permission === 'denied' ? '#c62828' : '#ef6c00'
          }}>
            {permission === 'granted' && '✅ Notifications activées'}
            {permission === 'denied' && '❌ Notifications bloquées'}
            {permission === 'default' && '⏳ Notifications désactivées'}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(!isFullySupported || permission !== 'granted') && (
            <button
              onClick={activateNotifications}
              disabled={loading}
              style={{
                padding: '12px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                opacity: loading ? 0.6 : 1,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#45a049';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#4caf50';
              }}
            >
              {loading ? '⏳ Activation...' : (isFullySupported ? '🔔 Activer les notifications' : '📱 Activer le mode notifications')}
            </button>
          )}

          <button
            onClick={testNotification}
            style={{
              padding: '12px',
              background: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#1976d2'}
            onMouseLeave={(e) => e.target.style.background = '#2196f3'}
          >
            🎁 Tester une notification
          </button>

          <button
            onClick={testMultipleNotifications}
            style={{
              padding: '12px',
              background: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f57c00'}
            onMouseLeave={(e) => e.target.style.background = '#ff9800'}
          >
            📦 Envoyer 4 offres (test)
          </button>

          {isFullySupported && permission === 'granted' && (
            <button
              onClick={disableNotifications}
              disabled={loading}
              style={{
                padding: '12px',
                background: '#f5f5f5',
                color: '#666',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                opacity: loading ? 0.6 : 1,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#f5f5f5';
              }}
            >
              {loading ? '⏳ Désactivation...' : '🔕 Désactiver'}
            </button>
          )}
        </div>

        {/* Message */}
        {message && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: message.includes('✅') ? '#e8f5e9' : message.includes('❌') ? '#ffebee' : '#fff3e0',
            color: message.includes('✅') ? '#2e7d32' : message.includes('❌') ? '#c62828' : '#ef6c00',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            animation: 'fadeIn 0.3s ease'
          }}>
            {message}
          </div>
        )}

        {/* Test Result */}
        {lastTestResult && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: '#e8f5e9',
            color: '#2e7d32',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'center',
            animation: 'fadeOut 5s forwards'
          }}>
            {lastTestResult}
          </div>
        )}

        {/* Info */}
        <div style={{
          fontSize: '10px',
          color: '#999',
          marginTop: '12px',
          textAlign: 'center',
          paddingTop: '8px',
          borderTop: '1px solid #eee'
        }}>
          <div>💡 Cliquez et glissez la barre grise pour déplacer</div>
          {!isFullySupported && (
            <div style={{ marginTop: '4px', color: '#ff9800' }}>
              📱 Mode fallback: les notifications s'affichent comme des alertes visuelles
            </div>
          )}
          {isIOS && (
            <div style={{ marginTop: '4px' }}>
              📱 iOS: Ajoutez à l'écran d'accueil pour les notifications natives
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default PushNotificationDemo;
