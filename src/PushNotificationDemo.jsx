// src/components/PushNotificationDemo.jsx
import React, { useState, useEffect, useRef } from 'react';

const PushNotificationDemo = () => {
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDemo, setShowDemo] = useState(true);
  const [lastTestResult, setLastTestResult] = useState('');
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  
  // Dragging state
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

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
      
      // Keep within viewport bounds
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
      // Save position
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

  // ... (keep all your existing functions - isPushSupported, urlBase64ToUint8Array, etc.)
  // I'll show only the changed parts, keep all your existing logic

  // Check if push notifications are supported
  const isPushSupported = () => {
    return 'Notification' in window && 
           'serviceWorker' in navigator && 
           'PushManager' in window;
  };

  // Convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Dummy VAPID key for demo
  const getVapidPublicKey = () => {
    return 'BLfq_tmJqMqzvQgNtqzkIq7J6jLkqQl0rVpXxYyZzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
  };

  // Create service worker content
  const createServiceWorker = () => {
    const swCode = `
      self.addEventListener('install', (event) => {
        console.log('Service Worker installed');
        self.skipWaiting();
      });

      self.addEventListener('activate', (event) => {
        console.log('Service Worker activated');
        event.waitUntil(clients.claim());
      });

      self.addEventListener('push', (event) => {
        let data = {};
        if (event.data) {
          try {
            data = event.data.json();
          } catch (e) {
            data = {
              title: 'Nouvelle Offre!',
              body: event.data.text()
            };
          }
        }

        const options = {
          body: data.body || 'Découvrez nos dernières offres!',
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          vibrate: [200, 100, 200],
          data: {
            url: data.url || '/',
            timestamp: Date.now()
          },
          actions: [
            {
              action: 'view',
              title: 'Voir'
            },
            {
              action: 'close',
              title: 'Fermer'
            }
          ]
        };

        event.waitUntil(
          self.registration.showNotification(data.title || '🎉 Nouvelle Offre!', options)
        );
      });

      self.addEventListener('notificationclick', (event) => {
        event.notification.close();
        event.waitUntil(clients.openWindow('/'));
      });
    `;

    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    return swUrl;
  };

  // Register service worker
  const registerServiceWorker = async () => {
    try {
      const swUrl = createServiceWorker();
      const registration = await navigator.serviceWorker.register(swUrl);
      console.log('Service Worker registered:', registration);
      URL.revokeObjectURL(swUrl);
      setServiceWorkerReady(true);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  };

  // Activate notifications
  const activateNotifications = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setMessage('✅ Permission accordée! Configuration en cours...');
        
        await registerServiceWorker();
        
        const registration = await navigator.serviceWorker.ready;
        const vapidKey = getVapidPublicKey();
        const convertedKey = urlBase64ToUint8Array(vapidKey);
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey
        });
        
        setIsSubscribed(true);
        setMessage('✅ Notifications activées avec succès!');
        
        localStorage.setItem('push_enabled', 'true');
        localStorage.setItem('push_subscription', JSON.stringify({
          endpoint: subscription.endpoint
        }));
        
        setTimeout(() => setMessage(''), 3000);
        
      } else if (result === 'denied') {
        setMessage('❌ Permission refusée. Activez dans les paramètres du navigateur');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('⚠️ Permission non accordée');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (error) {
      console.error('Error activating:', error);
      setMessage('❌ Erreur: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Test notification
  const testNotification = () => {
    if (Notification.permission !== 'granted') {
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
        vibrate: [200, 100, 200],
        data: {
          url: '/offers',
          offerId: 123
        }
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
      setMessage('❌ Erreur: ' + error.message);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Send multiple test notifications
  const testMultipleNotifications = () => {
    if (Notification.permission !== 'granted') {
      setMessage('❌ Activez d\'abord les notifications');
      return;
    }
    
    const offers = [
      { title: '🔥 Flash Sale!', body: '-30% sur tous les microscopes - 24h seulement!' },
      { title: '🚚 Livraison Gratuite', body: 'Pour toute commande > 1000 MAD' },
      { title: '💎 Offre PRO', body: '-20% supplémentaire pour les pros' },
      { title: '🎁 Nouveau Produit', body: 'Découvrez notre nouvelle centrifugeuse' }
    ];
    
    setMessage(`📨 Envoi de ${offers.length} offres...`);
    
    offers.forEach((offer, index) => {
      setTimeout(() => {
        new Notification(offer.title, {
          body: offer.body,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: `offer-${index}`
        });
        
        if (index === offers.length - 1) {
          setMessage(`✅ ${offers.length} offres envoyées!`);
          setTimeout(() => setMessage(''), 2000);
        }
      }, index * 2000);
    });
  };

  // Disable notifications
  const disableNotifications = async () => {
    setLoading(true);
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
      }
      
      setIsSubscribed(false);
      localStorage.removeItem('push_enabled');
      localStorage.removeItem('push_subscription');
      setMessage('🔕 Notifications désactivées');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error disabling:', error);
      setMessage('❌ Erreur lors de la désactivation');
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
    if (wasClosed === 'true') {
      setShowDemo(false);
    }
    
    const checkStatus = async () => {
      if (!isPushSupported()) return;
      
      setPermission(Notification.permission);
      
      if (Notification.permission === 'granted') {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          if (registrations.length === 0) {
            await registerServiceWorker();
          }
          
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
          
          if (subscription) {
            localStorage.setItem('push_enabled', 'true');
          }
        } catch (error) {
          console.error('Error checking status:', error);
        }
      }
    };
    
    checkStatus();
  }, []);

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

  // If not supported
  if (!isPushSupported()) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'white',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '280px',
        zIndex: 9999
      }}>
        <button onClick={closeDemo} style={{ float: 'right', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>×</button>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Notifications non supportées</div>
        <div style={{ fontSize: '12px', color: '#666' }}>Utilisez Chrome, Firefox ou Edge</div>
      </div>
    );
  }

  // Get position style
  const getPositionStyle = () => {
    if (position.x !== null && position.y !== null) {
      return {
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 9999,
        maxWidth: '340px'
      };
    }
    return {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '340px'
    };
  };

  return (
    <div ref={dragRef} style={getPositionStyle()}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        padding: '20px',
        animation: 'slideIn 0.3s ease',
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
          <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Notifications Offres</h3>
        </div>

        {/* Permission Status */}
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

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {permission !== 'granted' ? (
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
              {loading ? '⏳ Activation...' : '🔔 Activer les notifications'}
            </button>
          ) : (
            <>
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
            </>
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
            animation: 'fadeOut 4s forwards'
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
          <div>💡 Astuce: Cliquez et glissez la barre grise pour déplacer</div>
          <div style={{ marginTop: '4px' }}>Fermez l'onglet après test - la notification arrive quand même!</div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
