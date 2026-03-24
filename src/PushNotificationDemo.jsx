// src/components/PushNotificationDemo.jsx
import React, { useState, useEffect } from 'react';

const PushNotificationDemo = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastOffer, setLastOffer] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: null, y: null });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragRef = React.useRef(null);

  // Load saved position
  useEffect(() => {
    const saved = localStorage.getItem('notification_demo_pos');
    if (saved) {
      try {
        const pos = JSON.parse(saved);
        setPosition(pos);
      } catch(e) {}
    }
  }, []);

  // Handle drag
  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - (position.x || 0),
        y: e.clientY - (position.y || 0)
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      const maxX = window.innerWidth - (dragRef.current?.offsetWidth || 320);
      const maxY = window.innerHeight - (dragRef.current?.offsetHeight || 400);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (position.x !== null && position.y !== null) {
        localStorage.setItem('notification_demo_pos', JSON.stringify(position));
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Show notification - Simple and guaranteed to work
  const showOffer = (title, message, link = '/') => {
    // Create a modal notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 16px;
      z-index: 100000;
      animation: slideDown 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      cursor: pointer;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; gap: 12px; align-items: center;">
        <div style="font-size: 28px;">🎉</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; color: white; margin-bottom: 4px;">${title}</div>
          <div style="color: rgba(255,255,255,0.9); font-size: 13px;">${message}</div>
        </div>
        <button id="close-notif" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 18px;">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('#close-notif');
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      notification.remove();
    };
    
    // Click to open offer
    notification.onclick = (e) => {
      if (e.target !== closeBtn) {
        window.location.href = link;
      }
    };
    
    // Auto close after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
    
    setLastOffer({ title, message });
  };

  // Test offers
  const offers = [
    { title: '🎉 Offre Spéciale!', message: '-20% sur tous les microscopes' },
    { title: '🔥 Flash Sale!', message: '-30% sur les centrifugeuses - 24h' },
    { title: '🚚 Livraison Gratuite', message: 'Pour toute commande > 1000 MAD' },
    { title: '💎 Offre PRO', message: '-20% pour les professionnels' },
    { title: '🎁 Nouveauté', message: 'Nouvelle centrifugeuse disponible' }
  ];

  const sendOffer = () => {
    const random = offers[Math.floor(Math.random() * offers.length)];
    showOffer(random.title, random.message, '/offers');
  };

  const sendAllOffers = () => {
    offers.forEach((offer, index) => {
      setTimeout(() => {
        showOffer(offer.title, offer.message, '/offers');
      }, index * 2000);
    });
  };

  const closePanel = () => {
    setIsVisible(false);
    localStorage.setItem('notification_panel_closed', 'true');
  };

  const reopenPanel = () => {
    setIsVisible(true);
    localStorage.removeItem('notification_panel_closed');
  };

  // Check if panel was closed
  useEffect(() => {
    const wasClosed = localStorage.getItem('notification_panel_closed');
    if (wasClosed === 'true') {
      setIsVisible(false);
    }
    
    // Add animations
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
        zIndex: 9999
      };
    }
    return {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999
    };
  };

  // If panel is closed, show reopen button
  if (!isVisible) {
    return (
      <button
        onClick={reopenPanel}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: '#6d9eeb',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        🔔
      </button>
    );
  }

  return (
    <div 
      ref={dragRef}
      style={{
        ...getPositionStyle(),
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        width: '280px',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Drag Handle */}
      <div 
        className="drag-handle"
        onMouseDown={handleMouseDown}
        style={{
          background: '#f5f5f5',
          padding: '12px',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          cursor: 'grab',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
          🔔 Offres
        </span>
        <button
          onClick={closePanel}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#999',
            padding: '0 4px'
          }}
        >
          ×
        </button>
      </div>
      
      {/* Content */}
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '12px', fontSize: '13px', color: '#666', textAlign: 'center' }}>
          Recevez les meilleures offres
        </div>
        
        <button
          onClick={sendOffer}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '8px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          🎁 Tester une offre
        </button>
        
        <button
          onClick={sendAllOffers}
          style={{
            width: '100%',
            padding: '10px',
            background: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          📦 Envoyer 5 offres
        </button>
        
        {lastOffer && (
          <div style={{
            marginTop: '12px',
            padding: '8px',
            background: '#f0f0f0',
            borderRadius: '6px',
            fontSize: '11px',
            textAlign: 'center'
          }}>
            Dernière: {lastOffer.title}
          </div>
        )}
        
        <div style={{
          marginTop: '12px',
          fontSize: '10px',
          color: '#999',
          textAlign: 'center',
          borderTop: '1px solid #eee',
          paddingTop: '8px'
        }}>
          💡 Glissez la barre grise pour déplacer
        </div>
      </div>
    </div>
  );
};

export default PushNotificationDemo;
