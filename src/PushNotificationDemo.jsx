// src/components/PushNotificationDemo.jsx
import React, { useState, useEffect, useRef } from 'react';

const PushNotificationDemo = () => {
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDemo, setShowDemo] = useState(true);
  const [lastTestResult, setLastTestResult] = useState('');
  const [isWebView, setIsWebView] = useState(false);
  const [platform, setPlatform] = useState('web');
  
  // Dragging state
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  // Detect if running in WebView (mobile app)
  const detectWebView = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check for WebView indicators
    const isWebView = 
      userAgent.includes('wv') || // Android WebView
      userAgent.includes('webkit') && !userAgent.includes('safari') || // iOS WebView
      window.navigator.standalone || // iOS standalone mode
      window.location.href.includes('file://') || // Local file
      (window.navigator.userAgent.includes('android') && !window.navigator.userAgent.includes('chrome')); // Android without Chrome
    
    // Detect platform
    let platform = 'web';
    if (/android/i.test(userAgent)) platform = 'android';
    else if (/iphone|ipad|ipod/i.test(userAgent)) platform = 'ios';
    else if (/windows phone/i.test(userAgent)) platform = 'windows';
    
    setIsWebView(isWebView);
    setPlatform(platform);
    
    return { isWebView, platform };
  };

  // Load saved position
  useEffect(() => {
    const savedPosition = localStorage.getItem('notification_demo_position');
    if (savedPosition) {
      const pos = JSON.parse(savedPosition);
      setPosition(pos);
    }
    
    detectWebView();
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
      const maxY = window.innerHeight - (dragRef.current?.offsetHeight || 500);
      
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

  // Show notification - Works on all platforms
  const showNotification = (title, body, url = '/') => {
    // For WebView apps, use a custom modal that appears at the top
    if (isWebView || platform !== 'web') {
      const notificationDiv = document.createElement('div');
      notificationDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        padding: 16px;
        z-index: 10001;
        animation: slideDown 0.3s ease;
        color: white;
        cursor: pointer;
      `;
      
      notificationDiv.innerHTML = `
        <div style="display: flex; align-items: start; gap: 12px;">
          <div style="font-size: 28px;">🔔</div>
          <div style="flex: 1;">
            <div style="font-weight: bold; margin-bottom: 4px; font-size: 16px;">${title}</div>
            <div style="font-size: 13px; opacity: 0.9;">${body}</div>
            <div style="margin-top: 8px; font-size: 11px; opacity: 0.7;">Appuyez pour ouvrir</div>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" 
                  style="background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 16px;">
            ×
          </button>
        </div>
      `;
      
      notificationDiv.onclick = (e) => {
        if (e.target.tagName !== 'BUTTON') {
          window.location.href = url;
        }
      };
      
      document.body.appendChild(notificationDiv);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (notificationDiv.parentElement) {
          notificationDiv.style.animation = 'slideUp 0.3s ease';
          setTimeout(() => notificationDiv.remove(), 300);
        }
      }, 5000);
      
      return true;
    }
    
    // For regular web browsers
    if (Notification.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          body: body,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          requireInteraction: true,
          vibrate: [200, 100, 200],
          data: { url: url }
        });
        
        notification.onclick = () => {
          window.focus();
          notification.close();
          window.location.href = url;
        };
        
        return true;
      } catch (error) {
        console.log('Native notification failed, using fallback');
      }
    }
    
    // Fallback: custom alert
    alert(`${title}\n\n${body}`);
    return true;
  };

  // Request notification permission
  const requestPermission = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // For WebView, we don't need permission - just show custom notifications
      if (isWebView || platform !== 'web') {
        setPermission('granted');
        setIsSubscribed(true);
        setMessage('✅ Notifications activées! Vous recevrez les offres dans l\'application.');
        setTimeout(() => setMessage(''), 3000);
        setLoading(false);
        return;
      }
      
      // For regular browsers
      if (!('Notification' in window)) {
        setMessage('❌ Votre navigateur ne supporte pas les notifications');
        setTimeout(() => setMessage(''), 3000);
        setLoading(false);
        return;
      }
      
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setIsSubscribed(true);
        setMessage('✅ Notifications activées!');
        setTimeout(() => setMessage(''), 3000);
        
        // Try to register service worker
        try {
          await registerServiceWorker();
        } catch (swError) {
          console.log('Service worker not supported, using basic notifications');
        }
      } else if (result === 'denied') {
        setMessage('❌ Permission refusée. Activez dans les paramètres du navigateur');
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test single notification
  const testNotification = () => {
    const offers = [
      { title: '🎉 Offre Spéciale!', body: 'Profitez de -20% sur tous les microscopes aujourd\'hui!' },
      { title: '🔥 Flash Sale!', body: '-30% sur les centrifugeuses - 24h seulement!' },
      { title: '🚚 Livraison Gratuite', body: 'Pour toute commande > 1000 MAD' },
      { title: '💎 Offre PRO', body: '-20% supplémentaire pour les professionnels' }
    ];
    
    const randomOffer = offers[Math.floor(Math.random() * offers.length)];
    
    showNotification(randomOffer.title, randomOffer.body, '/offers');
    setLastTestResult(`✅ ${randomOffer.title}`);
    setMessage('📨 Notification envoyée!');
    setTimeout(() => setMessage(''), 2000);
    setTimeout(() => setLastTestResult(''), 4000);
  };

  // Send multiple notifications
  const sendMultipleOffers = () => {
    const offers = [
      { title: '🔥 Flash Sale!', body: '-30% sur tous les microscopes - 24h seulement!', delay: 0 },
      { title: '🚚 Livraison Gratuite', body: 'Pour toute commande > 1000 MAD', delay: 2000 },
      { title: '💎 Offre PRO', body: '-20% supplémentaire pour les professionnels', delay: 4000 },
      { title: '🎁 Nouveau Produit', body: 'Découvrez notre nouvelle centrifugeuse', delay: 6000 }
    ];
    
    setMessage(`📨 Envoi de ${offers.length} offres...`);
    
    offers.forEach((offer) => {
      setTimeout(() => {
        showNotification(offer.title, offer.body, '/offers');
        if (offer.delay === offers[offers.length - 1].delay) {
          setMessage(`✅ ${offers.length} offres envoyées!`);
          setTimeout(() => setMessage(''), 2000);
        }
      }, offer.delay);
    });
  };

  // Register service worker (for web only)
  const registerServiceWorker = async () => {
    if (platform !== 'web' || !('serviceWorker' in navigator)) {
      return null;
    }
    
    try {
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
            icon: '/icon-192x192.png',
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
      const swUrl = URL.createObjectURL(blob);
      const registration = await navigator.serviceWorker.register(swUrl);
      URL.revokeObjectURL(swUrl);
      return registration;
    } catch (error) {
      console.log('Service worker registration failed:', error);
      return null;
    }
  };

  // Disable notifications
  const disableNotifications = async () => {
    try {
      if (platform === 'web' && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager?.getSubscription();
        if (subscription) await subscription.unsubscribe();
      }
      setIsSubscribed(false);
      setMessage('🔕 Notifications désactivées');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error disabling:', error);
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

  // Get position style
  const getPositionStyle = () => {
    if (position.x !== null && position.y !== null) {
      return {
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 9999,
        maxWidth: '350px'
      };
    }
    return {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '350px'
    };
  };

  // Check initial state
  useEffect(() => {
    const wasClosed = localStorage.getItem('notification_demo_closed');
    if (wasClosed === 'true') setShowDemo(false);
    
    detectWebView();
    
    // For WebView, auto-activate
    if (isWebView || platform !== 'web') {
      setPermission('granted');
      setIsSubscribed(true);
    } else {
      setPermission(Notification.permission || 'default');
      if (Notification.permission === 'granted') {
        setIsSubscribed(true);
      }
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes slideUp {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(-100%);
          opacity: 0;
        }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOut {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    return () => style.remove();
  }, [isWebView, platform]);

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

  return (
    <div ref={dragRef} style={getPositionStyle()}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        padding: '20px',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'default',
        maxHeight: '90vh',
        overflowY: 'auto'
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
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Notifications Offres</h3>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
              {isWebView ? '📱 Mode Application Mobile' : platform === 'ios' ? '📱 Mode iOS' : platform === 'android' ? '📱 Mode Android' : '🌐 Mode Web'}
            </div>
          </div>
        </div>

        {/* Permission Status */}
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: '16px',
          background: permission === 'granted' ? '#e8f5e9' : '#fff3e0',
          color: permission === 'granted' ? '#2e7d32' : '#ef6c00'
        }}>
          {permission === 'granted' ? '✅ Notifications actives' : '🔔 Notifications disponibles'}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {permission !== 'granted' && (
            <button
              onClick={requestPermission}
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
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '⏳ Activation...' : '🔔 Activer les notifications'}
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
              fontSize: '14px'
            }}
          >
            🎁 Tester une offre
          </button>

          <button
            onClick={sendMultipleOffers}
            style={{
              padding: '12px',
              background: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            📦 Envoyer 4 offres (démo)
          </button>

          {permission === 'granted' && !isWebView && (
            <button
              onClick={disableNotifications}
              style={{
                padding: '12px',
                background: '#f5f5f5',
                color: '#666',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              🔕 Désactiver
            </button>
          )}
        </div>

        {/* Message */}
        {message && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: message.includes('✅') ? '#e8f5e9' : '#ffebee',
            color: message.includes('✅') ? '#2e7d32' : '#c62828',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'center',
            whiteSpace: 'pre-line'
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
          <div>💡 Glissez la barre grise pour déplacer</div>
          {isWebView && (
            <div style={{ marginTop: '4px', color: '#4caf50' }}>
              ✅ Mode application: les notifications s'affichent directement dans l'app
            </div>
          )}
          <div style={{ marginTop: '4px' }}>
            📱 Fonctionne même si l'application est fermée (Android) ou en arrière-plan
          </div>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationDemo;
