import React, { useState, useEffect, createContext, useContext, useRef,useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import api from './api';
import { favoritesApi, couponsApi } from './api';
import './App.css';
import { OptimizedImage } from './OptimizedImage';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import EmailCampaign from './EmailCampaign';
import PropTypes from 'prop-types';
// Add this at the top of App.js or in a utils file
const saveScrollPosition = (key) => {
  const scrollY = window.scrollY;
  sessionStorage.setItem(`scroll_${key}`, scrollY);
  console.log(`💾 Saved scroll position for ${key}:`, scrollY);
};

const restoreScrollPosition = (key) => {
  const savedPosition = sessionStorage.getItem(`scroll_${key}`);
  if (savedPosition) {
    setTimeout(() => {
      window.scrollTo({ top: parseInt(savedPosition), behavior: 'instant' });
      sessionStorage.removeItem(`scroll_${key}`);
      console.log(`✅ Restored scroll position for ${key}:`, parseInt(savedPosition));
    }, 100);
    return true;
  }
  return false;
};
// ==================== LOGIN PROMPT MODAL COMPONENT ====================
// ==================== LOGIN PROMPT MODAL COMPONENT (optionnel - amélioré) ====================
const LoginPromptModal = ({ isOpen, onClose, onConfirm, productName = null, context = 'favorites' }) => {
  // Don't render anything if modal is not open
  if (!isOpen) return null;

  const getTitle = () => {
    if (context === 'favorites') return 'Ajouter aux favoris';
    return 'Ajouter au panier';
  };

  const getMessage = () => {
    if (context === 'favorites') {
      return productName 
        ? `Pour ajouter « ${productName} » à vos favoris`
        : 'Pour ajouter des produits à vos favoris';
    }
    return productName 
      ? `Pour ajouter « ${productName} » à votre panier`
      : 'Pour ajouter des articles à votre panier';
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content login-prompt-modal"
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <Icons.X size={20} />
        </button>

        <div className="modal-icon">
          <Icons.User size={48} />
        </div>

        <h3 className="modal-title">Connexion requise</h3>

        <div className="modal-message">
          <p>
            {getMessage()}, 
            vous devez d'abord vous connecter à votre compte.
          </p>
        </div>

        <div className="modal-options">
          <p className="modal-option-text">
            <Icons.Check size={16} /> 
            <span>Conservez vos articles pour plus tard</span>
          </p>
          <p className="modal-option-text">
            <Icons.Check size={16} /> 
            <span>Bénéficiez de vos prix personnalisés</span>
          </p>
          <p className="modal-option-text">
            <Icons.Check size={16} /> 
            <span>Accédez à vos coupons et réductions</span>
          </p>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Continuer sans compte
          </button>
          <button className="btn-primary" onClick={onConfirm}>
            Se connecter
          </button>
        </div>

        <p className="modal-footer-text">
          Pas encore de compte ? 
          <button 
            className="register-link"
            onClick={() => {
              onClose();
              // Rediriger vers la page d'inscription
              window.location.href = '/register';
            }}
          >
            Créer un compte
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};
// ==================== ICON COMPONENTS ====================
// ==================== ICON COMPONENTS COMPLET ====================
const Icons = {
  // Icônes de base
  Mail: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  
  Home: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  
  Package: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  
  Users: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  
  Phone: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  
  Heart: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  
  ShoppingBag: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  
  User: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  
  Search: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  
  Menu: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  
  X: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  
  ChevronLeft: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  
  ChevronRight: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  
  Eye: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  
  Star: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  
  Truck: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  
  Plus: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  
  Minus: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  
  Check: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  
  Trash: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  
  LogOut: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  
  Percent: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  ),
  
  ArrowUp: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  ),
  
  Filter: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
    </svg>
  ),
  
  WhatsApp: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  
  Share2: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  ),
  
  RefreshCw: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  
  Shield: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  
  // === NOUVELLES ICÔNES AJOUTÉES POUR LE MODAL ===
  Info: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  ),
  
  Image: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  
  ExternalLink: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  
  // === ICÔNES SUPPLÉMENTAIRES UTILES ===
  AlertCircle: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </svg>
  ),
  
  CheckCircle: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  
  Settings: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62zM16.5 6.5l-4-4-4 4" />
    </svg>
  ),
  
  Download: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  
  Upload: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  
  CreditCard: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  
  Clock: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  
  Calendar: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  
  MapPin: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  
  Zap: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
};
// ==================== ANIMATION VARIANTS ====================
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// ==================== FAVORITES CONTEXT ====================
const FavoritesContext = createContext();
const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};

// ==================== CONTEXTS ====================

// Auth Context
const AuthContext = createContext();
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Cart Context
const CartContext = createContext();
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

// Product Context
const ProductContext = createContext();
const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};

// Coupon Context
const CouponContext = createContext();
const useCoupons = () => {
  const context = useContext(CouponContext);
  if (!context) throw new Error('useCoupons must be used within CouponProvider');
  return context;
};

// ==================== AUTH PROVIDER ====================
const AuthProvider = ({ children }) => {
  // Load user synchronously from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user:', e);
        return null;
      }
    }
    return null;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success && response.data.data) {
        const { token, customer } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(customer));
        
        setUser(customer);
        
        // Merge guest cart if exists
        try {
          const guestSessionId = localStorage.getItem('guest_cart_session');
          if (guestSessionId) {
            await api.post('/cart/merge', { session_id: guestSessionId });
            localStorage.removeItem('guest_cart_session');
          }
        } catch (mergeErr) {
          console.error('Failed to merge cart:', mergeErr);
        }
        
        return customer;
      } else {
        throw new Error(response.data.error || 'Erreur de connexion');
      }
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Erreur de connexion';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success && response.data.data) {
        const { token, customer } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(customer));
        
        setUser(customer);
        return customer;
      } else {
        throw new Error(response.data.error || "Erreur d'inscription");
      }
    } catch (err) {
      const message = err.response?.data?.error || err.message || "Erreur d'inscription";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.success && response.data.data) {
        const updatedUser = response.data.data.customer || response.data.data;
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return updatedUser;
      } else {
        throw new Error(response.data.error || 'Erreur de mise à jour');
      }
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Erreur de mise à jour';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      const response = await api.post('/resend-verification');
      return response.data;
    } catch (err) {
      console.error('Failed to resend verification:', err);
      throw err;
    }
  };

  const checkVerification = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success && response.data.data) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
    } catch (err) {
      console.error('Failed to check verification:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    resendVerification,
    checkVerification,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPro: user?.tier === 'pro',
    proDiscount: user?.pro_discount || 0,
    companyName: user?.company_name,
    isEmailVerified: user?.email_verified_at !== null,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ==================== FAVORITES PROVIDER ====================
// ==================== FAVORITES PROVIDER CORRIGÉ ====================
const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await api.get('/favorites');
      if (response.data.success && response.data.data) {
        const favoritesData = response.data.data.data || response.data.data || [];
        setFavorites(favoritesData);
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId) => {
    if (!isAuthenticated) {
      // ✅ Utiliser le modal au lieu de alert()
      setPendingProductId(productId);
      setShowLoginModal(true);
      return false;
    }

    try {
      const response = await api.post(`/favorites/${productId}`);
      if (response.data.success) {
        await fetchFavorites();
        return true;
      }
    } catch (err) {
      console.error('Failed to add to favorites:', err);
      alert('Erreur lors de l\'ajout aux favoris');
    }
    return false;
  };

  const removeFromFavorites = async (productId) => {
    try {
      const response = await api.delete(`/favorites/${productId}`);
      if (response.data.success) {
        setFavorites(prev => prev.filter(p => p.id !== productId));
        return true;
      }
    } catch (err) {
      console.error('Failed to remove from favorites:', err);
      alert('Erreur lors du retrait des favoris');
    }
    return false;
  };

  const toggleFavorite = async (productId, isFavorite) => {
    if (isFavorite) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  };

  const checkIsFavorite = (productId) => {
    return favorites.some(p => p.id === productId);
  };

  const favoritesCount = favorites.length;

  const handleLoginConfirm = () => {
    if (pendingProductId) {
      // Sauvegarder l'intention d'ajouter aux favoris après connexion
      localStorage.setItem('pending_favorite', pendingProductId);
    }
    setShowLoginModal(false);
    navigate('/login');
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    setPendingProductId(null);
  };

  const value = {
    favorites,
    loading,
    favoritesCount,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    checkIsFavorite,
    refreshFavorites: fetchFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      <LoginPromptModal 
        isOpen={showLoginModal}
        onClose={handleModalClose}
        onConfirm={handleLoginConfirm}
        productName={pendingProductId ? "ce produit" : null}
      />
    </FavoritesContext.Provider>
  );
};

// ==================== CART PROVIDER ====================
// ==================== CART PROVIDER (déjà correct) ====================
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const { isAuthenticated } = useAuth();
  
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('guest_cart_session') || '';
  });

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('guest_cart_session', sessionId);
    }
  }, [sessionId]);

  const getHeaders = () => {
    const headers = {};
    if (!isAuthenticated && sessionId) {
      headers['X-Cart-Session'] = sessionId;
    }
    return headers;
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cart', { headers: getHeaders() });
      
      if (response.data?.success) {
        const cartData = response.data.data || {};
        setCartItems(cartData.items || []);
        setCartTotal(cartData.total || 0);
        setCartCount(cartData.count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1, navigate) => {
    if (!isAuthenticated) {
      setPendingProduct({ product, quantity });
      setShowLoginModal(true);
      return false;
    }

    try {
      const response = await api.post('/cart/add', {
        product_id: product.id,
        quantity
      }, { headers: getHeaders() });
      
      if (response.data?.success) {
        const cartData = response.data.data || {};
        setCartItems(cartData.items || []);
        setCartTotal(cartData.total || 0);
        setCartCount(cartData.count || 0);
        
        alert('Produit ajouté au panier !');
        
        localStorage.removeItem('pending_cart_item');
        return true;
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Erreur lors de l\'ajout au panier');
    }
    return false;
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const item = cartItems.find(i => i.id === itemId);
      if (!item?.cart_item_id) return;
      
      const response = await api.put('/cart/update', {
        cart_item_id: item.cart_item_id,
        quantity: newQuantity
      }, { headers: getHeaders() });
      
      if (response.data?.success) {
        const cartData = response.data.data || {};
        setCartItems(cartData.items || []);
        setCartTotal(cartData.total || 0);
        setCartCount(cartData.count || 0);
      }
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const item = cartItems.find(i => i.id === itemId);
      if (!item?.cart_item_id) return;
      
      const response = await api.delete('/cart/remove', {
        headers: getHeaders(),
        data: { cart_item_id: item.cart_item_id }
      });
      
      if (response.data?.success) {
        const cartData = response.data.data || {};
        setCartItems(cartData.items || []);
        setCartTotal(cartData.total || 0);
        setCartCount(cartData.count || 0);
      }
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.delete('/cart/clear', { headers: getHeaders() });
      
      if (response.data?.success) {
        setCartItems([]);
        setCartTotal(0);
        setCartCount(0);
      }
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const handleLoginConfirm = (navigate) => {
    if (pendingProduct) {
      localStorage.setItem('pending_cart_item', JSON.stringify({
        product_id: pendingProduct.product.id,
        quantity: pendingProduct.quantity,
        product: pendingProduct.product
      }));
    }
    setShowLoginModal(false);
    navigate('/login');
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    setPendingProduct(null);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <LoginPromptModal 
        isOpen={showLoginModal}
        onClose={handleModalClose}
        onConfirm={(navigate) => handleLoginConfirm(navigate)}
        productName={pendingProduct?.product?.name}
      />
    </CartContext.Provider>
  );
};

// ==================== PRODUCT PROVIDER ====================
// ==================== PRODUCT PROVIDER COMPLET ====================
// ==================== PRODUCT CARD WITH PRO DISCOUNT CORRIGÉ ====================

// ==================== COUPON PROVIDER ====================
const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const { isAuthenticated, user } = useAuth();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await api.get('/coupons');
      if (response.data.success && response.data.data) {
        let couponsData = response.data.data;
        
        if (isAuthenticated && user) {
          couponsData = couponsData.filter(coupon => 
            coupon.customer_id === user.id
          );
        } else {
          couponsData = [];
        }
        
        setCoupons(couponsData);
      }
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCoupons();
    } else {
      setCoupons([]);
    }
  }, [isAuthenticated, user?.id]);

  const validateCoupon = async (code, orderAmount) => {
    setLoading(true);
    try {
      const response = await api.post('/coupons/validate', {
        code,
        order_amount: orderAmount
      });
      
      if (response.data.success && response.data.data) {
        const { coupon, discount: discountAmount } = response.data.data;
        setAppliedCoupon(coupon);
        setDiscount(discountAmount);
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Invalid coupon');
      }
    } catch (err) {
      console.error('Failed to validate coupon:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const couponsCount = coupons.length;

  const value = {
    coupons,
    loading,
    couponsCount,
    appliedCoupon,
    discount,
    validateCoupon,
    removeCoupon,
    refreshCoupons: fetchCoupons
  };

  return <CouponContext.Provider value={value}>{children}</CouponContext.Provider>;
};

// ==================== COMPONENTS ====================

// Carousel Component
// ==================== OPTIMIZED CAROUSEL (No Framer Motion) ====================
const Carousel = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: 'Livraison Gratuite',
      subtitle: 'Pour toute commande > 1000DH',
      image: 'https://www.teclab.ma/storage/products/generated-image-c96cf929-90af-4249-aced-bea1c63d6f5d.png',
      bgColor: '#6d9eeb',
      textColor: '#ffffff'
    },
    {
      id: 2,
      title: 'Promotion Spéciale',
      subtitle: 'Jusqu\'à -25% sur une sélection',
      image: 'https://www.teclab.ma/storage/products/generated-image-7aeac712-54fd-49ab-a84e-62610d086010.png',
      bgColor: '#ff6b6b',
      textColor: '#ffffff'
    },
    {
      id: 3,
      title: 'Nouveaux Produits',
      subtitle: 'Découvrez notre nouvelle gamme',
      image: 'https://www.teclab.ma/storage/products/generated-image-f19f78ff-6f6e-46de-9f9d-21a88cdea097.png',
      bgColor: '#4ecdc4',
      textColor: '#ffffff'
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [offers.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    } else if (touchEndX.current - touchStartX.current > 50) {
      setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
    }
  };

  return (
    <div 
      className="carousel-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="carousel-slide"
        style={{ backgroundColor: offers[currentIndex].bgColor }}
      >
        <div className="carousel-content">
          <h2 style={{ color: offers[currentIndex].textColor }}>
            {offers[currentIndex].title}
          </h2>
          <p style={{ color: offers[currentIndex].textColor }}>
            {offers[currentIndex].subtitle}
          </p>
          <button className="carousel-btn">
            En savoir plus
          </button>
        </div>
        <div className="carousel-image">
          <img 
            src={offers[currentIndex].image} 
            alt={offers[currentIndex].title}
            loading="lazy"
          />
        </div>
      </div>
      
      {!isMobile && (
        <>
          <button className="carousel-nav carousel-prev" onClick={() => setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length)}>
            <Icons.ChevronLeft />
          </button>
          <button className="carousel-nav carousel-next" onClick={() => setCurrentIndex((prev) => (prev + 1) % offers.length)}>
            <Icons.ChevronRight />
          </button>
        </>
      )}
    </div>
  );
};
// ==================== PRODUCT PROVIDER COMPLET ====================
const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Charger les catégories et marques au montage
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // Charger les produits quand les filtres changent
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, selectedBrands, priceRange, sortBy, currentPage]);

  // Récupérer toutes les catégories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('❌ Failed to fetch categories:', err);
    }
  };

  // Récupérer toutes les marques
  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands');
      if (response.data.success && response.data.data) {
        setBrands(response.data.data);
      }
    } catch (err) {
      console.error('❌ Failed to fetch brands:', err);
    }
  };

  // Récupérer les produits avec filtres
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Ajouter tous les filtres aux paramètres
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedBrands.length > 0) params.append('brands', selectedBrands.join(','));
      params.append('min_price', priceRange.min);
      params.append('max_price', priceRange.max);
      params.append('sort_by', sortBy);
      params.append('page', currentPage);
      params.append('per_page', itemsPerPage);

      console.log('🔍 Fetching products with params:', params.toString());

      const response = await api.get(`/products?${params.toString()}`);
      
      if (response.data.success && response.data.data) {
        // Gérer différentes structures de réponse
        if (response.data.data.products) {
          // Nouvelle structure avec produits et marques
          setProducts(response.data.data.products.data || []);
          setFilteredProducts(response.data.data.products.data || []);
          setTotalProducts(response.data.data.products.total || 0);
          setTotalPages(response.data.data.products.last_page || 1);
          
          // Mettre à jour les marques si fournies
          if (response.data.data.brands) {
            setBrands(response.data.data.brands);
          }
        } else if (response.data.data.data) {
          // Structure paginée standard
          setProducts(response.data.data.data);
          setFilteredProducts(response.data.data.data);
          setTotalProducts(response.data.data.total || 0);
          setTotalPages(response.data.data.last_page || 1);
        } else {
          // Structure simple
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
          setTotalProducts(response.data.data.length || 0);
          setTotalPages(1);
        }
      }
    } catch (err) {
      console.error('❌ Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer un produit par son slug
  const getProduct = async (slug) => {
    try {
      const response = await api.get(`/products/${slug}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Product not found');
    } catch (err) {
      console.error('❌ Failed to fetch product:', err);
      throw err;
    }
  };

  // Récupérer les produits en vedette
  const getFeaturedProducts = async () => {
    try {
      const response = await api.get('/products/featured');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (err) {
      console.error('❌ Failed to fetch featured products:', err);
      return [];
    }
  };

  // Basculer la sélection d'une marque
  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
    setCurrentPage(1); // Revenir à la première page
  };

  // Sélectionner une seule marque (remplace les autres)
  const selectBrand = (brand) => {
    setSelectedBrands([brand]);
    setCurrentPage(1);
  };

  // Effacer toutes les marques sélectionnées
  const clearBrands = () => {
    setSelectedBrands([]);
    setCurrentPage(1);
  };

  // Effacer tous les filtres
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 50000 });
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Compter le nombre de filtres actifs
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory) count++;
    if (selectedBrands.length > 0) count++;
    if (priceRange.min > 0 || priceRange.max < 50000) count++;
    if (sortBy !== 'featured') count++;
    return count;
  };

  const value = {
    // Produits
    products,
    filteredProducts,
    totalProducts,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    
    // Recherche
    searchQuery,
    setSearchQuery,
    
    // Catégories
    categories,
    selectedCategory,
    setSelectedCategory,
    
    // Marques
    brands,
    selectedBrands,
    toggleBrand,
    selectBrand,
    clearBrands,
    
    // Prix
    priceRange,
    setPriceRange,
    
    // Tri
    sortBy,
    setSortBy,
    
    // Filtres
    clearFilters,
    getActiveFiltersCount,
    
    // Méthodes
    getProduct,
    getFeaturedProducts,
    refreshProducts: fetchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
// Product Card Component
// ==================== PRODUCT CARD WITH PRO DISCOUNT ====================
// ==================== PRODUCT CARD WITH PRO DISCOUNT CORRIGÉ ====================
// ==================== OPTIMIZED PRODUCT CARD (No Framer Motion) ====================
// ==================== OPTIMIZED PRODUCT CARD (No lag) ====================
const ProductCard = React.memo(({ product, onAddToCart, onViewDetails, onToggleFavorite, isFavorite }) => {
  const [added, setAdded] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const navigate = useNavigate();
  const { isPro, proDiscount } = useAuth();

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    
    if (!isMobile) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: '100px', threshold: 0.01 }
      );
      
      if (ref.current) {
        observer.observe(ref.current);
      }
      return () => observer.disconnect();
    } else {
      setIsInView(true);
    }
  }, [isMobile]);

  const getDisplayPrice = () => {
    if (isPro && proDiscount > 0 && product.original_price) {
      return product.price;
    }
    return product.price;
  };

  const getOriginalPrice = () => {
    if (isPro && proDiscount > 0 && product.original_price) {
      return product.original_price;
    }
    return null;
  };

  const displayPrice = getDisplayPrice();
  const originalPrice = getOriginalPrice();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart && product) {
      const productToAdd = {
        ...product,
        price: displayPrice,
        original_price: originalPrice
      };
      onAddToCart(productToAdd, 1, navigate);
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (favoriteLoading || !onToggleFavorite || !product) return;
    
    setFavoriteLoading(true);
    try {
      await onToggleFavorite(product.id, isFavorite, product.name);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onViewDetails && product) {
      onViewDetails(product);
    }
  };

  if (!product) return null;

  return (
    <div 
      ref={ref}
      className="product-card"
      style={{
        opacity: isInView ? 1 : 0,
        transition: 'opacity 0.2s ease'
      }}
      onClick={handleViewDetails}
    >
      <div className="product-image-container">
        {isInView && (
          <OptimizedImage 
            src={product.image || '/placeholder.jpg'} 
            alt={product.name || 'Product'} 
            className="product-image"
          />
        )}
        
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}
        
        {isPro && proDiscount > 0 && product.original_price && (
          <span className="product-discount pro-discount">
            -{proDiscount}% PRO
          </span>
        )}
        
        {!isPro && product.original_price && (
          <span className="product-discount">
            -{Math.round((1 - product.price / product.original_price) * 100)}%
          </span>
        )}

        <div className="product-actions">
          <button 
            className="action-btn" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <Icons.ShoppingBag />
          </button>
          <button 
            className="action-btn"
            onClick={handleViewDetails}
          >
            <Icons.Eye />
          </button>
          <button 
            className={`action-btn ${isFavorite ? 'favorite active' : ''}`}
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
          >
            <Icons.Heart className={favoriteLoading ? 'loading' : ''} />
          </button>
        </div>

        {added && (
          <div className="added-animation">
            <Icons.Check />
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}>★</span>
          ))}
          <span className="rating-count">({product.reviews_count || 0})</span>
        </div>

        <div className="product-price">
          <span className={`current-price ${isPro ? 'pro-price' : ''}`}>
            {displayPrice} MAD
          </span>
          {originalPrice && (
            <span className="original-price">{originalPrice} MAD</span>
          )}
        </div>

        {isPro && proDiscount > 0 && (
          <div className="pro-badge-container">
            <span className="pro-badge-small">
              <Icons.Percent size={10} /> PRIX PRO -{proDiscount}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
});
// ==================== RATING COMPONENTS ====================

// Review Star Display Component
const ReviewStars = ({ rating, size = 16, showCount = false, count = 0 }) => {
  return (
    <div className="star-rating">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`star ${star <= Math.round(rating) ? 'filled' : ''}`}
            style={{ fontSize: size }}
          >
            ★
          </span>
        ))}
      </div>
      {showCount && (
        <span className="rating-count">({count} avis)</span>
      )}
    </div>
  );
};

// Star Rating Input Component
const StarRatingInput = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= (hover || value) ? 'active' : ''}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ productId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Veuillez donner une note');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit({
        product_id: productId,
        rating,
        title,
        review,
        images
      });
      
      setRating(0);
      setTitle('');
      setReview('');
      setImages([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="review-form login-required">
        <p>Connectez-vous pour laisser un avis</p>
        <button className="btn-primary" onClick={() => window.location.href = '/login'}>
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Donnez votre avis</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>Note <span className="required">*</span></label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div className="form-group">
        <label>Titre de l'avis</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Synthétisez votre avis"
          maxLength="100"
        />
      </div>

      <div className="form-group">
        <label>Votre avis</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="4"
          placeholder="Partagez votre expérience avec ce produit..."
          maxLength="1000"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Envoi...' : 'Publier mon avis'}
        </button>
      </div>
    </form>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.customer?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h4>{review.customer?.name || 'Anonyme'}</h4>
            <div className="review-meta">
              <ReviewStars rating={review.rating} size={14} />
              <span className="review-date">
                {new Date(review.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
        {review.verified_purchase && (
          <span className="verified-badge">
            <Icons.Check size={14} /> Achat vérifié
          </span>
        )}
      </div>

      {review.title && <h5 className="review-title">{review.title}</h5>}
      
      <div className={`review-content ${expanded ? 'expanded' : ''}`}>
        <p>{review.review}</p>
      </div>
      
      {review.review && review.review.length > 300 && (
        <button className="read-more-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Lire moins' : 'Lire plus'}
        </button>
      )}

      {review.images && review.images.length > 0 && (
        <div className="review-images">
          {review.images.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`Review ${index + 1}`}
              className="review-image"
              onClick={() => window.open(img, '_blank')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Reviews Summary Component
// ==================== REVIEWS SUMMARY COMPONENT ====================
const ReviewsSummary = ({ stats }) => {
  // Sécurité : si stats n'existe pas
  if (!stats) {
    return (
      <div className="reviews-summary">
        <div className="summary-main">
          <div className="average-rating">
            <span className="rating-number">0.0</span>
            <span className="rating-max">/5</span>
          </div>
          <ReviewStars rating={0} size={20} />
          <div className="total-reviews">0 avis</div>
        </div>
        <div className="rating-distribution">
          {[5,4,3,2,1].map(stars => (
            <div key={stars} className="distribution-row">
              <span className="stars-label">{stars} étoiles</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }} />
              </div>
              <span className="count-label">0</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Récupérer et valider les données
  const totalReviews = typeof stats.total === 'number' ? stats.total : parseInt(stats.total) || 0;
  
  // Gérer average qui peut être string ou number
  let averageRating = 0;
  if (stats.average !== undefined && stats.average !== null) {
    if (typeof stats.average === 'number') {
      averageRating = stats.average;
    } else if (typeof stats.average === 'string') {
      averageRating = parseFloat(stats.average) || 0;
    }
  }
  
  // S'assurer que la distribution est un tableau de 5 nombres
  let distribution = [0, 0, 0, 0, 0];
  if (Array.isArray(stats.distribution) && stats.distribution.length === 5) {
    distribution = stats.distribution.map(val => typeof val === 'number' ? val : parseInt(val) || 0);
  }

  console.log('📊 Stats après validation:', { totalReviews, averageRating, distribution });

  return (
    <div className="reviews-summary">
      <div className="summary-main">
        <div className="average-rating">
          <span className="rating-number">{averageRating.toFixed(1)}</span>
          <span className="rating-max">/5</span>
        </div>
        <ReviewStars rating={averageRating} size={20} />
        <div className="total-reviews">
          {totalReviews} avis client{totalReviews > 1 ? 's' : ''}
        </div>
      </div>

      <div className="rating-distribution">
        {[5, 4, 3, 2, 1].map((stars) => {
          const index = 5 - stars;
          const count = distribution[index] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={stars} className="distribution-row">
              <span className="stars-label">{stars} étoile{stars > 1 ? 's' : ''}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="count-label">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Reviews Section Component
const ReviewsSection = ({ productId, product }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [productId, page, sortBy]);

  // Dans ReviewsSection, remplacez le fetchReviews par :

const fetchReviews = async () => {
  setLoading(true);
  try {
    const response = await api.get(`/products/${productId}/reviews`, {
      params: { page, sort: sortBy }
    });
    
    console.log('API Response:', response.data);
    
    if (response.data.success) {
      // Vérifier si on est en mode debug
      if (response.data.debug) {
        // Mode debug : utiliser les données de debug
        console.log('📋 Using debug data');
        const debugReviews = response.data.debug.all_reviews_raw || [];
        
        // Formater les reviews du debug
        const formattedReviews = debugReviews.map(review => ({
          id: review.id,
          rating: review.rating,
          title: review.title,
          review: review.review,
          images: JSON.parse(review.images || '[]'),
          verified_purchase: review.verified_purchase === 1,
          created_at: review.created_at,
          customer: {
            name: review.customer_name,
            email: review.customer_email
          }
        }));
        
        setReviews(formattedReviews);
        
        // Utiliser les stats du debug ou calculer
        setStats({
          total: formattedReviews.length,
          average: formattedReviews.length > 0 
            ? (formattedReviews.reduce((acc, r) => acc + r.rating, 0) / formattedReviews.length).toFixed(1)
            : 0,
          distribution: [0,0,0,0,0] // À calculer si nécessaire
        });
        
      } else {
        // Mode normal : utiliser data.data
        setReviews(response.data.data.data || []);
        setStats(response.data.data.stats);
      }
      
      setHasMore(false); // Temporairement
    }
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
  } finally {
    setLoading(false);
  }
};
  const handleSubmitReview = async (reviewData) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, reviewData);
      
      if (response.data.success) {
        setShowForm(false);
        setPage(1);
        fetchReviews();
        alert('Merci pour votre avis ! Il sera publié après modération.');
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      throw err;
    }
  };

  const checkCanReview = () => {
    if (!user) return false;
    return true;
  };

  const canReview = checkCanReview();

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>Avis clients</h2>
        {canReview && !showForm && (
          <button 
            className="btn-primary write-review-btn"
            onClick={() => setShowForm(true)}
          >
            <Icons.Star size={16} /> Écrire un avis
          </button>
        )}
      </div>

      {stats && <ReviewsSummary stats={stats} />}

      {showForm && (
        <ReviewForm 
          productId={productId}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="reviews-toolbar">
        <select 
          value={sortBy} 
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="sort-select"
        >
          <option value="recent">Plus récents</option>
          <option value="helpful">Les plus utiles</option>
          <option value="highest">Notes les plus élevées</option>
          <option value="lowest">Notes les plus faibles</option>
        </select>
      </div>

      {loading && page === 1 ? (
        <div className="loading-spinner">Chargement des avis...</div>
      ) : (
        <>
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <Icons.Star size={48} />
                <p>Aucun avis pour le moment</p>
                {canReview && (
                  <button 
                    className="btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    Soyez le premier à donner votre avis
                  </button>
                )}
              </div>
            ) : (
              reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>

          {hasMore && (
            <div className="load-more">
              <button 
                className="btn-secondary"
                onClick={() => setPage(p => p + 1)}
                disabled={loading}
              >
                {loading ? 'Chargement...' : 'Voir plus d\'avis'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ==================== WISHLIST PAGE ====================
// ==================== FIXED WISHLIST PAGE (No scroll to top) ====================
// ==================== COMPLETE FIXED WISHLIST PAGE ====================
// ==================== COMPLETE FIXED WISHLIST PAGE ====================
// ==================== FIXED WISHLIST PAGE WITH DATA CACHING ====================
const WishlistPage = ({ navigate }) => {
  const { favorites, loading, removeFromFavorites, refreshFavorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isPro, proDiscount } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [hasRestored, setHasRestored] = useState(false);
  const [cachedFavorites, setCachedFavorites] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cache favorites when loaded
  useEffect(() => {
    if (favorites.length > 0 && !isInitialLoad) {
      sessionStorage.setItem('cached_wishlist', JSON.stringify(favorites));
      setCachedFavorites(favorites);
    }
  }, [favorites, isInitialLoad]);

  // Load cached data on mount
  useEffect(() => {
    const cached = sessionStorage.getItem('cached_wishlist');
    if (cached && favorites.length === 0 && !loading) {
      const parsed = JSON.parse(cached);
      setCachedFavorites(parsed);
      // Filter the cached data
      const filtered = parsed.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFavorites(filtered);
    }
    setIsInitialLoad(false);
  }, []);

  // Filter favorites by search term (use cached if available)
  useEffect(() => {
    const dataToFilter = favorites.length > 0 ? favorites : cachedFavorites;
    if (dataToFilter.length > 0) {
      const filtered = dataToFilter.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFavorites(filtered);
      setCurrentPage(1);
    } else {
      setFilteredFavorites([]);
    }
  }, [favorites, cachedFavorites, searchTerm]);

  // RESTORE SCROLL POSITION WHEN COMPONENT MOUNTS
  useEffect(() => {
    if (!hasRestored && !loading) {
      const savedPosition = sessionStorage.getItem('scroll_wishlist');
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedPosition), behavior: 'instant' });
          sessionStorage.removeItem('scroll_wishlist');
        }, 150);
      }
      setHasRestored(true);
    }
  }, [loading, hasRestored]);

  // Save scroll position and cache before leaving
  useEffect(() => {
    return () => {
      // Save scroll position
      const scrollY = window.scrollY;
      sessionStorage.setItem('scroll_wishlist', scrollY);
      
      // Save current favorites to cache
      if (favorites.length > 0) {
        sessionStorage.setItem('cached_wishlist', JSON.stringify(favorites));
      }
    };
  }, [favorites]);

  // Pagination
  const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);
  const paginatedFavorites = filteredFavorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product) => {
    let priceToUse = product.price;
    if (isPro && proDiscount > 0) {
      const discount = (product.price * proDiscount) / 100;
      priceToUse = Math.round(product.price - discount);
    }
    
    const productToAdd = {
      ...product,
      price: priceToUse
    };
    addToCart(productToAdd, 1);
  };

  const handleRemoveFromFavorites = async (productId) => {
    if (window.confirm('Voulez-vous retirer ce produit de vos favoris ?')) {
      await removeFromFavorites(productId);
      // Update cache after removal
      const updatedFavorites = favorites.filter(p => p.id !== productId);
      sessionStorage.setItem('cached_wishlist', JSON.stringify(updatedFavorites));
      setCachedFavorites(updatedFavorites);
    }
  };

  // Handle product click - SAVE SCROLL POSITION before navigating
  const handleProductClick = (slug) => {
    const currentScroll = window.scrollY;
    sessionStorage.setItem('scroll_wishlist', currentScroll);
    navigate(`/product/${slug}`);
  };

  // Handle page change
  const handlePageChange = (page) => {
    const currentScroll = window.scrollY;
    sessionStorage.setItem('scroll_wishlist', currentScroll);
    setCurrentPage(page);
  };

  // Handle search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    const currentScroll = window.scrollY;
    sessionStorage.setItem('scroll_wishlist', currentScroll);
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    const currentScroll = window.scrollY;
    sessionStorage.setItem('scroll_wishlist', currentScroll);
    setSearchTerm('');
  };

  // Show cached data while loading
  const displayFavorites = favorites.length > 0 ? favorites : cachedFavorites;
  const isLoading = loading && displayFavorites.length === 0;

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="auth-required">
            <Icons.Heart size={64} />
            <h2>Connectez-vous pour voir vos favoris</h2>
            <p>Vous devez être connecté pour accéder à votre liste de favoris</p>
            <div className="auth-buttons">
              <button className="btn-primary" onClick={() => navigate('/login')}>
                Se connecter
              </button>
              <button className="btn-secondary" onClick={() => navigate('/register')}>
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de vos favoris...</p>
      </div>
    );
  }

  if (displayFavorites.length === 0) {
    return (
      <div className="wishlist-page empty-wishlist">
        <div className="container">
          <Icons.Heart size={64} />
          <h2>Votre wishlist est vide</h2>
          <p>Découvrez nos produits et ajoutez-les à vos favoris</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Découvrir nos produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="page-header">
          <h1>Mes Favoris</h1>
          <div className="header-info">
            <p className="favorites-count">{filteredFavorites.length} produit(s) dans votre wishlist</p>
            {displayFavorites.length > 0 && (
              <div className="search-box wishlist-search">
                <Icons.Search size={16} />
                <input 
                  type="text"
                  placeholder="Rechercher dans mes favoris..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button className="clear-search" onClick={handleClearSearch}>
                    <Icons.X size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {filteredFavorites.length === 0 && searchTerm ? (
          <div className="no-search-results">
            <Icons.Search size={48} />
            <h3>Aucun résultat</h3>
            <p>Aucun produit ne correspond à "{searchTerm}"</p>
            <button className="btn-primary" onClick={handleClearSearch}>
              Effacer la recherche
            </button>
          </div>
        ) : (
          <>
            <div className="wishlist-grid">
              {paginatedFavorites.map(product => (
                <div key={product.id} className="wishlist-item">
                  <div 
                    className="wishlist-item-image" 
                    onClick={() => handleProductClick(product.slug)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={product.image} alt={product.name} loading="lazy" />
                  </div>
                  
                  <div className="wishlist-item-info">
                    <h3 onClick={() => handleProductClick(product.slug)} style={{ cursor: 'pointer' }}>
                      {product.name}
                    </h3>
                    {product.brand && <span className="product-brand">{product.brand}</span>}
                    <div className="product-price">
                      <span className="current-price">{product.price} MAD</span>
                      {product.original_price && (
                        <span className="original-price">{product.original_price} MAD</span>
                      )}
                    </div>
                    {product.stock > 0 ? (
                      <span className="in-stock">
                        <Icons.Check size={14} /> En stock
                      </span>
                    ) : (
                      <span className="out-of-stock">
                        <Icons.X size={14} /> Rupture de stock
                      </span>
                    )}
                  </div>

                  <div className="wishlist-item-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <Icons.ShoppingBag /> Ajouter au panier
                    </button>
                    <button 
                      className="remove-favorite-btn"
                      onClick={() => handleRemoveFromFavorites(product.id)}
                    >
                      <Icons.Trash /> Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination wishlist-pagination">
                <button 
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <Icons.ChevronLeft />
                </button>
                <span className="page-info">
                  Page {currentPage} sur {totalPages}
                </span>
                <button 
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <Icons.ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ==================== COUPONS PAGE ====================
const CouponsPage = ({ navigate }) => {
  const { coupons, loading, refreshCoupons } = useCoupons();
  const [copiedCode, setCopiedCode] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    refreshCoupons();
  }, [isAuthenticated]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCouponIcon = (type) => {
    return type === 'percentage' ? <Icons.Percent /> : <Icons.Truck />;
  };

  const formatDate = (date) => {
    if (!date) return 'Valable indéfiniment';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDiscountText = (coupon) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}% de réduction`;
    } else {
      return `${coupon.value} MAD de réduction`;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de vos coupons...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div 
        className="coupons-page"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container">
          <div className="auth-required-coupons">
            <Icons.User size={64} />
            <h2>Connectez-vous</h2>
            <p>Vous devez être connecté pour voir vos coupons personnels</p>
            <div className="auth-buttons">
              <button className="btn-primary" onClick={() => navigate('/login')}>
                Se connecter
              </button>
              <button className="btn-secondary" onClick={() => navigate('/register')}>
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="coupons-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="coupons-header">
        <div className="container">
          <div className="coupons-header-content">
            <div className="coupons-header-left">
              <h1>
                <Icons.Percent size={32} />
                Mes Coupons Personnels
              </h1>
              <p className="coupons-subtitle">
                Profitez de vos avantages exclusifs et économisez sur vos achats
              </p>
            </div>
            <div className="coupons-header-right">
              <div className="coupons-count-badge">
                <span className="count-number">{coupons.length}</span>
                <span className="count-text">coupon(s) disponible(s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {coupons.length === 0 ? (
          <div className="no-coupons">
            <Icons.Percent size={64} />
            <h2>Aucun coupon disponible</h2>
            <p>Vous n'avez pas de coupons personnels pour le moment</p>
            <p className="coupon-note">Les coupons sont attribués individuellement à chaque client</p>
            <button className="btn-primary" onClick={() => navigate('/products')}>
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <>
            <div className="coupons-stats">
              <div className="stat-item">
                <span className="stat-value">{coupons.length}</span>
                <span className="stat-label">Total coupons</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {coupons.filter(c => c.type === 'percentage').length}
                </span>
                <span className="stat-label">% Réductions</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {coupons.filter(c => c.type === 'fixed').length}
                </span>
                <span className="stat-label">MAD fixes</span>
              </div>
            </div>

            <div className="coupons-grid">
              {coupons.map(coupon => (
                <motion.div 
                  key={coupon.id}
                  className={`coupon-card ${coupon.type === 'percentage' ? 'percentage' : 'fixed'}`}
                  variants={slideUp}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="coupon-header">
                    <div className="coupon-icon">
                      {getCouponIcon(coupon.type)}
                    </div>
                    <div className="coupon-code">
                      <span className="code-label">Code</span>
                      <span className="code-value">{coupon.code}</span>
                    </div>
                  </div>

                  <div className="coupon-body">
                    <h3 className="coupon-name">{coupon.name}</h3>
                    <p className="coupon-description">{coupon.description || getDiscountText(coupon)}</p>
                    
                    <div className="coupon-details">
                      <div className="coupon-detail">
                        <span className="detail-label">Réduction</span>
                        <span className="detail-value discount">{getDiscountText(coupon)}</span>
                      </div>
                      
                      {coupon.min_order_amount && (
                        <div className="coupon-detail">
                          <span className="detail-label">Minimum de commande</span>
                          <span className="detail-value">{coupon.min_order_amount} MAD</span>
                        </div>
                      )}
                      
                      <div className="coupon-detail">
                        <span className="detail-label">Valable jusqu'au</span>
                        <span className="detail-value">{formatDate(coupon.expires_at)}</span>
                      </div>

                      <div className="coupon-detail">
                        <span className="detail-label">Utilisations restantes</span>
                        <span className="detail-value">{coupon.max_uses - (coupon.used_count || 0)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="coupon-footer">
                    <button 
                      className={`copy-btn ${copiedCode === coupon.code ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(coupon.code)}
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Icons.Check /> Copié !
                        </>
                      ) : (
                        <>
                          Copier le code
                        </>
                      )}
                    </button>
                    
                    <button 
                      className="use-btn"
                      onClick={() => navigate('/cart')}
                    >
                      Utiliser maintenant
                    </button>
                  </div>

                  <div className="coupon-personal-note">
                    <Icons.User size={14} />
                    <span>Coupon personnel - Réservé à votre compte</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// ==================== HEADER COMPONENT ====================
// ==================== OPTIMIZED HEADER (No Framer Motion) ====================
// ==================== COMPLETE WORKING HEADER COMPONENT ====================
const Header = ({ currentPath, navigate }) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const categoryMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { setSearchQuery, categories, setSelectedCategory, selectedCategory } = useProducts();
  const { favoritesCount } = useFavorites();
  const { couponsCount } = useCoupons();

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close category menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setShowCategoryMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        // Don't close mobile menu when clicking inside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate('/products');
    setShowSearch(false);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowMobileMenu(false);
  };

  // FIXED: Category click handler - This is the key function
  const handleCategoryClick = (categoryId, categoryName) => {
    console.log('🏷️ Category clicked:', { categoryId, categoryName });
    
    // Close all menus
    setShowCategoryMenu(false);
    setShowMobileMenu(false);
    
    // Clear any existing search query when selecting a category
    setSearchQuery('');
    
    // Update selected category in context
    if (setSelectedCategory) {
      setSelectedCategory(categoryId);
    }
    
    // Navigate to products page with category parameter
    navigate(`/products?category=${categoryId}`);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle all categories click
  const handleAllCategoriesClick = () => {
    console.log('🏷️ All categories clicked');
    
    setShowCategoryMenu(false);
    setShowMobileMenu(false);
    setSearchQuery('');
    
    if (setSelectedCategory) {
      setSelectedCategory(null);
    }
    
    navigate('/products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle logo click
  const handleLogoClick = (e) => {
    e.preventDefault();
    setShowCategoryMenu(false);
    setShowMobileMenu(false);
    setSearchQuery('');
    
    if (setSelectedCategory) {
      setSelectedCategory(null);
    }
    
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format count for display
  const formatCount = (count) => {
    if (count > 99) return '99+';
    return count;
  };

  return (
    <>
      {!isMobile && (
        <div className="announcement-bar hide-mobile">
          <div className="marquee">
            <span><Icons.Truck /> LIVRAISON GRATUITE À PARTIR DE 1000DH</span>
          </div>
        </div>
      )}

      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="header-left">
              {/* Mobile Menu Button */}
              <button 
                className="menu-toggle mobile-only" 
                onClick={() => setShowMobileMenu(true)}
                aria-label="Menu"
              >
                <Icons.Menu />
              </button>

              {/* Logo */}
              <a 
                href="/" 
                className="logo" 
                onClick={handleLogoClick}
              >
                <img src="https://www.teclab.ma/storage/products/partenaires/teclab-logo-320px.png" alt="TECLAB" />
              </a>

              {/* Desktop Category Button */}
              {!isMobile && (
                <button 
                  className="menu-toggle desktop-only" 
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                >
                  <Icons.Menu />
                  <span>Catégories</span>
                </button>
              )}
            </div>

            {/* Desktop Search Form */}
            {!isMobile && (
              <form className="search-form desktop-only" onSubmit={handleSearch}>
                <input 
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" aria-label="Rechercher">
                  <Icons.Search />
                </button>
              </form>
            )}

            {/* Header Icons */}
            <div className="header-right">
              {/* Mobile Search Toggle */}
              {isMobile && (
                <button 
                  className="header-icon mobile-search-toggle"
                  onClick={() => setShowSearch(!showSearch)}
                  aria-label="Rechercher"
                >
                  <Icons.Search />
                </button>
              )}

              {/* Coupons Icon */}
              <a 
                href="/coupons" 
                className="header-icon coupons-icon" 
                onClick={(e) => { e.preventDefault(); navigate('/coupons'); }}
                aria-label="Coupons"
              >
                <Icons.Percent />
                {isAuthenticated && couponsCount > 0 && (
                  <span className={`count ${couponsCount > 99 ? 'overflow' : ''}`}>
                    {formatCount(couponsCount)}
                  </span>
                )}
              </a>
              
              {/* Wishlist Icon */}
              <a 
                href="/wishlist" 
                className="header-icon wishlist-icon" 
                onClick={(e) => { e.preventDefault(); navigate('/wishlist'); }}
                aria-label="Favoris"
              >
                <Icons.Heart />
                {isAuthenticated && favoritesCount > 0 && (
                  <span className={`count ${favoritesCount > 99 ? 'overflow' : ''}`}>
                    {formatCount(favoritesCount)}
                  </span>
                )}
              </a>
              
              {/* Cart Icon */}
              <div className="ps-cart--mini">
                <a 
                  href="/cart" 
                  className="header-icon cart-icon" 
                  onClick={(e) => { e.preventDefault(); navigate('/cart'); }}
                  aria-label="Panier"
                >
                  <Icons.ShoppingBag />
                  <span className={`count ${cartCount > 99 ? 'overflow' : ''}`}>
                    {formatCount(cartCount)}
                  </span>
                </a>
              </div>

              {/* Desktop User Menu */}
              {!isMobile && (
                <div className="user-menu desktop-only">
                  <Icons.User />
                  <div className="user-dropdown">
                    {isAuthenticated ? (
                      <>
                        <span className="user-name">{user?.name}</span>
                        <a href="/dashboard" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>Mon Compte</a>
                        <a href="/orders" onClick={(e) => { e.preventDefault(); navigate('/orders'); }}>Mes Commandes</a>
                        <a href="/wishlist" onClick={(e) => { e.preventDefault(); navigate('/wishlist'); }}>
                          Mes Favoris {favoritesCount > 0 && `(${favoritesCount})`}
                        </a>
                        
                        {user?.role === 'admin' && (
                          <>
                            <div className="dropdown-divider"></div>
                            <a href="/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>
                              <Icons.User size={16} style={{ marginRight: '8px' }} /> Administration
                            </a>
                          </>
                        )}
                        
                        <div className="dropdown-divider"></div>
                        <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
                      </>
                    ) : (
                      <>
                        <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Connexion</a>
                        <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Inscription</a>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && isMobile && (
          <div className="mobile-search-bar">
            <form onSubmit={handleSearch}>
              <input 
                type="text"
                placeholder="Rechercher un produit..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                autoFocus
              />
              <button type="submit" aria-label="Rechercher">
                <Icons.Search />
              </button>
              <button 
                type="button" 
                className="close-search"
                onClick={() => setShowSearch(false)}
                aria-label="Fermer"
              >
                <Icons.X />
              </button>
            </form>
          </div>
        )}

        {/* Desktop Categories Mega Menu */}
        {showCategoryMenu && !isMobile && (
          <div className="categories-mega-menu desktop-only" ref={categoryMenuRef}>
            <div className="container">
              <div className="categories-grid-header">
                {/* All Categories Option */}
                <div 
                  className="category-menu-item all-categories"
                  onClick={handleAllCategoriesClick}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="category-menu-icon">
                    <Icons.Package size={20} />
                  </div>
                  <div className="category-menu-content">
                    <h4>Toutes les catégories</h4>
                    <span className="category-menu-count">
                      Voir tous les produits
                    </span>
                  </div>
                </div>
                
                {/* Individual Categories */}
                {categories.length > 0 ? (
                  categories.map(category => (
                    <div 
                      key={category.id}
                      className={`category-menu-item ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(category.id, category.name)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="category-menu-icon">
                        <Icons.Package size={20} />
                      </div>
                      <div className="category-menu-content">
                        <h4>{category.name}</h4>
                        <span className="category-menu-count">
                          {category.products_count || 0} produits
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="loading-categories">Chargement des catégories...</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}>
            <div className="mobile-menu-content" ref={mobileMenuRef} onClick={e => e.stopPropagation()}>
              <div className="mobile-menu-header">
                <div className="mobile-user-info">
                  {isAuthenticated ? (
                    <>
                      <div className="mobile-user-avatar">
                        <Icons.User />
                      </div>
                      <div className="mobile-user-details">
                        <span className="mobile-user-name">{user?.name}</span>
                        <span className="mobile-user-email">{user?.email}</span>
                      </div>
                    </>
                  ) : (
                    <div className="mobile-guest">
                      <span>Bonjour !</span>
                      <div className="mobile-auth-links">
                        <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); setShowMobileMenu(false); }}>
                          Connexion
                        </a>
                        <span className="separator">|</span>
                        <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); setShowMobileMenu(false); }}>
                          Inscription
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <button className="close-btn" onClick={() => setShowMobileMenu(false)} aria-label="Fermer">
                  <Icons.X />
                </button>
              </div>

              <div className="mobile-menu-body">
                {/* Mobile Stats */}
                {isAuthenticated && (
                  <div className="mobile-stats">
                    <div className="stat-item" onClick={() => { setShowMobileMenu(false); navigate('/wishlist'); }}>
                      <Icons.Heart />
                      <span>{favoritesCount} Favoris</span>
                    </div>
                    <div className="stat-item" onClick={() => { setShowMobileMenu(false); navigate('/coupons'); }}>
                      <Icons.Percent />
                      <span>{couponsCount} Coupons</span>
                    </div>
                    <div className="stat-item" onClick={() => { setShowMobileMenu(false); navigate('/cart'); }}>
                      <Icons.ShoppingBag />
                      <span>{cartCount} Articles</span>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="mobile-menu-section">
                  <h4>Navigation</h4>
                  <div className="mobile-links-list">
                    <a 
                      href="/" 
                      onClick={(e) => {
                        e.preventDefault();
                        setShowMobileMenu(false);
                        navigate('/');
                      }}
                    >
                      <Icons.Home size={18} /> Accueil
                    </a>
                    <a 
                      href="/products" 
                      onClick={(e) => {
                        e.preventDefault();
                        setShowMobileMenu(false);
                        navigate('/products');
                      }}
                    >
                      <Icons.Package size={18} /> Tous les produits
                    </a>
                    <a 
                      href="/categories" 
                      onClick={(e) => {
                        e.preventDefault();
                        setShowMobileMenu(false);
                        navigate('/categories');
                      }}
                    >
                      <Icons.Filter size={18} /> Catégories
                    </a>
                  </div>
                </div>

                {/* Categories Section */}
                <div className="mobile-menu-section">
                  <h4>Catégories</h4>
                  <div className="mobile-categories-list">
                    {/* All Categories Option */}
                    <div 
                      className="mobile-category-link all-categories"
                      onClick={() => {
                        handleAllCategoriesClick();
                        setShowMobileMenu(false);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="category-name">Toutes les catégories</span>
                      <span className="category-count">Voir tout</span>
                    </div>
                    
                    {/* Individual Categories */}
                    {categories.slice(0, 10).map(category => (
                      <div 
                        key={category.id}
                        className={`mobile-category-link ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                        onClick={() => {
                          handleCategoryClick(category.id, category.name);
                          setShowMobileMenu(false);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="category-name">{category.name}</span>
                        <span className="category-count">{category.products_count || 0}</span>
                      </div>
                    ))}
                    {categories.length > 10 && (
                      <a 
                        href="/categories"
                        className="view-all-categories"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMobileMenu(false);
                          navigate('/categories');
                        }}
                      >
                        Voir toutes les catégories <Icons.ChevronRight size={14} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Account Section */}
                {isAuthenticated && (
                  <div className="mobile-menu-section">
                    <h4>Mon compte</h4>
                    <div className="mobile-links-list">
                      <a 
                        href="/dashboard" 
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMobileMenu(false);
                          navigate('/dashboard');
                        }}
                      >
                        <Icons.User size={18} /> Tableau de bord
                      </a>
                      <a 
                        href="/orders" 
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMobileMenu(false);
                          navigate('/orders');
                        }}
                      >
                        <Icons.Package size={18} /> Mes commandes
                      </a>
                      <a 
                        href="/wishlist" 
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMobileMenu(false);
                          navigate('/wishlist');
                        }}
                      >
                        <Icons.Heart size={18} /> Mes favoris
                      </a>
                      <a 
                        href="/coupons" 
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMobileMenu(false);
                          navigate('/coupons');
                        }}
                      >
                        <Icons.Percent size={18} /> Mes coupons
                      </a>
                    </div>
                  </div>
                )}

                {/* Info Section */}
                <div className="mobile-menu-section">
                  <h4>Informations</h4>
                  <div className="mobile-links-list">
                    <a 
                      href="/about" 
                      onClick={(e) => {
                        e.preventDefault();
                        setShowMobileMenu(false);
                        navigate('/about');
                      }}
                    >
                      À propos
                    </a>
                    <a 
                      href="/contact" 
                      onClick={(e) => {
                        e.preventDefault();
                        setShowMobileMenu(false);
                        navigate('/contact');
                      }}
                    >
                      Contact
                    </a>
                  </div>
                </div>

                {/* Logout Button */}
                {isAuthenticated && (
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    <Icons.LogOut size={18} /> Déconnexion
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
// ==================== FOOTER COMPONENT ====================
const Footer = ({ navigate }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-widgets">
          <div className="widget">
            <h4>Liens rapides</h4>
            <ul>
              <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Accueil</a></li>
              <li><a href="/products" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>Produits</a></li>
              <li><a href="/categories" onClick={(e) => { e.preventDefault(); navigate('/categories'); }}>Catégories</a></li>
              <li><a href="/coupons" onClick={(e) => { e.preventDefault(); navigate('/coupons'); }}>Coupons</a></li>
              <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>À propos</a></li>
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 TECLAB. Tous droits réservés.</p>
        </div>
      </div>

      <motion.a 
        href="https://wa.me/212666868091" 
        className="whatsapp-btn" 
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <Icons.WhatsApp />
        <span className="tooltip">Contactez-nous !</span>
      </motion.a>
    </footer>
  );
};

// ==================== HOME PAGE ====================
const HomePage = ({ navigate }) => {
  const { addToCart } = useCart();
  const { getFeaturedProducts } = useProducts();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, checkIsFavorite } = useFavorites();
  const { isPro, proDiscount } = useAuth();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    setLoading(true);
    const products = await getFeaturedProducts();
    setFeatured(products);
    setLoading(false);
  };

  return (
    <div className="home-page">
      <Carousel />
      
      <motion.section 
        className="featured-products"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        <div className="container">
          <h2 className="section-title">Produits en vedette</h2>
          {loading ? (
            <div className="loading-spinner">Chargement...</div>
          ) : (
            <div className="products-grid">
              {featured.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                  onViewDetails={(product) => navigate(`/product/${product.slug}`)}
                  isFavorite={checkIsFavorite(product.id)}
                  onToggleFavorite={toggleFavorite}
                  isPro={isPro}
                  proDiscount={proDiscount}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

// ==================== PRODUCTS PAGE ====================
// ==================== PRODUCTS PAGE COMPLETE ====================
// ==================== FIXED PRODUCTS PAGE WITH PROPER CATEGORY FILTERING ====================
// ==================== COMPLETE FIXED PRODUCTS PAGE ====================
const ProductsPage = ({ navigate }) => {
  const {
    filteredProducts,
    totalProducts,
    totalPages,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    clearFilters,
    loading,
    categories,
    brands,
    selectedCategory,
    setSelectedCategory,
    selectedBrands,
    toggleBrand,
    clearBrands,
    priceRange,
    setPriceRange,
    getActiveFiltersCount,
    refreshProducts
  } = useProducts();
  
  const { addToCart } = useCart();
  const { toggleFavorite, checkIsFavorite } = useFavorites();
  const { isPro, proDiscount } = useAuth();
  
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const scrollPositionRef = useRef(0);
  const isSyncingFromURL = useRef(false);
  const previousSelectedCategory = useRef(selectedCategory);

  // Save scroll position before navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('products_scroll_position', window.scrollY);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Restore scroll position after navigation
  useEffect(() => {
    if (!isInitialLoad) {
      const savedPosition = sessionStorage.getItem('products_scroll_position');
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedPosition), behavior: 'instant' });
          sessionStorage.removeItem('products_scroll_position');
        }, 100);
      }
    }
    setIsInitialLoad(false);
  }, []);

  // SYNC WITH URL PARAMETERS ON MOUNT AND URL CHANGE
  useEffect(() => {
    isSyncingFromURL.current = true;
    
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('category');
    const search = params.get('search');
    const sort = params.get('sort');
    const minPrice = params.get('min_price');
    const maxPrice = params.get('max_price');
    const brandsParam = params.get('brands');
    
    console.log('🔍 URL Parameters detected:', {
      categoryId,
      search,
      sort,
      minPrice,
      maxPrice,
      brandsParam
    });
    
    // Save current scroll position before updating
    scrollPositionRef.current = window.scrollY;
    
    // Update search query from URL
    if (search !== null && search !== searchQuery) {
      setSearchQuery(search);
    }
    
    // Update sort from URL
    if (sort && sort !== sortBy) {
      setSortBy(sort);
    }
    
    // Update price range from URL
    if (minPrice || maxPrice) {
      setPriceRange({
        min: minPrice ? parseFloat(minPrice) : 0,
        max: maxPrice ? parseFloat(maxPrice) : 50000
      });
    }
    
    // Update brands from URL
    if (brandsParam) {
      const brandsArray = brandsParam.split(',');
      // Only update if different
      if (JSON.stringify(selectedBrands.sort()) !== JSON.stringify(brandsArray.sort())) {
        clearBrands();
        brandsArray.forEach(brand => {
          toggleBrand(brand);
        });
      }
    }
    
    // Update category from URL
    if (categoryId && categories.length > 0) {
      const category = categories.find(c => c.id.toString() === categoryId);
      if (category) {
        if (selectedCategory !== categoryId) {
          console.log('✅ Setting category from URL:', category.name, 'ID:', categoryId);
          setSelectedCategory(categoryId);
          setSelectedCategoryName(category.name);
        }
      }
    } else if (!categoryId && selectedCategory) {
      setSelectedCategory(null);
      setSelectedCategoryName('');
    }
    
    // Reset the flag after a short delay
    setTimeout(() => {
      isSyncingFromURL.current = false;
    }, 200);
    
  }, [window.location.search, categories]);

  // Update URL when filters change - ONLY when not syncing from URL
  useEffect(() => {
    // Don't update URL if we're syncing from URL
    if (isSyncingFromURL.current) {
      return;
    }
    
    // Don't update on initial load
    if (isInitialLoad) {
      return;
    }
    
    const params = new URLSearchParams();
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (sortBy && sortBy !== 'featured') {
      params.set('sort', sortBy);
    }
    if (priceRange.min > 0) {
      params.set('min_price', priceRange.min);
    }
    if (priceRange.max < 50000) {
      params.set('max_price', priceRange.max);
    }
    if (selectedBrands.length > 0) {
      params.set('brands', selectedBrands.join(','));
    }
    
    const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
    const currentUrl = window.location.pathname + window.location.search;
    
    // Only update if URL is different
    if (newUrl !== currentUrl) {
      console.log('🔄 Updating URL to:', newUrl);
      // Save current scroll position before navigation
      const currentScroll = window.scrollY;
      sessionStorage.setItem('products_scroll_position', currentScroll);
      navigate(newUrl, { replace: true });
    }
  }, [selectedCategory, searchQuery, sortBy, priceRange.min, priceRange.max, selectedBrands, isInitialLoad]);

  // Handle category change - NO SCROLL TO TOP
  const handleCategoryChange = (categoryId) => {
    console.log('🏷️ Category clicked:', categoryId);
    
    // Save current scroll position
    const currentScroll = window.scrollY;
    sessionStorage.setItem('products_scroll_position', currentScroll);
    
    if (categoryId === null) {
      // Clear category filter
      setSelectedCategory(null);
      setSelectedCategoryName('');
    } else {
      // Set new category
      const category = categories.find(c => c.id.toString() === categoryId);
      if (category) {
        setSelectedCategory(categoryId);
        setSelectedCategoryName(category.name);
        console.log('✅ Category set to:', category.name);
      }
    }
    
    // Reset to page 1 when category changes
    setCurrentPage(1);
    
    // DO NOT scroll to top - let the page stay where it is
  };

  // Handle search with Enter key - NO SCROLL TO TOP
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Save current scroll position
      const currentScroll = window.scrollY;
      sessionStorage.setItem('products_scroll_position', currentScroll);
      setCurrentPage(1);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Save scroll position before search updates
    const currentScroll = window.scrollY;
    sessionStorage.setItem('products_scroll_position', currentScroll);
    setCurrentPage(1);
  };

  // Clear all filters - NO SCROLL TO TOP
  const handleClearFilters = () => {
    console.log('🗑️ Clearing all filters');
    
    // Save current scroll position
    const currentScroll = window.scrollY;
    sessionStorage.setItem('products_scroll_position', currentScroll);
    
    clearFilters();
    setSelectedCategory(null);
    setSelectedCategoryName('');
    setSearchQuery('');
    setCurrentPage(1);
    
    // Navigate without forcing scroll
    navigate('/products', { replace: true });
  };

  // Clear search only - NO SCROLL TO TOP
  const handleClearSearch = () => {
    console.log('🔍 Clearing search');
    
    // Save current scroll position
    const currentScroll = window.scrollY;
    sessionStorage.setItem('products_scroll_position', currentScroll);
    
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Handle page change - NO SCROLL TO TOP
  const handlePageChange = (page) => {
    // Save current scroll position before changing page
    const currentScroll = window.scrollY;
    sessionStorage.setItem('products_scroll_position', currentScroll);
    setCurrentPage(page);
  };

  // Handle sort change - NO SCROLL TO TOP
  const handleSortChange = (e) => {
    const value = e.target.value;
    // Save current scroll position
    const currentScroll = window.scrollY;
    sessionStorage.setItem('products_scroll_position', currentScroll);
    setSortBy(value);
    setCurrentPage(1);
  };

  // Handle price range change - NO SCROLL TO TOP
  const handlePriceChange = (value) => {
    // Save current scroll position
    const currentScroll = window.scrollY;
    sessionStorage.setItem('products_scroll_position', currentScroll);
    setPriceRange({ ...priceRange, max: value });
    setCurrentPage(1);
  };

  // Handle brand toggle - NO SCROLL TO TOP
  const handleBrandToggle = (brand) => {
    // Save current scroll position
    const currentScroll = window.scrollY;
    sessionStorage.setItem('products_scroll_position', currentScroll);
    toggleBrand(brand);
    setCurrentPage(1);
  };

  // Displayed brands
  const displayedBrands = showAllBrands ? brands : brands.slice(0, 8);
  const hasMoreBrands = brands.length > 8;
  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="products-page redesigned">
      {/* Header */}
      <div className="page-header modern">
        <div className="container">
          <h1>
            {selectedCategoryName ? selectedCategoryName : 
             searchQuery ? `Résultats pour "${searchQuery}"` : 
             'Tous nos produits'}
          </h1>
          <div className="page-header-info">
            <p className="products-count">{totalProducts} produits trouvés</p>
            {activeFiltersCount > 0 && (
              <span className="active-filters-badge">
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
              </span>
            )}
            {searchQuery && (
              <button className="clear-search-btn" onClick={handleClearSearch}>
                <Icons.X size={14} /> Effacer la recherche
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="products-layout redesigned">
          {/* Sidebar Filters */}
          <aside className="sidebar redesigned">
            <div className="filter-sidebar redesigned">
              <div className="filter-header">
                <h3>Filtres</h3>
                {activeFiltersCount > 0 && (
                  <button className="clear-all-filters" onClick={handleClearFilters}>
                    <Icons.X size={14} /> Tout effacer
                  </button>
                )}
              </div>
              
              {/* Categories Filter */}
              <div className="filter-section">
                <h4>Catégories</h4>
                <div className="category-list">
                  <button
                    className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(null)}
                  >
                    Toutes les catégories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`category-btn ${selectedCategory === cat.id.toString() ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat.id.toString())}
                    >
                      {cat.name}
                      <span className="category-count">{cat.products_count || 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="filter-section">
                <div className="filter-section-header">
                  <h4>Marques</h4>
                  {selectedBrands.length > 0 && (
                    <button className="clear-section" onClick={clearBrands}>
                      <Icons.X size={12} /> Effacer
                    </button>
                  )}
                </div>
                <div className="brand-list">
                  {displayedBrands.length > 0 ? (
                    <>
                      {displayedBrands.map(brand => (
                        <label key={brand} className="brand-item">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                          />
                          <span className="brand-name">{brand}</span>
                          <span className="brand-check">
                            {selectedBrands.includes(brand) && <Icons.Check size={12} />}
                          </span>
                        </label>
                      ))}
                      {hasMoreBrands && !showAllBrands && (
                        <button 
                          className="show-more-brands"
                          onClick={() => setShowAllBrands(true)}
                        >
                          Voir plus de marques ({brands.length - 8})
                        </button>
                      )}
                      {showAllBrands && (
                        <button 
                          className="show-less-brands"
                          onClick={() => setShowAllBrands(false)}
                        >
                          Voir moins
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="no-brands">Aucune marque disponible</p>
                  )}
                </div>
              </div>

              {/* Price Filter */}
              <div className="filter-section">
                <h4>Prix maximum</h4>
                <div className="price-range">
                  <input 
                    type="range" 
                    min="0" 
                    max="50000" 
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="price-slider"
                  />
                  <div className="price-display">
                    <span>0 MAD</span>
                    <span className="max-price">{priceRange.max} MAD</span>
                  </div>
                </div>
              </div>

              {/* Sort Filter */}
              <div className="filter-section">
                <h4>Trier par</h4>
                <select 
                  value={sortBy} 
                  onChange={handleSortChange}
                  className="sort-select"
                >
                  <option value="featured">En vedette</option>
                  <option value="price-asc">Prix: croissant</option>
                  <option value="price-desc">Prix: décroissant</option>
                  <option value="name-asc">Nom: A-Z</option>
                  <option value="name-desc">Nom: Z-A</option>
                </select>
              </div>

              <button className="clear-filters-btn" onClick={handleClearFilters}>
                <Icons.X size={16} /> Réinitialiser tous les filtres
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="products-main redesigned">
            {/* Toolbar */}
            <div className="products-toolbar redesigned">
              <div className="search-box redesigned">
                <Icons.Search className="search-icon" />
                <input 
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                />
                {searchQuery && (
                  <button className="clear-search" onClick={handleClearSearch}>
                    <Icons.X size={16} />
                  </button>
                )}
              </div>

              <button 
                className="mobile-filter-btn redesigned" 
                onClick={() => setShowFilter(true)}
              >
                <Icons.Filter /> 
                Filtrer
                {activeFiltersCount > 0 && (
                  <span className="filter-badge">{activeFiltersCount}</span>
                )}
              </button>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="active-filters">
                  {selectedCategory && (
                    <div className="active-filter-group">
                      <span className="filter-label">Catégorie:</span>
                      <div className="filter-tags">
                        <span className="filter-tag">
                          {selectedCategoryName}
                          <button onClick={() => handleCategoryChange(null)}>
                            <Icons.X size={12} />
                          </button>
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedBrands.length > 0 && (
                    <div className="active-filter-group">
                      <span className="filter-label">Marques:</span>
                      <div className="filter-tags">
                        {selectedBrands.map(brand => (
                          <span key={brand} className="filter-tag">
                            {brand}
                            <button onClick={() => handleBrandToggle(brand)}>
                              <Icons.X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchQuery && (
                    <div className="active-filter-group">
                      <span className="filter-label">Recherche:</span>
                      <div className="filter-tags">
                        <span className="filter-tag">
                          "{searchQuery}"
                          <button onClick={handleClearSearch}>
                            <Icons.X size={12} />
                          </button>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement des produits...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="products-grid redesigned">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart}
                      onViewDetails={(product) => navigate(`/product/${product.slug}`)}
                      isFavorite={checkIsFavorite(product.id)}
                      onToggleFavorite={toggleFavorite}
                      isPro={isPro}
                      proDiscount={proDiscount}
                      navigate={navigate}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination redesigned">
                    <button 
                      className="pagination-btn"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <Icons.ChevronLeft />
                    </button>
                    
                    <div className="page-numbers">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={i}
                              className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return <span key={i} className="page-dots">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button 
                      className="pagination-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <Icons.ChevronRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-products redesigned">
                <Icons.Package size={64} />
                <h2>Aucun produit trouvé</h2>
                <p>Essayez de modifier vos filtres ou d'effectuer une nouvelle recherche</p>
                <button className="reset-filters-btn" onClick={handleClearFilters}>
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilter && (
        <div className="mobile-filter-modal redesigned" onClick={() => setShowFilter(false)}>
          <div className="mobile-filter-content redesigned" onClick={e => e.stopPropagation()}>
            <div className="mobile-filter-header">
              <h3>Filtres</h3>
              <button className="close-btn" onClick={() => setShowFilter(false)}>
                <Icons.X />
              </button>
            </div>

            <div className="mobile-filter-body">
              {/* Categories */}
              <div className="filter-section">
                <h4>Catégories</h4>
                <div className="category-list mobile">
                  <button
                    className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                    onClick={() => {
                      handleCategoryChange(null);
                      setShowFilter(false);
                    }}
                  >
                    Toutes les catégories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`category-btn ${selectedCategory === cat.id.toString() ? 'active' : ''}`}
                      onClick={() => {
                        handleCategoryChange(cat.id.toString());
                        setShowFilter(false);
                      }}
                    >
                      {cat.name}
                      <span className="category-count">{cat.products_count || 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="filter-section">
                <h4>Marques</h4>
                <div className="brand-list mobile">
                  {brands.map(brand => (
                    <label key={brand} className="brand-item">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                      />
                      <span className="brand-name">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="filter-section">
                <h4>Prix maximum</h4>
                <div className="price-range">
                  <input 
                    type="range" 
                    min="0" 
                    max="50000" 
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="price-slider"
                  />
                  <div className="price-display">
                    <span>0 MAD</span>
                    <span className="max-price">{priceRange.max} MAD</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="filter-section">
                <h4>Trier par</h4>
                <select 
                  value={sortBy} 
                  onChange={handleSortChange}
                  className="sort-select"
                >
                  <option value="featured">En vedette</option>
                  <option value="price-asc">Prix: croissant</option>
                  <option value="price-desc">Prix: décroissant</option>
                  <option value="name-asc">Nom: A-Z</option>
                  <option value="name-desc">Nom: Z-A</option>
                </select>
              </div>
            </div>

            <div className="mobile-filter-footer">
              <button className="clear-btn" onClick={handleClearFilters}>
                Effacer tout
              </button>
              <button className="apply-btn" onClick={() => setShowFilter(false)}>
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// ==================== PRODUCT DETAIL PAGE ====================
// ==================== PRODUCT DETAIL PAGE COMPLETE ====================
// ==================== COMPLETE FIXED PRODUCT DETAIL PAGE ====================
const ProductDetailPage = ({ navigate }) => {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { getProduct } = useProducts();
  const { isAuthenticated, isPro, proDiscount } = useAuth();
  const { toggleFavorite, checkIsFavorite } = useFavorites();

  // Get current slug from URL
  const getCurrentSlug = () => {
    const path = window.location.pathname;
    return path.split('/').pop();
  };

  // Load product function
  const loadProduct = async (slug) => {
    setLoading(true);
    setError(null);
    setProduct(null);
    setRelated([]);
    
    try {
      console.log('📦 Loading product with slug:', slug);
      const data = await getProduct(slug);
      
      if (data) {
        const productData = data.product || data;
        console.log('✅ Product loaded:', productData.name);
        setProduct(productData);
        setRelated(data.related || []);
        setIsFavorite(data.is_favorite || false);
        // Reset states when product changes
        setSelectedImage(0);
        setActiveTab('description');
        setQuantity(1);
      } else {
        setError('Produit non trouvé');
      }
    } catch (err) {
      console.error('❌ Failed to load product:', err);
      setError('Erreur lors du chargement du produit');
    } finally {
      setLoading(false);
    }
  };

  // Effect to load product when URL changes
  useEffect(() => {
    const slug = getCurrentSlug();
    if (slug && slug !== 'product') {
      loadProduct(slug);
    } else {
      setError('Produit invalide');
      setLoading(false);
    }
  }, [window.location.pathname]); // Re-run when URL path changes

  // Save scroll position when leaving
  useEffect(() => {
    return () => {
      // Save scroll position for wishlist/orders if coming from there
      const referrer = document.referrer;
      if (referrer.includes('/wishlist')) {
        const currentScroll = window.scrollY;
        sessionStorage.setItem('scroll_wishlist', currentScroll);
      } else if (referrer.includes('/orders')) {
        const currentScroll = window.scrollY;
        sessionStorage.setItem('scroll_orders', currentScroll);
      }
    };
  }, []);

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${product.id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${product.id}`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    let priceToUse = product.price;
    if (isPro && proDiscount > 0 && product.original_price) {
      priceToUse = product.price;
    }
    
    const productToAdd = {
      ...product,
      price: priceToUse
    };
    
    addToCart(productToAdd, quantity);
    alert('Produit ajouté au panier !');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate('/checkout'), 500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const handleRelatedProductClick = (slug) => {
    console.log('🔄 Navigating to related product:', slug);
    navigate(`/product/${slug}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="not-found">
        <Icons.AlertCircle size={64} />
        <h2>Erreur</h2>
        <p>{error}</p>
        <button className="btn-primary" onClick={() => navigate('/products')}>
          Voir tous les produits
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found">
        <Icons.Package size={64} />
        <h2>Produit non trouvé</h2>
        <p>Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
        <button className="btn-primary" onClick={() => navigate('/products')}>
          Voir tous les produits
        </button>
      </div>
    );
  }

  // Get all product images
  const productImages = (() => {
    if (product.images_array && Array.isArray(product.images_array) && product.images_array.length > 0) {
      return product.images_array;
    }
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(img => img.image_path);
    }
    if (product.image) {
      return [product.image];
    }
    return ['https://via.placeholder.com/500'];
  })();
  
  const hasProDiscount = isPro && proDiscount > 0 && product.original_price && product.original_price > product.price;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Accueil</a>
          <span className="separator">/</span>
          <a href="/products" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>Produits</a>
          <span className="separator">/</span>
          {product.category && (
            <>
              <a 
                href={`/products?category=${product.category_id}`} 
                onClick={(e) => { e.preventDefault(); navigate(`/products?category=${product.category_id}`); }}
              >
                {product.category.name}
              </a>
              <span className="separator">/</span>
            </>
          )}
          <span className="current">{product.name}</span>
        </div>

        {/* Product Detail */}
        <div className="product-detail">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img 
                src={productImages[selectedImage] || product.image} 
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/500';
                }} 
              />
              {hasProDiscount && (
                <span className="product-discount pro-discount">
                  -{proDiscount}% PRO
                </span>
              )}
              {product.badge && (
                <span className="product-badge">{product.badge}</span>
              )}
              {product.stock === 0 && (
                <span className="product-badge out-of-stock-badge">Rupture</span>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="thumbnail-images">
                {productImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100';
                      }} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1>{product.name}</h1>
            
            <div className="product-meta">
              {product.sku && <span className="sku">SKU: {product.sku}</span>}
              {product.brand && <span className="brand">Marque: {product.brand}</span>}
            </div>

            {/* Rating Summary */}
            <div className="product-rating-summary" onClick={() => setActiveTab('reviews')}>
              <div className="product-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}>★</span>
                ))}
                <span className="rating-count">({product.reviews_count || 0} avis)</span>
              </div>
              <button className="write-review-link">
                Donner votre avis
              </button>
            </div>

            {/* Price */}
            <div className="product-price-section">
              <div className={`product-price ${hasProDiscount ? 'has-pro' : ''}`}>
                <span className={`current-price ${hasProDiscount ? 'pro-price' : ''}`}>
                  {product.price} MAD
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="original-price">{product.original_price} MAD</span>
                )}
              </div>
              
              {hasProDiscount && (
                <div className="pro-savings">
                  <Icons.Percent size={16} />
                  <span>Économisez {Math.round(product.original_price - product.price)} MAD en tant que professionnel</span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="product-stock">
              {product.stock > 0 ? (
                <>
                  <span className="in-stock">
                    <Icons.Check size={16} /> En stock ({product.stock} disponibles)
                  </span>
                  {product.stock < 10 && (
                    <span className="low-stock-warning">
                      Plus que {product.stock} exemplaire(s) en stock
                    </span>
                  )}
                </>
              ) : (
                <span className="out-of-stock">
                  <Icons.X size={16} /> Rupture de stock
                </span>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="product-actions">
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                >
                  <Icons.Minus />
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  min="1"
                  max={product.stock}
                  disabled={product.stock === 0}
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock === 0 || quantity >= product.stock}
                >
                  <Icons.Plus />
                </button>
              </div>

              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <Icons.ShoppingBag /> Ajouter au panier
              </button>

              <button 
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Acheter maintenant
              </button>

              <button 
                className={`wishlist-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleAddToWishlist}
              >
                <Icons.Heart /> 
                {isFavorite ? 'Retirer' : 'Favoris'}
              </button>

              <button 
                className="share-btn"
                onClick={handleShare}
                title="Partager"
              >
                <Icons.Share2 size={18} />
              </button>
            </div>

            {/* Description */}
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Features */}
            {product.features && (
              <div className="product-features">
                <h3>Caractéristiques</h3>
                <ul>
                  {(() => {
                    let featuresList = [];
                    
                    if (Array.isArray(product.features)) {
                      featuresList = product.features;
                    } else if (typeof product.features === 'string') {
                      try {
                        const parsed = JSON.parse(product.features);
                        featuresList = Array.isArray(parsed) ? parsed : [parsed];
                      } catch {
                        featuresList = [product.features];
                      }
                    } else if (product.features) {
                      featuresList = [String(product.features)];
                    }
                    
                    return featuresList.map((feature, index) => (
                      <li key={index}>
                        <Icons.Check size={14} /> {feature}
                      </li>
                    ));
                  })()}
                </ul>
              </div>
            )}

            {/* Additional Info */}
            <div className="product-additional">
              <div className="info-item">
                <Icons.Truck size={18} />
                <span>Livraison gratuite à partir de 1000 MAD</span>
              </div>
              <div className="info-item">
                <Icons.Check size={18} />
                <span>Paiement sécurisé</span>
              </div>
              <div className="info-item">
                <Icons.Phone size={18} />
                <span>Support client: +212 600-000000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={activeTab === 'description' ? 'active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={activeTab === 'features' ? 'active' : ''}
              onClick={() => setActiveTab('features')}
            >
              Caractéristiques
            </button>
            <button 
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Avis ({product.reviews_count || 0})
            </button>
            <button 
              className={activeTab === 'shipping' ? 'active' : ''}
              onClick={() => setActiveTab('shipping')}
            >
              Livraison
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <h3>Description du produit</h3>
                <p>{product.description || 'Aucune description disponible.'}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="tab-pane">
                <h3>Caractéristiques</h3>
                {product.features && (
                  <ul className="features-list">
                    {(() => {
                      let featuresList = [];
                      if (Array.isArray(product.features)) {
                        featuresList = product.features;
                      } else if (typeof product.features === 'string') {
                        try {
                          const parsed = JSON.parse(product.features);
                          featuresList = Array.isArray(parsed) ? parsed : [parsed];
                        } catch {
                          featuresList = product.features.split('\n').filter(f => f.trim());
                        }
                      }
                      return featuresList.map((feature, index) => (
                        <li key={index}>
                          <Icons.Check size={16} /> {feature}
                        </li>
                      ));
                    })()}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <ReviewsSection productId={product.id} product={product} />
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="tab-pane">
                <h3>Informations de livraison</h3>
                <div className="shipping-info">
                  <p><strong>Livraison standard:</strong> 2-3 jours ouvrés - Gratuite > 1000 MAD, sinon 50 MAD</p>
                  <p><strong>Livraison express:</strong> 24h - 150 MAD</p>
                  <p><strong>Retrait en magasin:</strong> Gratuit - disponible sous 2h</p>
                  <p><strong>Retours:</strong> Gratuits sous 14 jours</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="related-products">
            <h3>Produits similaires</h3>
            <div className="products-grid">
              {related.map(relatedProduct => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct} 
                  onAddToCart={addToCart}
                  onViewDetails={() => handleRelatedProductClick(relatedProduct.slug)}
                  isFavorite={checkIsFavorite(relatedProduct.id)}
                  onToggleFavorite={toggleFavorite}
                  isPro={isPro}
                  proDiscount={proDiscount}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== CATEGORIES PAGE ====================
const CategoriesPage = ({ navigate }) => {
  const { categories, loading: productsLoading } = useProducts();
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    if (categories.length > 0) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => setLoading(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [categories]);

  const getCategoryImage = (category) => {
    const images = {
      'Microscopes': 'https://images.unsplash.com/photo-1582719508461-905c673ccfd8?w=800&auto=format',
      'Centrifugeuses': 'https://images.unsplash.com/photo-1576086213368-97a306c9e7ab?w=800&auto=format',
      'Étuves': 'https://images.unsplash.com/photo-1579154204601-01588f4c2d3b?w=800&auto=format',
      'Balances': 'https://images.unsplash.com/photo-1581093458791-9d15429632d8?w=800&auto=format',
      'Instrumentation': 'https://images.unsplash.com/photo-1581093458791-9d15429632d8?w=800&auto=format',
      'Réactifs': 'https://images.unsplash.com/photo-1582719508461-905c673ccfd8?w=800&auto=format',
      'Verre': 'https://images.unsplash.com/photo-1576086213368-97a306c9e7ab?w=800&auto=format'
    };
    return images[category.name] || category.image || `https://source.unsplash.com/800x600/?laboratory,${encodeURIComponent(category.name)}`;
  };

  if (loading) {
    return (
      <motion.div 
        className="categories-page redesigned"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="page-header modern">
          <div className="container">
            <h1>Catégories</h1>
            <p>Explorez notre gamme complète de produits par catégorie</p>
          </div>
        </div>
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des catégories...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (categories.length === 0) {
    return (
      <motion.div 
        className="categories-page redesigned"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="page-header modern">
          <div className="container">
            <h1>Catégories</h1>
            <p>Explorez notre gamme complète de produits par catégorie</p>
          </div>
        </div>
        <div className="container">
          <div className="empty-state">
            <Icons.Package size={64} />
            <h2>Aucune catégorie trouvée</h2>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="categories-page redesigned"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="page-header modern">
        <div className="container">
          <h1>Catégories</h1>
          <p>Explorez notre gamme complète de produits par catégorie</p>
        </div>
      </div>

      <div className="container">
        <div className="categories-grid modern">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="category-card modern"
              variants={slideUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -12 }}
              onHoverStart={() => setHoveredCategory(category.id)}
              onHoverEnd={() => setHoveredCategory(null)}
              onClick={() => navigate(`/products?category=${category.id}`)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <div className="category-image-container">
                    <img 
                      src={getCategoryImage(category)} 
                      alt={category.name}
                      className="category-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/800x600?text=${encodeURIComponent(category.name)}`;
                      }}
                    />
                    <div className="image-overlay"></div>
                  </div>
                  <div className="category-content">
                    <h3>{category.name}</h3>
                    <div className="category-stats">
                      <span className="product-count">
                        <Icons.Package size={14} />
                        {category.products_count || 0} produits
                      </span>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  className="card-back"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCategory === category.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4>{category.name}</h4>
                  <p>{category.description || `Découvrez tous nos produits dans la catégorie ${category.name.toLowerCase()}`}</p>
                  <div className="back-footer">
                    <span className="explore-link">
                      Explorer <Icons.ChevronRight size={16} />
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ==================== CART PAGE ====================
// ==================== CART PAGE WITH PRO DISCOUNT ====================
const CartPage = ({ navigate }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { validateCoupon, appliedCoupon, discount, removeCoupon } = useCoupons();
  const { isAuthenticated, isPro, proDiscount } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Calculate totals with pro discount consideration
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      // Use the price that's already discounted from API
      return sum + (item.price * item.quantity);
    }, 0);
  };

  const calculateOriginalSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      // Use original price if available
      const originalPrice = item.original_price || item.price;
      return sum + (originalPrice * item.quantity);
    }, 0);
  };

  const calculateProSavings = () => {
    return cartItems.reduce((sum, item) => {
      if (item.original_price && item.original_price > item.price) {
        return sum + ((item.original_price - item.price) * item.quantity);
      }
      return sum;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const originalSubtotal = calculateOriginalSubtotal();
  const proSavings = calculateProSavings();
  
  const discountAmount = typeof discount === 'number' ? discount : parseFloat(discount) || 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shipping = subtotalAfterDiscount > 1000 ? 0 : 50;
  const tax = subtotalAfterDiscount * 0.20; // 20% TVA
  const grandTotal = subtotalAfterDiscount + shipping + tax;

  const formatPrice = (value) => {
    const num = typeof value === 'number' ? value : parseFloat(value) || 0;
    return num.toFixed(2);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Veuillez entrer un code promo');
      return;
    }

    setApplyingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      await validateCoupon(couponCode, subtotal);
      setCouponCode('');
      setCouponSuccess('✅ Coupon appliqué avec succès!');
      setTimeout(() => setCouponSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Coupon error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Code promo invalide';
      setCouponError(errorMessage);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess('');
    setCouponError('');
  };

  if (cartItems.length === 0) {
    return (
      <motion.div 
        className="cart-page empty-cart"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container">
          <Icons.ShoppingBag size={64} />
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos produits et commencez vos achats</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Voir les produits
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="cart-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <h1>Mon Panier</h1>

        {/* Pro Discount Banner */}
        {isPro && proSavings > 0 && (
          <div className="pro-discount-banner">
            <div className="pro-banner-content">
              <Icons.Percent size={24} />
              <div>
                <h3>Économies PRO -{proDiscount}%</h3>
                <p>Vous économisez <strong>{formatPrice(proSavings)} MAD</strong> sur ce panier</p>
              </div>
            </div>
          </div>
        )}

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.cart_item_id} className="cart-item">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  onClick={() => navigate(`/product/${item.slug}`)} 
                  style={{ cursor: 'pointer' }} 
                />
                
                <div className="item-details">
                  <h3 onClick={() => navigate(`/product/${item.slug}`)} style={{ cursor: 'pointer' }}>
                    {item.name}
                  </h3>
                  
                  {/* Price display with pro discount */}
                  <div className="item-price-section">
                    {item.original_price && item.original_price > item.price ? (
                      <>
                        <span className="current-price">{formatPrice(item.price)} MAD</span>
                        <span className="original-price">{formatPrice(item.original_price)} MAD</span>
                        {isPro && (
                          <span className="pro-discount-badge">
                            -{proDiscount}% PRO
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="item-price">{formatPrice(item.price)} MAD</span>
                    )}
                  </div>
                  
                  {item.stock < 5 && (
                    <span className="low-stock-warning">
                      Plus que {item.stock} en stock
                    </span>
                  )}
                </div>

                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Icons.Minus />
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    <Icons.Plus />
                  </button>
                </div>

                <div className="item-total">
                  <span className="total-label">Total:</span>
                  <span className="total-value">{formatPrice(item.price * item.quantity)} MAD</span>
                  {item.original_price && (
                    <span className="original-total">
                      {formatPrice(item.original_price * item.quantity)} MAD
                    </span>
                  )}
                </div>

                <button 
                  className="remove-item"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Icons.Trash />
                </button>
              </div>
            ))}

            <div className="cart-actions">
              <button onClick={clearCart} className="clear-cart">
                <Icons.Trash /> Vider le panier
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <h3>Récapitulatif</h3>
            
            <div className="coupon-section">
              {!appliedCoupon ? (
                <>
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Code promo"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={applyingCoupon}
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                      className="apply-coupon-btn"
                    >
                      {applyingCoupon ? '...' : 'Appliquer'}
                    </button>
                  </div>
                  {couponError && (
                    <div className="coupon-error-message">
                      <Icons.X size={14} />
                      <span>{couponError}</span>
                    </div>
                  )}
                  {couponSuccess && (
                    <div className="coupon-success-message">
                      <Icons.Check size={14} />
                      <span>{couponSuccess}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="applied-coupon">
                  <div className="coupon-info">
                    <span className="coupon-tag">
                      <Icons.Percent size={14} />
                      {appliedCoupon.code}
                    </span>
                    <span className="coupon-discount">
                      -{formatPrice(discountAmount)} MAD
                    </span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="remove-coupon" title="Retirer le coupon">
                    <Icons.X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Detailed summary with pro discount breakdown */}
            <div className="summary-details">
              {isPro && originalSubtotal > subtotal && (
                <>
                  <div className="summary-row">
                    <span>Sous-total (Prix public)</span>
                    <span className="original-price-text">{formatPrice(originalSubtotal)} MAD</span>
                  </div>
                  <div className="summary-row pro-discount">
                    <span>
                      Réduction PRO (-{proDiscount}%)
                      <span className="pro-badge-small">PRO</span>
                    </span>
                    <span className="discount-amount">-{formatPrice(proSavings)} MAD</span>
                  </div>
                </>
              )}
              
              <div className="summary-row">
                <span>Sous-total après réduction PRO</span>
                <span>{formatPrice(subtotal)} MAD</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Réduction coupon ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discountAmount)} MAD</span>
                </div>
              )}
              
              <div className="summary-row">
                <span>Sous-total final</span>
                <span>{formatPrice(subtotalAfterDiscount)} MAD</span>
              </div>
              
              <div className="summary-row">
                <span>Livraison</span>
                <span>{shipping === 0 ? 'Gratuite' : `${formatPrice(shipping)} MAD`}</span>
              </div>

              <div className="summary-row">
                <span>TVA (20%)</span>
                <span>{formatPrice(tax)} MAD</span>
              </div>
              
              <div className="summary-row total">
                <span>Total TTC</span>
                <span>{formatPrice(grandTotal)} MAD</span>
              </div>

              {shipping === 0 && (
                <div className="free-shipping-note">
                  <Icons.Truck size={16} />
                  <span>Livraison gratuite (commande > 1000 MAD)</span>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <button 
                className="checkout-btn" 
                onClick={() => navigate('/checkout')}
              >
                Passer la commande
              </button>
            ) : (
              <div className="checkout-login">
                <p>Connectez-vous pour finaliser votre commande</p>
                <button className="login-btn" onClick={() => navigate('/login')}>
                  Se connecter
                </button>
                <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Créer un compte</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== LOGIN PAGE ====================
// ==================== LOGIN PAGE CORRIGÉ ====================
const LoginPage = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { addToCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      
      // ✅ Vérifier s'il y a un favori en attente
      const pendingFavorite = localStorage.getItem('pending_favorite');
      // ✅ Vérifier s'il y a un article de panier en attente
      const pendingItem = localStorage.getItem('pending_cart_item');
      
      if (pendingFavorite) {
        try {
          const favoriteData = JSON.parse(pendingFavorite);
          await api.post(`/favorites/${favoriteData.product_id}`);
          localStorage.removeItem('pending_favorite');
          alert(`✅ "${favoriteData.product_name || 'Produit'}" ajouté à vos favoris !`);
        } catch (err) {
          console.error('Failed to add pending favorite:', err);
        }
      }
      
      if (pendingItem) {
        try {
          const item = JSON.parse(pendingItem);
          await addToCart(item.product, item.quantity, navigate);
          localStorage.removeItem('pending_cart_item');
          alert('Article ajouté à votre panier !');
          navigate('/cart');
        } catch (err) {
          console.error('Failed to add pending item:', err);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="auth-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <motion.div className="auth-box" variants={slideUp}>
          <h2>Connexion</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="auth-link">
            Pas encore de compte ? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>S'inscrire</a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
// ==================== REGISTER PAGE ====================
const RegisterPage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="auth-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <motion.div className="auth-box" variants={slideUp}>
          <h2>Inscription</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom complet</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Téléphone</label>
              <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Votre numéro de téléphone"
              />
            </div>

            <div className="form-group">
              <label>Adresse</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Votre adresse complète"
              />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <input 
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>

          <p className="auth-link">
            Déjà un compte ? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Se connecter</a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ==================== DASHBOARD PAGE ====================
const DashboardPage = ({ navigate }) => {
  const { user, logout, updateProfile, resendVerification } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      if (response.data.success && response.data.data) {
        setOrders(response.data.data.data || response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationLoading(true);
    setVerificationMessage('');
    
    try {
      const response = await resendVerification();
      console.log('Resend response:', response);
      
      if (response && response.success) {
        setVerificationMessage('Email de vérification renvoyé avec succès !');
      } else {
        setVerificationMessage('Email de vérification renvoyé avec succès !');
      }
    } catch (err) {
      console.error('Resend error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de l\'envoi';
      setVerificationMessage(errorMessage);
    } finally {
      setVerificationLoading(false);
      setTimeout(() => setVerificationMessage(''), 5000);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'en cours': return 'status-pending';
      case 'expédiée': return 'status-shipped';
      case 'livré': return 'status-delivered';
      case 'annulée': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'en cours': return 'En cours';
      case 'expédiée': return 'Expédiée';
      case 'livré': return 'Livrée';
      case 'annulée': return 'Annulée';
      default: return status;
    }
  };

  return (
    <motion.div 
      className="dashboard-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <h1>Mon Compte</h1>
        
        {!user?.email_verified_at && (
          <div className="verification-banner">
            <p>Votre email n'est pas vérifié. Veuillez vérifier votre boîte de réception.</p>
            <button 
              onClick={handleResendVerification}
              disabled={verificationLoading}
              className="resend-btn"
            >
              {verificationLoading ? 'Envoi...' : 'Renvoyer l\'email'}
            </button>
            {verificationMessage && <p className="verification-message">{verificationMessage}</p>}
          </div>
        )}

        <div className="dashboard-layout">
          <div className="dashboard-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                <Icons.User />
              </div>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>

            <ul className="dashboard-menu">
              <li className={activeTab === 'profile' ? 'active' : ''}>
                <button onClick={() => setActiveTab('profile')}>Mon Profil</button>
              </li>
              <li className={activeTab === 'orders' ? 'active' : ''}>
                <button onClick={() => setActiveTab('orders')}>Mes Commandes</button>
              </li>
              <li>
                <button onClick={logout}>Déconnexion</button>
              </li>
            </ul>
          </div>

          <div className="dashboard-content">
            {activeTab === 'profile' && (
              <div className="profile-tab">
                <div className="tab-header">
                  <h2>Mon Profil</h2>
                  {!editMode && (
                    <button 
                      className="edit-btn" 
                      onClick={() => setEditMode(true)}
                    >
                      Modifier
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleUpdate} className="profile-form">
                    <div className="form-group">
                      <label>Nom</label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Téléphone</label>
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Votre numéro de téléphone"
                      />
                    </div>

                    <div className="form-group">
                      <label>Adresse</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows="3"
                        placeholder="Votre adresse complète"
                      />
                    </div>

                    <div className="form-actions">
                      <button 
                        type="submit"
                        className="save-btn"
                        disabled={loading}
                      >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => {
                          setEditMode(false);
                          setFormData({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || '',
                            address: user?.address || ''
                          });
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info">
                    <div className="info-row">
                      <strong>Nom:</strong>
                      <span>{user?.name}</span>
                    </div>
                    <div className="info-row">
                      <strong>Email:</strong>
                      <span>{user?.email}</span>
                    </div>
                    <div className="info-row">
                      <strong>Téléphone:</strong>
                      <span>{user?.phone || 'Non renseigné'}</span>
                    </div>
                    <div className="info-row">
                      <strong>Adresse:</strong>
                      <span>{user?.address || 'Non renseignée'}</span>
                    </div>
                    <div className="info-row">
                      <strong>Email vérifié:</strong>
                      <span className={user?.email_verified_at ? 'verified' : 'not-verified'}>
                        {user?.email_verified_at ? 'Oui' : 'Non'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-tab">
                <h2>Mes Commandes</h2>
                
                {loading ? (
                  <div className="loading-spinner">Chargement de vos commandes...</div>
                ) : orders.length === 0 ? (
                  <div className="no-orders">
                    <Icons.Package size={48} />
                    <p>Aucune commande pour le moment</p>
                    <button 
                      className="btn-primary" 
                      onClick={() => navigate('/products')}
                    >
                      Découvrir nos produits
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <motion.div 
                        key={order.id} 
                        className="order-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <div className="order-header">
                          <div className="order-header-left">
                            <span className="order-id">Commande #{order.order_number}</span>
                            <span className="order-date">
                              {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <span className={`order-status ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <div className="order-items">
                          {order.items && order.items.slice(0, 3).map((item, i) => (
                            <div key={i} className="order-item">
                              <span className="item-name">{item.product_name}</span>
                              <span className="item-quantity">x{item.quantity}</span>
                              <span className="item-price">{(item.price * item.quantity).toFixed(2)} MAD</span>
                            </div>
                          ))}
                          {order.items && order.items.length > 3 && (
                            <div className="more-items">
                              + {order.items.length - 3} autre(s) article(s)
                            </div>
                          )}
                        </div>

                        <div className="order-footer">
                          <div className="order-total">
                            <span>Total:</span>
                            <strong>{order.total} MAD</strong>
                          </div>
                          {order.payment_method === 'espèces' && (
                            <span className="payment-badge">
                              <Icons.Truck size={14} />
                              Paiement à la livraison
                            </span>
                          )}
                          {order.coupon && (
                            <span className="coupon-badge">
                              Coupon: {order.coupon.code}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== ORDER DETAIL PAGE ====================
// ==================== FIXED ORDER DETAIL PAGE ====================
// ==================== DEBUGGED ORDER DETAIL PAGE ====================
// ==================== FIXED ORDER DETAIL PAGE (No scroll to top) ====================
// ==================== FIXED ORDER DETAIL PAGE WITH SCROLL POSITION ====================
const OrderDetailPage = ({ navigate }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const path = window.location.pathname;
    const orderId = path.split('/').pop();
    
    if (orderId && orderId !== 'orders' && !isNaN(parseInt(orderId))) {
      fetchOrder(orderId);
    } else {
      setError('ID de commande invalide');
      setLoading(false);
    }
  }, [isAuthenticated, navigate, user]);

  const fetchOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/orders/${orderId}`);
      
      if (response.data.success && response.data.data) {
        setOrder(response.data.data);
      } else {
        setError(response.data.error || 'Commande non trouvée');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || `Erreur ${err.response.status}: La commande n'existe pas`);
      } else {
        setError('Erreur lors du chargement de la commande');
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) return;

    try {
      const response = await api.put(`/orders/${order.id}/cancel`);
      if (response.data.success) {
        fetchOrder(order.id);
        alert('Commande annulée avec succès');
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert('Erreur lors de l\'annulation de la commande');
    }
  };

  // Handle back button - SAVE SCROLL POSITION before navigating back
  const handleBack = () => {
    const currentScroll = window.scrollY;
    sessionStorage.setItem('scroll_orders', currentScroll);
    navigate('/orders');
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'en cours': return 'status-pending';
      case 'expédiée': return 'status-shipped';
      case 'livré': return 'status-delivered';
      case 'annulée': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de la commande...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="not-found">
          <Icons.AlertCircle size={64} />
          <h2>Erreur</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={handleBack}>
            Retour à mes commandes
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="not-found">
        <Icons.Package size={64} />
        <h2>Commande non trouvée</h2>
        <p>La commande que vous recherchez n'existe pas ou a été supprimée.</p>
        <button className="btn-primary" onClick={handleBack}>
          Voir mes commandes
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="container">
        <div className="order-detail-header">
          <button onClick={handleBack} className="back-btn">
            ← Retour aux commandes
          </button>
          <h1>Commande #{order.order_number}</h1>
          <span className={`order-status ${getStatusClass(order.status)}`}>
            {order.status === 'en cours' ? 'En cours' : 
             order.status === 'expédiée' ? 'Expédiée' :
             order.status === 'livré' ? 'Livrée' : 'Annulée'}
          </span>
        </div>

        <div className="order-info-grid">
          <div className="info-card">
            <h3>Date de commande</h3>
            <p>{new Date(order.created_at).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>

          <div className="info-card">
            <h3>Adresse de livraison</h3>
            <p>{order.shipping_address || 'Non renseignée'}</p>
          </div>

          <div className="info-card">
            <h3>Mode de paiement</h3>
            <p>{order.payment_method === 'carte' ? 'Carte bancaire' : 'Espèces à la livraison'}</p>
          </div>

          {order.coupon && (
            <div className="info-card">
              <h3>Coupon appliqué</h3>
              <p><strong>{order.coupon.code}</strong> - {order.discount_amount} MAD de réduction</p>
            </div>
          )}
        </div>

        <div className="order-items-section">
          <h2>Articles commandés</h2>
          <div className="items-table-container">
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Prix unitaire</th>
                  <th>Quantité</th>
                  <th>Total</th>
                  </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="product-info-cell">
                          <span>{item.product_name}</span>
                        </div>
                      </td>
                      <td>{parseFloat(item.price).toFixed(2)} MAD</td>
                      <td>{item.quantity}</td>
                      <td>{(parseFloat(item.price) * item.quantity).toFixed(2)} MAD</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">Aucun article dans cette commande</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-right">Sous-total:</td>
                  <td>{parseFloat(order.subtotal).toFixed(2)} MAD</td>
                </tr>
                {order.discount_amount > 0 && (
                  <tr>
                    <td colSpan="3" className="text-right discount">Réduction:</td>
                    <td className="discount">-{parseFloat(order.discount_amount).toFixed(2)} MAD</td>
                  </tr>
                )}
                <tr>
                  <td colSpan="3" className="text-right">Livraison:</td>
                  <td>{order.shipping > 0 ? `${parseFloat(order.shipping).toFixed(2)} MAD` : 'Gratuite'}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-right">TVA (20%):</td>
                  <td>{parseFloat(order.tax).toFixed(2)} MAD</td>
                </tr>
                <tr className="total-row">
                  <td colSpan="3" className="text-right"><strong>Total TTC:</strong></td>
                  <td><strong>{parseFloat(order.total).toFixed(2)} MAD</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {order.status === 'en cours' && (
          <div className="order-actions">
            <button className="cancel-order-btn" onClick={cancelOrder}>
              Annuler la commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
// ==================== VERIFICATION SUCCESS PAGE ====================
const VerificationSuccessPage = ({ navigate }) => {
  const { checkVerification } = useAuth();
  
  useEffect(() => {
    const refreshUser = async () => {
      if (checkVerification) {
        await checkVerification();
      }
      
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

      return () => clearTimeout(timer);
    };
    
    refreshUser();
  }, [navigate, checkVerification]);

  return (
    <motion.div 
      className="verification-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <div className="verification-box success">
          <Icons.Check size={64} />
          <h1>Email vérifié avec succès !</h1>
          <p>Votre email a été vérifié. Vous allez être redirigé vers votre tableau de bord.</p>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== VERIFICATION ERROR PAGE ====================
const VerificationErrorPage = ({ navigate }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const errorMessage = searchParams.get('message') || 'Le lien de vérification est invalide ou a expiré';

  return (
    <motion.div 
      className="verification-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <div className="verification-box error">
          <Icons.X size={64} />
          <h1>Vérification échouée</h1>
          <p>{errorMessage}</p>
          <p>Veuillez demander un nouveau lien de vérification depuis votre tableau de bord.</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/login')}
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== ORDERS PAGE ====================
// ==================== FIXED ORDERS PAGE ====================
// ==================== FIXED ORDERS PAGE (No scroll to top) ====================
// ==================== FIXED ORDERS PAGE WITH DATA CACHING ====================
const OrdersPage = ({ navigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cachedOrders, setCachedOrders] = useState([]);
  const [hasRestored, setHasRestored] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Check cache first
      const cached = sessionStorage.getItem('cached_orders');
      if (cached) {
        const parsed = JSON.parse(cached);
        setCachedOrders(parsed);
        setOrders(parsed);
      }
      fetchOrders();
    }
  }, [isAuthenticated, navigate]);

  // Save orders to cache when loaded
  useEffect(() => {
    if (orders.length > 0 && !isInitialLoad) {
      sessionStorage.setItem('cached_orders', JSON.stringify(orders));
      setCachedOrders(orders);
    }
  }, [orders, isInitialLoad]);

  // RESTORE SCROLL POSITION WHEN COMPONENT MOUNTS
  useEffect(() => {
    if (!hasRestored && !loading) {
      const savedPosition = sessionStorage.getItem('scroll_orders');
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedPosition), behavior: 'instant' });
          sessionStorage.removeItem('scroll_orders');
          console.log('✅ Restored orders scroll position:', parseInt(savedPosition));
        }, 150);
      }
      setHasRestored(true);
    }
    setIsInitialLoad(false);
  }, [loading, hasRestored]);

  // Save scroll position and cache before leaving
  useEffect(() => {
    return () => {
      // Save scroll position
      const scrollY = window.scrollY;
      sessionStorage.setItem('scroll_orders', scrollY);
      console.log('💾 Saved orders scroll on unmount:', scrollY);
      
      // Save orders to cache
      if (orders.length > 0) {
        sessionStorage.setItem('cached_orders', JSON.stringify(orders));
      }
    };
  }, [orders]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🚀 Fetching orders...');
      const response = await api.get('/orders');
      console.log('📦 Orders response:', response.data);
      
      if (response.data.success && response.data.data) {
        const ordersData = response.data.data.data || response.data.data || [];
        console.log('✅ Orders loaded:', ordersData.length, 'orders');
        setOrders(ordersData);
      } else {
        setError('Erreur lors du chargement des commandes');
      }
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err);
      console.error('🔴 Error details:', err.response?.data);
      setError(err.response?.data?.error || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Handle order click - SAVE SCROLL POSITION before navigating
  const handleOrderClick = (orderId) => {
    console.log('🔍 Navigating to order detail:', orderId);
    // Save current scroll position before navigation
    const currentScroll = window.scrollY;
    sessionStorage.setItem('scroll_orders', currentScroll);
    navigate(`/orders/${orderId}`);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'en cours': return 'status-pending';
      case 'expédiée': return 'status-shipped';
      case 'livré': return 'status-delivered';
      case 'annulée': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'en cours': return 'En cours';
      case 'expédiée': return 'Expédiée';
      case 'livré': return 'Livrée';
      case 'annulée': return 'Annulée';
      default: return status;
    }
  };

  // Show cached data while loading
  const displayOrders = orders.length > 0 ? orders : cachedOrders;
  const isLoading = loading && displayOrders.length === 0;

  if (loading && displayOrders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <h1>Mes Commandes</h1>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement de vos commandes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && displayOrders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <h1>Mes Commandes</h1>
          <div className="error-container">
            <Icons.AlertCircle size={48} />
            <p>{error}</p>
            <button className="btn-primary" onClick={fetchOrders}>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (displayOrders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <h1>Mes Commandes</h1>
          <div className="no-orders">
            <Icons.Package size={64} />
            <h2>Aucune commande</h2>
            <p>Vous n'avez pas encore passé de commande</p>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/products')}
            >
              Découvrir nos produits
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>Mes Commandes</h1>

        <div className="orders-grid">
          {displayOrders.map(order => {
            console.log('📦 Order:', order.id, order.order_number, order);
            return (
              <div
                key={order.id}
                className="order-card"
                onClick={() => handleOrderClick(order.id)}
              >
                <div className="order-header">
                  <div className="order-header-left">
                    <h3>Commande #{order.order_number || order.id}</h3>
                    <span className="order-date">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="order-items-preview">
                  {order.items && order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="order-item-preview">
                      <span className="item-name">{item.product_name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                  ))}
                  {order.items && order.items.length > 3 && (
                    <div className="more-items">
                      + {order.items.length - 3} autre(s) article(s)
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>{parseFloat(order.total).toFixed(2)} MAD</strong>
                  </div>
                  {order.payment_method === 'espèces' && (
                    <span className="payment-badge">
                      <Icons.Truck size={14} />
                      Paiement à la livraison
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <button 
          className="refresh-btn" 
          onClick={fetchOrders}
          style={{ marginTop: '20px', padding: '10px 20px' }}
        >
          <Icons.RefreshCw size={16} /> Actualiser
        </button>
      </div>
    </div>
  );
};
// ==================== CHECKOUT PAGE ====================
const CheckoutPage = ({ navigate }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated, isEmailVerified } = useAuth();
  const { appliedCoupon, discount, removeCoupon } = useCoupons();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
    notes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const subtotal = typeof cartTotal === 'number' ? cartTotal : parseFloat(cartTotal) || 0;
  const discountAmount = typeof discount === 'number' ? discount : parseFloat(discount) || 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shipping = subtotalAfterDiscount > 1000 ? 0 : 50;
  const tax = subtotalAfterDiscount * 0.2;
  const grandTotal = subtotalAfterDiscount + shipping + tax;

  const formatPrice = (value) => {
    const num = typeof value === 'number' ? value : parseFloat(value) || 0;
    return num.toFixed(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isEmailVerified) {
      setError('Veuillez vérifier votre email avant de passer commande');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Veuillez entrer votre numéro de téléphone');
      return;
    }

    if (!formData.address.trim()) {
      setError('Veuillez entrer votre adresse de livraison');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: formData.address,
        phone: formData.phone,
        notes: formData.notes,
        payment_method: 'espèces',
        coupon_code: appliedCoupon?.code
      };

      console.log('📦 Submitting order:', orderData);

      const response = await api.post('/orders', orderData);
      
      if (response.data.success) {
        setSuccess(true);
        clearCart();
        removeCoupon();
        setTimeout(() => {
          const orderId = response.data.data.order?.id || response.data.data.id;
          navigate(`/orders/${orderId}`);
        }, 3000);
      } else {
        throw new Error(response.data.error || 'Erreur lors de la création de la commande');
      }
    } catch (err) {
      console.error('❌ Order error:', err);
      setError(err.response?.data?.error || err.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        className="checkout-page"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container">
          <div className="auth-required">
            <Icons.User size={64} />
            <h2>Connexion requise</h2>
            <p>Vous devez être connecté pour passer commande</p>
            <div className="auth-buttons">
              <button className="btn-primary" onClick={() => navigate('/login')}>
                Se connecter
              </button>
              <button className="btn-secondary" onClick={() => navigate('/register')}>
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div 
        className="checkout-page empty-checkout"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container">
          <Icons.ShoppingBag size={64} />
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des produits avant de passer commande</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Voir les produits
          </button>
        </div>
      </motion.div>
    );
  }

  if (success) {
    return (
      <motion.div 
        className="checkout-page success-checkout"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container">
          <Icons.Check size={64} />
          <h2>Commande réussie !</h2>
          <p>Votre commande a été créée avec succès. Vous allez être redirigé...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="checkout-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <h1>Finaliser la commande</h1>

        {!isEmailVerified && (
          <div className="warning-message">
            <Icons.Mail />
            <span>Veuillez vérifier votre email avant de passer commande</span>
          </div>
        )}

        {appliedCoupon && (
          <div className="applied-coupon-checkout">
            <div className="coupon-info">
              <Icons.Percent size={16} />
              <span>Coupon appliqué: <strong>{appliedCoupon.code}</strong></span>
              <span className="discount-amount">-{formatPrice(discountAmount)} MAD</span>
            </div>
            <button onClick={removeCoupon} className="remove-coupon-small">
              <Icons.X size={14} /> Retirer
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="checkout-layout">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h2>Informations de contact</h2>
                
                <div className="form-group">
                  <label>Numéro de téléphone <span className="required">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Ex: 06 12 34 56 78"
                  />
                </div>

                <div className="form-group">
                  <label>Adresse de livraison <span className="required">*</span></label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Entrez votre adresse complète (rue, ville, code postal)"
                  />
                </div>

                <div className="form-group">
                  <label>Notes supplémentaires (optionnel)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Instructions de livraison, etc."
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Mode de paiement</h2>
                <div className="payment-info">
                  <div className="payment-method-selected">
                    <Icons.Truck />
                    <span>Paiement à la livraison (Espèces)</span>
                  </div>
                  <p className="payment-description">
                    Vous paierez en espèces lors de la réception de votre commande.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={loading || !isEmailVerified}
              >
                {loading ? 'Traitement...' : `Confirmer la commande (${formatPrice(grandTotal)} MAD)`}
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h3>Récapitulatif de la commande</h3>
            
            <div className="summary-items">
              {cartItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <span className="item-name">{item.name} x{item.quantity}</span>
                  <span className="item-price">{formatPrice(item.price * item.quantity)} MAD</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)} MAD</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Réduction ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discountAmount)} MAD</span>
                </div>
              )}
              
              <div className="summary-row">
                <span>Livraison</span>
                <span>{shipping === 0 ? 'Gratuite' : `${formatPrice(shipping)} MAD`}</span>
              </div>
              
              <div className="summary-row">
                <span>TVA (20%)</span>
                <span>{formatPrice(tax)} MAD</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(grandTotal)} MAD</span>
              </div>
            </div>

            <div className="delivery-note">
              <Icons.Truck />
              <p>Livraison estimée: 2-3 jours ouvrés</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== ABOUT PAGE ====================
const AboutPage = () => {
  const stats = [
    { icon: Icons.Star, value: '20+', label: "Années d'expérience" },
    { icon: Icons.Users, value: '500+', label: 'Clients professionnels' },
    { icon: Icons.Package, value: '1200+', label: 'Produits disponibles' },
    { icon: Icons.Truck, value: '48h', label: 'Délai de livraison' }
  ];

  const categories = [
    {
      title: '🧪 Tubes de Prélèvement',
      description: 'Tubes PRP, tubes gel, tubes secs et toute la gamme de tubes vacutainer pour l\'analyse biologique et la médecine régénérative.',
      icon: '🧪'
    },
    {
      title: '💉 Aiguilles & Accessoires',
      description: 'Aiguilles de prélèvement, systèmes de collecte sécurisés, lancettes et accessoires pour chaque protocole clinique.',
      icon: '💉'
    },
    {
      title: '🏺 Consommables de Laboratoire',
      description: 'Pipettes, embouts, plaques, tubes Eppendorf, milieux de culture et tout le consommable quotidien de vos laboratoires.',
      icon: '🏺'
    },
    {
      title: '⚗️ Réactifs de Laboratoire',
      description: 'Réactifs pour biochimie, hématologie, immunologie, sérologie et microbiologie, compatibles avec les automates du marché.',
      icon: '⚗️'
    },
    {
      title: '🔬 Analyseurs de Laboratoire',
      description: 'Automates d\'hématologie, biochimie, immunologie et urines. Installation, maintenance et formation incluses.',
      icon: '🔬'
    },
    {
      title: '⚙️ Équipements de Laboratoire',
      description: 'Centrifugeuses, réfrigérateurs médicaux, hottes, autoclaves, microscopes et équipements de protection individuelle.',
      icon: '⚙️'
    }
  ];

  const whyChooseUs = [
    {
      title: '🏅 Produits Certifiés & Homologués',
      description: 'Tous nos produits sont conformes aux normes CE, ISO et aux exigences du Ministère de la Santé marocain.'
    },
    {
      title: '🚚 Livraison Rapide Partout au Maroc',
      description: 'Réseau logistique couvrant l\'ensemble du territoire national avec un délai garanti de 24 à 48 heures.'
    },
    {
      title: '💰 Tarifs Professionnels Exclusifs',
      description: 'Programme de tarification dédié aux professionnels agréés avec remises progressives selon le volume de commande.'
    },
    {
      title: '🎓 Expertise & Conseil Technique',
      description: 'Une équipe de techniciens qualifiés disponible pour vous conseiller, former et assurer la maintenance de vos équipements.'
    },
    {
      title: '🔄 Stock Permanent & Disponibilité',
      description: 'Plus de 1 200 références disponibles en stock permanent pour garantir la continuité de vos activités sans interruption.'
    },
    {
      title: '🤝 Relation Durable & Service Après-Vente',
      description: 'Un interlocuteur dédié pour chaque client professionnel, un SAV réactif et un accompagnement sur le long terme.'
    }
  ];

  const values = [
    {
      title: 'Notre Mission',
      description: 'Fournir aux professionnels de santé marocains des équipements, réactifs et consommables de laboratoire de haute qualité, avec un service client réactif et des délais de livraison fiables sur l\'ensemble du territoire national.',
      icon: '🎯'
    },
    {
      title: 'Notre Vision',
      description: 'Devenir la référence incontournable pour l\'approvisionnement en matériel médico-laboratoire au Maroc, en construisant des partenariats durables fondés sur la confiance, l\'expertise et l\'innovation continue.',
      icon: '🔭'
    },
    {
      title: 'Nos Valeurs',
      description: 'Qualité sans compromis, intégrité dans chaque transaction, réactivité face aux besoins de nos clients, et engagement constant pour l\'amélioration de la santé au Maroc.',
      icon: '💎'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const scaleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  return (
    <motion.div 
      className="about-page-enhanced"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
    >
      <motion.section 
        className="about-hero-enhanced"
        variants={containerVariants}
      >
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div 
            className="hero-content-enhanced"
            variants={containerVariants}
          >
            <motion.span 
              className="hero-badge-enhanced"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              🧬 À Propos de Nous
            </motion.span>
            
            <motion.h1 
              variants={itemVariants}
            >
              Votre Partenaire de
              <motion.span 
                className="highlight-text"
                animate={{ 
                  textShadow: ["0 0 0 rgba(109, 158, 235, 0)", "0 0 20px rgba(109, 158, 235, 0.5)", "0 0 0 rgba(109, 158, 235, 0)"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Confiance
              </motion.span>
              <br />en Laboratoire
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle-enhanced"
              variants={itemVariants}
            >
              Depuis notre création, TECLAB accompagne les professionnels de la santé avec des 
              solutions de qualité supérieure pour les laboratoires, cliniques et établissements 
              médicaux au Maroc.
            </motion.p>
          </motion.div>
        </div>
        
        <motion.div 
          className="floating-element element-1"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="floating-element element-2"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div 
          className="floating-element element-3"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </motion.section>

      <motion.section 
        className="about-stats-enhanced"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container">
          <div className="stats-grid-enhanced">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-item-enhanced"
                variants={scaleVariants}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
                }}
              >
                <motion.div 
                  className="stat-icon-enhanced"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon size={40} />
                </motion.div>
                <motion.div 
                  className="stat-value-enhanced"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    delay: 0.2 + index * 0.1
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="stat-label-enhanced">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="about-history-enhanced"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container">
          <div className="history-grid-enhanced">
            <motion.div 
              className="history-text-enhanced"
              variants={itemVariants}
            >
              <motion.h2
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                Notre Histoire
              </motion.h2>
              
              <motion.h3
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              >
                Qui sommes-nous ?
              </motion.h3>
              
              <motion.p
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              >
                TECLAB est une entreprise marocaine spécialisée dans la distribution de matériel 
                et de consommables pour les laboratoires d'analyse médicale, les cliniques, les 
                cabinets médicaux et les établissements de santé.
              </motion.p>
              
              <motion.p
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
              >
                Fondée avec une ambition claire — rendre accessible aux professionnels de santé 
                marocains des produits de haute qualité à des prix compétitifs — TECLAB s'est 
                imposée comme un acteur incontournable du secteur médical au Maroc.
              </motion.p>
              
              <motion.p
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
              >
                Notre équipe est composée de spécialistes passionnés qui comprennent les exigences 
                du monde médical et s'engagent à fournir un service irréprochable, du conseil à 
                la livraison.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="history-badge-enhanced"
              variants={scaleVariants}
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 30px 60px rgba(109, 158, 235, 0.4)"
              }}
            >
              <motion.span 
                className="badge-icon-enhanced"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🔬
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="about-quality-enhanced"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container">
          <motion.div 
            className="quality-content-enhanced"
            variants={itemVariants}
          >
            <motion.h2
              animate={{ 
                color: ["#2c3e50", "#6d9eeb", "#2c3e50"]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Notre Engagement Qualité
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Chaque produit que nous distribuons est rigoureusement sélectionné auprès de 
              fournisseurs certifiés, garantissant fiabilité, précision et conformité aux 
              normes internationales en vigueur.
            </motion.p>
            
            <motion.div 
              className="quality-badge-enhanced"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(109, 158, 235, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="check-icon-enhanced"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                ✅
              </motion.span>
              <span>Fournisseurs certifiés ISO & CE</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="about-values-section-enhanced"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container">
          <div className="values-grid-enhanced">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="value-card-enhanced"
                variants={itemVariants}
                whileHover={{ 
                  y: -15,
                  boxShadow: "0 30px 60px rgba(109, 158, 235, 0.2)"
                }}
              >
                <motion.div 
                  className="value-icon-enhanced"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, delay: index * 0.2, repeat: Infinity }}
                >
                  {value.icon}
                </motion.div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="about-categories-enhanced"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container">
          <motion.h2 
            className="section-title-enhanced"
            variants={itemVariants}
          >
            Ce que nous proposons
          </motion.h2>
          
          <motion.p 
            className="section-subtitle-enhanced"
            variants={itemVariants}
          >
            Une gamme complète de produits et services pour répondre à tous vos besoins 
            en laboratoire et équipements médicaux.
          </motion.p>

          <div className="categories-grid-enhanced">
            {categories.map((category, index) => (
              <motion.div 
                key={index}
                className="category-card-enhanced"
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
                }}
                custom={index}
              >
                <motion.div 
                  className="category-icon-enhanced"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, delay: index * 0.1, repeat: Infinity }}
                >
                  {category.icon}
                </motion.div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="why-choose-us-enhanced"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container">
          <motion.h2 
            className="section-title-enhanced"
            variants={itemVariants}
          >
            Pourquoi choisir TECLAB ?
          </motion.h2>
          
          <motion.p 
            className="section-subtitle-enhanced"
            variants={itemVariants}
          >
            Nous ne sommes pas de simples distributeurs — nous sommes vos partenaires 
            dans l'excellence médicale.
          </motion.p>

          <div className="why-choose-grid-enhanced">
            {whyChooseUs.map((item, index) => (
              <motion.div 
                key={index}
                className="why-choose-card-enhanced"
                variants={itemVariants}
                whileHover={{ 
                  x: 10,
                  boxShadow: "0 15px 30px rgba(109, 158, 235, 0.2)"
                }}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="about-contact-enhanced"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container">
          <div className="contact-info-grid-enhanced">
            <motion.div 
              className="contact-info-card-enhanced"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <motion.h3
                animate={{ 
                  color: ["#2c3e50", "#6d9eeb", "#2c3e50"]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                Besoin d'un conseil technique ?
              </motion.h3>
              <p>
                Notre équipe spécialisée vous accompagne dans le choix de vos équipements 
                et consommables de laboratoire.
              </p>
            </motion.div>
            
            <motion.div 
              className="contact-info-card-enhanced highlight"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 30px 60px rgba(109, 158, 235, 0.4)"
              }}
            >
              <motion.div 
                className="phone-icon-enhanced"
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                📞
              </motion.div>
              
              <h4>Appelez-nous 24/7</h4>
              
              <motion.a 
                href="tel:+212808626102" 
                className="phone-number-enhanced"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                +212 808 626 102
              </motion.a>
              
              <motion.p 
                className="address-enhanced"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                654 LOT TGHAT II RTE MEKNES VILLA 30000 SECTEUR 0601, Fez, MAROC
              </motion.p>
              
              <motion.a 
                href="mailto:info@teclab.ma" 
                className="email-enhanced"
                whileHover={{ scale: 1.05, color: "#ff6b6b" }}
                whileTap={{ scale: 0.95 }}
              >
                info@teclab.ma
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};
// ==================== ADMIN PAGES ====================

// Admin Orders Page
const AdminOrdersPage = ({ navigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [isAdmin, currentPage, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await api.get(`/admin/orders?${params.toString()}`);
      if (response.data.success && response.data.data) {
        setOrders(response.data.data.data || []);
        setTotalPages(response.data.data.last_page || 1);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'en cours': return 'status-pending';
      case 'expédiée': return 'status-shipped';
      case 'livré': return 'status-delivered';
      case 'annulée': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) return <div className="loading-spinner">Chargement...</div>;

  return (
    <motion.div 
      className="admin-orders-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <div className="page-header">
          <h1>Gestion des commandes</h1>
          <button onClick={() => navigate('/admin')} className="back-btn">
            ← Retour
          </button>
        </div>

        <div className="filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="en cours">En cours</option>
            <option value="expédiée">Expédiée</option>
            <option value="livré">Livrée</option>
            <option value="annulée">Annulée</option>
          </select>
        </div>

        <div className="orders-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Client</th>
                <th>Email</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.customer?.name}</td>
                  <td>{order.customer?.email}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.total} MAD</td>
                  <td>
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`status-select ${getStatusClass(order.status)}`}
                    >
                      <option value="en cours">En cours</option>
                      <option value="expédiée">Expédiée</option>
                      <option value="livré">Livrée</option>
                      <option value="annulée">Annulée</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className="view-btn"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <Icons.ChevronLeft />
            </button>
            <span>Page {currentPage} sur {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <Icons.ChevronRight />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Admin Order Detail Page
const AdminOrderDetailPage = ({ navigate }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    const path = window.location.pathname;
    const orderId = path.split('/').pop();
    fetchOrder(orderId);
  }, [isAdmin]);

  const fetchOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (response.data.success && response.data.data) {
        setOrder(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const response = await api.put(`/admin/orders/${order.id}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        setOrder({...order, status: newStatus});
        alert('Statut mis à jour avec succès');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'en cours': return 'status-pending';
      case 'expédiée': return 'status-shipped';
      case 'livré': return 'status-delivered';
      case 'annulée': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) return <div className="loading-spinner">Chargement...</div>;
  if (!order) return <div className="not-found">Commande non trouvée</div>;

  return (
    <motion.div 
      className="admin-order-detail"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <div className="page-header">
          <button onClick={() => navigate('/admin/orders')} className="back-btn">
            ← Retour aux commandes
          </button>
          <h1>Commande #{order.order_number}</h1>
        </div>

        <div className="order-status-section">
          <span className={`status-badge-large ${getStatusClass(order.status)}`}>
            {order.status}
          </span>
          <div className="status-actions">
            <button 
              onClick={() => updateStatus('en cours')}
              className="status-btn pending"
              disabled={order.status === 'en cours'}
            >
              En cours
            </button>
            <button 
              onClick={() => updateStatus('expédiée')}
              className="status-btn shipped"
              disabled={order.status === 'expédiée'}
            >
              Expédiée
            </button>
            <button 
              onClick={() => updateStatus('livré')}
              className="status-btn delivered"
              disabled={order.status === 'livré'}
            >
              Livrée
            </button>
            <button 
              onClick={() => updateStatus('annulée')}
              className="status-btn cancelled"
              disabled={order.status === 'annulée'}
            >
              Annulée
            </button>
          </div>
        </div>

        <div className="order-details-grid">
          <div className="detail-card">
            <h3>Informations client</h3>
            <p><strong>Nom:</strong> {order.customer?.name}</p>
            <p><strong>Email:</strong> {order.customer?.email}</p>
            <p><strong>Téléphone:</strong> {order.customer?.phone || 'Non renseigné'}</p>
          </div>

          <div className="detail-card">
            <h3>Adresse de livraison</h3>
            <p>{order.shipping_address}</p>
          </div>

          <div className="detail-card">
            <h3>Informations de paiement</h3>
            <p><strong>Méthode:</strong> {order.payment_method === 'carte' ? 'Carte bancaire' : 'Espèces (COD)'}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>

          {order.coupon && (
            <div className="detail-card">
              <h3>Coupon appliqué</h3>
              <p><strong>Code:</strong> {order.coupon.code}</p>
              <p><strong>Réduction:</strong> -{order.discount_amount} MAD</p>
            </div>
          )}
        </div>

        <div className="order-items-section">
          <h2>Articles commandés</h2>
          <table className="items-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td>{item.price} MAD</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toFixed(2)} MAD</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-right">Sous-total:</td>
                <td>{order.subtotal} MAD</td>
              </tr>
              {order.discount_amount > 0 && (
                <tr>
                  <td colSpan="3" className="text-right">Réduction:</td>
                  <td>-{order.discount_amount} MAD</td>
                </tr>
              )}
              <tr>
                <td colSpan="3" className="text-right">Livraison:</td>
                <td>{order.shipping > 0 ? order.shipping + ' MAD' : 'Gratuite'}</td>
              </tr>
              <tr>
                <td colSpan="3" className="text-right">TVA (20%):</td>
                <td>{order.tax} MAD</td>
              </tr>
              <tr className="total-row">
                <td colSpan="3" className="text-right">Total:</td>
                <td><strong>{order.total} MAD</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
// ==================== ORDERS TABLE COMPONENT ====================
const OrdersTable = ({ orders, onStatusChange, onRefresh, onView, onBack, currentPage, totalPages, onPageChange }) => {
  const [statusFilter, setStatusFilter] = useState('');

  const getStatusClass = (status) => {
    switch(status) {
      case 'en cours': return 'status-pending';
      case 'expédiée': return 'status-shipped';
      case 'livré': return 'status-delivered';
      case 'annulée': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <button onClick={onBack} className="back-btn">
          <Icons.ChevronLeft size={16} /> Retour
        </button>
        <h2>Gestion des commandes</h2>
        <div className="table-filters">
          <select 
            value={statusFilter} 
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
          >
            <option value="">Tous les statuts</option>
            <option value="en cours">En cours</option>
            <option value="expédiée">Expédiée</option>
            <option value="livré">Livrée</option>
            <option value="annulée">Annulée</option>
          </select>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>N° Commande</th>
            <th>Client</th>
            <th>Date</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                Aucune commande trouvée
              </td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.id}>
                <td>#{order.order_number}</td>
                <td>
                  <div className="customer-info">
                    <strong>{order.customer?.name}</strong>
                    <small>{order.customer?.email}</small>
                  </div>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td><strong>{order.total} MAD</strong></td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className={`status-select ${getStatusClass(order.status)}`}
                  >
                    <option value="en cours">En cours</option>
                    <option value="expédiée">Expédiée</option>
                    <option value="livré">Livrée</option>
                    <option value="annulée">Annulée</option>
                  </select>
                </td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={() => onView(order)}
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <Icons.ChevronLeft />
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <Icons.ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

// ==================== PRODUCTS TABLE COMPONENT ====================
// Dans ProductsTable, améliorez l'affichage des images :

// ==================== PRODUCTS TABLE ROBUSTE ====================
// ==================== PRODUCTS TABLE COMPLETE AVEC PAGINATION ====================
// ==================== PRODUCTS TABLE COMPONENT CORRIGÉ ====================
const ProductsTable = ({ 
  products, 
  categories, 
  onAdd, 
  onEdit, 
  onDelete, 
  onRefresh, 
  onBack, 
  currentPage, 
  totalPages, 
  onPageChange,
  loading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [localProducts, setLocalProducts] = useState([]);

  // Mettre à jour les produits locaux quand les props changent
  useEffect(() => {
    console.log('📦 Produits reçus dans tableau:', products);
    
    // Formater les produits pour s'assurer qu'ils ont une structure cohérente
    const formatted = (products || []).map(product => {
      // Extraire les images de manière sécurisée
      let images = [];
      
      if (product.images_array && Array.isArray(product.images_array)) {
        images = product.images_array;
      }
      else if (product.images && Array.isArray(product.images)) {
        images = product.images.map(img => 
          typeof img === 'string' ? img : (img.image_path || img)
        );
      }
      else if (product.image) {
        images = [product.image];
      }
      
      images = images.filter(img => img && typeof img === 'string');
      
      return {
        ...product,
        id: product.id || 0,
        name: product.name || 'Sans nom',
        sku: product.sku || 'N/A',
        price: product.price || 0,
        stock: product.stock || 0,
        brand: product.brand || '',
        category: product.category || { name: 'Non catégorisé' },
        displayImages: images,
        displayImage: images[0] || 'https://via.placeholder.com/50',
        hasMultipleImages: images.length > 1,
        imagesCount: images.length
      };
    });
    
    setLocalProducts(formatted);
  }, [products]);

  // Filtrer par recherche
  const filteredProducts = localProducts.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewGallery = (product) => {
    setSelectedProduct(product);
    setShowGallery(true);
  };

  const handleAdd = () => {
    // ✅ Réinitialiser la recherche quand on ajoute
    setSearchTerm('');
    onAdd();
  };

  const handleEdit = (product) => {
    // ✅ Réinitialiser la recherche quand on modifie
    setSearchTerm('');
    onEdit(product);
  };

  const handleDelete = (id) => {
    // ✅ Réinitialiser la recherche quand on supprime
    setSearchTerm('');
    onDelete(id);
  };

  if (loading) {
    return (
      <div className="admin-table-container">
        <div className="table-header">
          <button onClick={onBack} className="back-btn">
            <Icons.ChevronLeft size={16} /> Retour
          </button>
          <h2>Gestion des produits</h2>
          <button onClick={handleAdd} className="add-btn">
            <Icons.Plus size={16} /> Nouveau produit
          </button>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (!localProducts || localProducts.length === 0) {
    return (
      <div className="admin-table-container">
        <div className="table-header">
          <button onClick={onBack} className="back-btn">
            <Icons.ChevronLeft size={16} /> Retour
          </button>
          <h2>Gestion des produits</h2>
          <button onClick={handleAdd} className="add-btn">
            <Icons.Plus size={16} /> Nouveau produit
          </button>
        </div>
        <div className="empty-state">
          <Icons.Package size={48} />
          <p>Aucun produit trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <button onClick={onBack} className="back-btn">
          <Icons.ChevronLeft size={16} /> Retour
        </button>
        <h2>
          Gestion des produits 
          <span className="product-count-badge">
            {filteredProducts.length} / {localProducts.length} affichés
          </span>
        </h2>
        <button onClick={handleAdd} className="add-btn">
          <Icons.Plus size={16} /> Nouveau produit
        </button>
      </div>

      <div className="table-search">
        <Icons.Search size={16} />
        <input 
          type="text"
          placeholder="Rechercher un produit (nom, SKU, marque)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm('')}>
            <Icons.X size={14} />
          </button>
        )}
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>SKU</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Catégorie</th>
              <th>Marque</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  <div className="empty-search">
                    <Icons.Search size={24} />
                    <p>Aucun produit trouvé pour "{searchTerm}"</p>
                    <button onClick={() => setSearchTerm('')} className="clear-search-btn">
                      Effacer la recherche
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-images-cell">
                      {product.displayImages && product.displayImages.length > 0 ? (
                        <div className="image-stack">
                          <img 
                            src={product.displayImage} 
                            alt={product.name} 
                            className="product-thumb"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/50?text=Erreur';
                            }}
                          />
                          {product.hasMultipleImages && (
                            <span 
                              className="image-count-badge" 
                              onClick={() => viewGallery(product)}
                              title="Voir toutes les images"
                            >
                              +{product.imagesCount - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <img 
                          src="https://via.placeholder.com/50?text=No+Image" 
                          alt="No image" 
                          className="product-thumb"
                          style={{ opacity: 0.5 }}
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    {product.featured && (
                      <span className="featured-badge" title="Produit en vedette">
                        <Icons.Star size={12} />
                      </span>
                    )}
                  </td>
                  <td><code>{product.sku}</code></td>
                  <td>
                    <strong>{typeof product.price === 'number' ? product.price.toFixed(2) : product.price} MAD</strong>
                    {product.original_price && product.original_price > product.price && (
                      <div style={{ fontSize: '11px', color: '#999', textDecoration: 'line-through' }}>
                        {product.original_price} MAD
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`stock-badge ${
                      product.stock < 5 ? 'critical' : 
                      product.stock < 10 ? 'warning' : 'good'
                    }`}>
                      {product.stock} unité{product.stock > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td>{product.category?.name || '-'}</td>
                  <td>{product.brand || '-'}</td>
                  <td>
                    <div className="action-buttons-cell">
                      <button onClick={() => handleEdit(product)} className="edit-btn" title="Modifier">
                        <Icons.Eye size={14} /> Modifier
                      </button>
                      {product.hasMultipleImages && (
                        <button 
                          onClick={() => viewGallery(product)} 
                          className="gallery-btn" 
                          title="Voir la galerie"
                        >
                          <Icons.Image size={14} /> Galerie
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="delete-btn" 
                        title="Supprimer"
                      >
                        <Icons.Trash size={14} /> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="pagination">
            <button 
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <Icons.ChevronLeft size={16} />
              <span>Précédent</span>
            </button>
            
            <div className="page-numbers">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={i}
                      className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => onPageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={i} className="page-dots">...</span>;
                }
                return null;
              })}
            </div>
            
            <button 
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <span>Suivant</span>
              <Icons.ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modal de galerie */}
      <AnimatePresence>
        {showGallery && selectedProduct && (
          <motion.div 
            className="admin-modal-overlay gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGallery(false)}
          >
            <motion.div 
              className="gallery-modal-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>
                  <Icons.Image size={20} style={{ marginRight: '10px' }} />
                  Galerie - {selectedProduct.name}
                </h3>
                <button className="close-btn" onClick={() => setShowGallery(false)}>
                  <Icons.X size={20} />
                </button>
              </div>
              
              <div className="gallery-body">
                {selectedProduct.displayImages.map((img, index) => (
                  <div key={index} className="gallery-image-item">
                    <div className="gallery-image-wrapper">
                      <img 
                        src={img} 
                        alt={`${selectedProduct.name} ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/200?text=Image+invalide';
                        }}
                      />
                      {index === 0 && (
                        <span className="primary-badge">
                          <Icons.Star size={12} /> Principale
                        </span>
                      )}
                    </div>
                    <div className="gallery-image-info">
                      <span className="image-index">Image {index + 1}</span>
                      <a 
                        href={img} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="image-link"
                        title="Ouvrir dans un nouvel onglet"
                      >
                        <Icons.ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setShowGallery(false)}>
                  Fermer
                </button>
                <button 
                  className="submit-btn" 
                  onClick={() => {
                    setShowGallery(false);
                    handleEdit(selectedProduct);
                  }}
                >
                  <Icons.Eye size={14} /> Modifier le produit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== CATEGORIES TABLE COMPONENT ====================
const CategoriesTable = ({ categories, onAdd, onEdit, onDelete, onRefresh, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <button onClick={onBack} className="back-btn">
          <Icons.ChevronLeft size={16} /> Retour
        </button>
        <h2>Gestion des catégories</h2>
        <button onClick={onAdd} className="add-btn">
          <Icons.Plus size={16} /> Nouvelle catégorie
        </button>
      </div>

      <div className="table-search">
        <Icons.Search size={16} />
        <input 
          type="text"
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Slug</th>
            <th>Produits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                Aucune catégorie trouvée
              </td>
            </tr>
          ) : (
            filteredCategories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td><strong>{category.name}</strong></td>
                <td>{category.slug}</td>
                <td>{category.products_count || 0}</td>
                <td>
                  <button onClick={() => onEdit(category)} className="edit-btn">
                    <Icons.Eye size={14} /> Modifier
                  </button>
                  <button onClick={() => onDelete(category.id)} className="delete-btn">
                    <Icons.Trash size={14} /> Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ==================== CUSTOMERS TABLE COMPONENT ====================
const CustomersTable = ({ customers, onEdit, onRefresh, onView, onBack, currentPage, totalPages, onPageChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <button onClick={onBack} className="back-btn">
          <Icons.ChevronLeft size={16} /> Retour
        </button>
        <h2>Gestion des clients</h2>
      </div>

      <div className="table-search">
        <Icons.Search size={16} />
        <input 
          type="text"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Type</th>
            <th>Commandes</th>
            <th>Inscription</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                Aucun client trouvé
              </td>
            </tr>
          ) : (
            filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td><strong>{customer.name}</strong></td>
                <td>{customer.email}</td>
                <td>{customer.phone || '-'}</td>
                <td>
                  {customer.tier === 'pro' ? (
                    <span className="pro-badge">PRO</span>
                  ) : (
                    <span className="regular-badge">Régulier</span>
                  )}
                </td>
                <td>{customer.orders_count || 0}</td>
                <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => onEdit(customer)} className="edit-btn">
                    <Icons.Eye size={14} /> Modifier
                  </button>
                  <button onClick={() => onView(customer)} className="view-btn">
                    <Icons.User size={14} /> Voir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <Icons.ChevronLeft />
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <Icons.ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

// ==================== COUPONS TABLE COMPONENT ====================
const CouponsTable = ({ coupons, customers, onAdd, onEdit, onDelete, onRefresh, onBack, currentPage, totalPages, onPageChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCoupons = coupons.filter(c => 
    c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <button onClick={onBack} className="back-btn">
          <Icons.ChevronLeft size={16} /> Retour
        </button>
        <h2>Gestion des coupons</h2>
        <button onClick={onAdd} className="add-btn">
          <Icons.Plus size={16} /> Nouveau coupon
        </button>
      </div>

      <div className="table-search">
        <Icons.Search size={16} />
        <input 
          type="text"
          placeholder="Rechercher un coupon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Nom</th>
            <th>Type</th>
            <th>Valeur</th>
            <th>Utilisations</th>
            <th>Expiration</th>
            <th>Client</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoupons.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                Aucun coupon trouvé
              </td>
            </tr>
          ) : (
            filteredCoupons.map(coupon => (
              <tr key={coupon.id}>
                <td><strong>{coupon.code}</strong></td>
                <td>{coupon.name}</td>
                <td>{coupon.type === 'percentage' ? 'Pourcentage' : 'Montant fixe'}</td>
                <td>{coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} MAD`}</td>
                <td>{coupon.used_count || 0}/{coupon.max_uses || '∞'}</td>
                <td>{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Jamais'}</td>
                <td>
                  {coupon.customer ? (
                    <span className="customer-badge">
                      {coupon.customer.name}
                    </span>
                  ) : (
                    <span className="public-badge">Public</span>
                  )}
                </td>
                <td>
                  <button onClick={() => onEdit(coupon)} className="edit-btn">
                    <Icons.Eye size={14} /> Modifier
                  </button>
                  <button onClick={() => onDelete(coupon.id)} className="delete-btn">
                    <Icons.Trash size={14} /> Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <Icons.ChevronLeft />
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <Icons.ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

// ==================== ADMIN MODAL COMPONENT ====================
// ==================== ADMIN MODAL COMPLET AVEC GESTION D'IMAGES ====================
// ==================== ADMIN MODAL COMPLET AVEC GESTION D'IMAGES ====================
// ==================== ADMIN MODAL COMPLET AVEC TOUTES LES FONCTIONS ====================
// ==================== ADMIN MODAL COMPLET AVEC TOUTES LES FONCTIONS ====================
const AdminModal = ({ 
  type, 
  data, 
  isEditing, 
  onClose, 
  onChange, 
  onSubmit, 
  categories = [],
  customers = []
}) => {
  
  const [newImageUrl, setNewImageUrl] = useState('');
  const [images, setImages] = useState([]);

  // Initialiser les images quand les données changent
  useEffect(() => {
    if (data) {
      // Récupérer toutes les images possibles
      let productImages = [];
      
      if (data.images_array && Array.isArray(data.images_array)) {
        productImages = data.images_array;
      } else if (data.images && Array.isArray(data.images)) {
        productImages = data.images;
      } else if (data.image) {
        productImages = [data.image];
      }
      
      setImages(productImages);
      console.log('📸 Images chargées dans le modal:', productImages);
    }
  }, [data]);

  const getTitle = () => {
    switch(type) {
      case 'product': return isEditing ? 'Modifier le produit' : 'Nouveau produit';
      case 'category': return isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie';
      case 'coupon': return isEditing ? 'Modifier le coupon' : 'Nouveau coupon';
      case 'customer': return 'Modifier le client';
      default: return '';
    }
  };

  const handleArrayInput = (e, fieldName) => {
    const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
    onChange({ target: { name: fieldName, value: lines } });
  };

  const generateSku = () => {
    const newSku = 'PRD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    onChange({ target: { name: 'sku', value: newSku } });
  };

  const generateCouponCode = () => {
    const prefixes = ['PROMO', 'SALE', 'WELCOME', 'SPECIAL', 'BONUS'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const newCode = prefix + suffix;
    onChange({ target: { name: 'code', value: newCode } });
  };

  // Ajouter une nouvelle image
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    
    const newImages = [...images, newImageUrl.trim()];
    setImages(newImages);
    onChange({ target: { name: 'images', value: newImages } });
    setNewImageUrl('');
  };

  // Supprimer une image
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange({ target: { name: 'images', value: newImages } });
  };

  // Définir comme image principale (mettre en premier)
  const handleSetPrimary = (index) => {
    if (index === 0) return;
    
    const newImages = [...images];
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage);
    setImages(newImages);
    onChange({ target: { name: 'images', value: newImages } });
  };

  // ==================== RENDER PRODUCT FORM ====================
  const renderProductForm = () => (
    <>
      <div className="form-group">
        <label>Nom du produit <span className="required">*</span></label>
        <input 
          type="text"
          name="name"
          value={data.name || ''}
          onChange={onChange}
          required
          placeholder="Ex: Microscope Professionnel"
        />
      </div>

      <div className="form-row">
        <div className="form-group" style={{ flex: 2 }}>
          <label>SKU <span className="required">*</span></label>
          <input 
            type="text"
            name="sku"
            value={data.sku || ''}
            onChange={onChange}
            required
            placeholder="Ex: MIC-001"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>&nbsp;</label>
          <button 
            type="button"
            onClick={generateSku}
            className="generate-sku-btn"
            style={{ width: '100%' }}
          >
            Générer SKU
          </button>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Prix (MAD) <span className="required">*</span></label>
          <input 
            type="number"
            name="price"
            value={data.price || ''}
            onChange={onChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        <div className="form-group">
          <label>Stock <span className="required">*</span></label>
          <input 
            type="number"
            name="stock"
            value={data.stock || ''}
            onChange={onChange}
            required
            min="0"
            placeholder="0"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Catégorie <span className="required">*</span></label>
          <select 
            name="category_id" 
            value={data.category_id || ''} 
            onChange={onChange}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name} {cat.products_count ? `(${cat.products_count})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Marque</label>
          <input 
            type="text"
            name="brand"
            value={data.brand || ''}
            onChange={onChange}
            placeholder="Ex: Olympus"
          />
        </div>
      </div>

      {/* SECTION IMAGES MULTIPLES */}
      <div className="form-group images-section">
        <label>Images du produit</label>
        
        {/* Ajout d'une nouvelle image */}
        <div className="add-image-input">
          <input
            type="text"
            placeholder="URL de l'image..."
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
          />
          <button 
            type="button" 
            onClick={handleAddImage}
            className="add-image-btn"
            disabled={!newImageUrl.trim()}
          >
            <Icons.Plus size={16} /> Ajouter
          </button>
        </div>

        {/* Galerie d'images */}
        {images.length > 0 ? (
          <>
            <div className="images-gallery">
              {images.map((img, index) => (
                <div key={index} className={`image-item ${index === 0 ? 'primary' : ''}`}>
                  <div className="image-preview">
                    <img 
                      src={img} 
                      alt={`Produit ${index + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Image+invalide';
                      }}
                    />
                    {index === 0 && (
                      <span className="primary-badge">
                        <Icons.Star size={10} /> Principale
                      </span>
                    )}
                  </div>
                  <div className="image-actions">
                    {index !== 0 && (
                      <button 
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className="image-action-btn set-primary"
                        title="Définir comme image principale"
                      >
                        <Icons.Star size={14} />
                      </button>
                    )}
                    <button 
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="image-action-btn remove"
                      title="Supprimer l'image"
                    >
                      <Icons.Trash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="images-info">
              <small style={{ color: '#7f8c8d' }}>
                <Icons.Info size={12} /> {images.length} image(s) - La première est l'image principale
              </small>
            </div>
          </>
        ) : (
          <div className="no-images">
            <Icons.Image size={32} />
            <p>Aucune image ajoutée</p>
            <small>Ajoutez des images via l'URL ci-dessus</small>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={data.description || ''}
          onChange={onChange}
          rows="3"
          placeholder="Description détaillée du produit..."
        />
      </div>

      <div className="form-group">
        <label>Badge (optionnel)</label>
        <input 
          type="text"
          name="badge"
          value={data.badge || ''}
          onChange={onChange}
          placeholder="Ex: Nouveau, Promotion, Meilleure vente"
        />
      </div>

      <div className="form-group">
        <label>Caractéristiques</label>
        <textarea
          name="features"
          value={Array.isArray(data.features) ? data.features.join('\n') : (data.features || '')}
          onChange={(e) => handleArrayInput(e, 'features')}
          rows="4"
          placeholder="Entrez une caractéristique par ligne"
        />
        <small style={{ color: '#7f8c8d' }}>
          Une caractéristique par ligne
        </small>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input 
            type="checkbox"
            name="featured"
            checked={data.featured || false}
            onChange={(e) => onChange({ target: { name: 'featured', value: e.target.checked } })}
          />
          <span>Mettre en vedette (afficher sur la page d'accueil)</span>
        </label>
      </div>
    </>
  );

  // ==================== RENDER CATEGORY FORM ====================
  const renderCategoryForm = () => (
    <>
      <div className="form-group">
        <label>Nom de la catégorie <span className="required">*</span></label>
        <input 
          type="text"
          name="name"
          value={data.name || ''}
          onChange={onChange}
          required
          placeholder="Ex: Microscopes"
        />
      </div>

      <div className="form-group">
        <label>Couleur (optionnel)</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="color"
            name="color"
            value={data.color || '#6d9eeb'}
            onChange={onChange}
            style={{ width: '60px', height: '42px', padding: '4px' }}
          />
          <input 
            type="text"
            name="color_text"
            value={data.color || ''}
            onChange={(e) => onChange({ target: { name: 'color', value: e.target.value } })}
            placeholder="#6d9eeb"
            style={{ flex: 1 }}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Image URL (optionnel)</label>
        <input 
          type="text"
          name="image"
          value={data.image || ''}
          onChange={onChange}
          placeholder="https://exemple.com/category-image.jpg"
        />
        {data.image && (
          <div style={{ marginTop: '10px' }}>
            <img 
              src={data.image} 
              alt="Preview" 
              style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px' }}
            />
          </div>
        )}
      </div>
    </>
  );

  // ==================== RENDER COUPON FORM ====================
  const renderCouponForm = () => (
    <>
      <div className="form-group">
        <label>Code du coupon <span className="required">*</span></label>
        <div className="form-row">
          <div style={{ flex: 2 }}>
            <input 
              type="text"
              name="code"
              value={data.code || ''}
              onChange={onChange}
              required
              placeholder="Ex: PROMO20"
              style={{ textTransform: 'uppercase' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <button 
              type="button"
              onClick={generateCouponCode}
              className="generate-sku-btn"
              style={{ width: '100%' }}
            >
              Générer
            </button>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Nom du coupon <span className="required">*</span></label>
        <input 
          type="text"
          name="name"
          value={data.name || ''}
          onChange={onChange}
          required
          placeholder="Ex: Promotion été 2024"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={data.description || ''}
          onChange={onChange}
          rows="2"
          placeholder="Description du coupon..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Type <span className="required">*</span></label>
          <select name="type" value={data.type || 'percentage'} onChange={onChange} required>
            <option value="percentage">Pourcentage (%)</option>
            <option value="fixed">Montant fixe (MAD)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Valeur <span className="required">*</span></label>
          <input 
            type="number"
            name="value"
            value={data.value || ''}
            onChange={onChange}
            required
            min="0"
            step={data.type === 'percentage' ? '1' : '0.01'}
            placeholder={data.type === 'percentage' ? '20' : '100'}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Montant minimum de commande</label>
        <input 
          type="number"
          name="min_order_amount"
          value={data.min_order_amount || ''}
          onChange={onChange}
          min="0"
          step="0.01"
          placeholder="0 = Pas de minimum"
        />
      </div>

      <div className="form-group">
        <label>Nombre maximum d'utilisations</label>
        <input 
          type="number"
          name="max_uses"
          value={data.max_uses || ''}
          onChange={onChange}
          min="1"
          placeholder="Laisser vide pour illimité"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date de début</label>
          <input 
            type="datetime-local"
            name="starts_at"
            value={data.starts_at ? data.starts_at.substring(0, 16) : ''}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Date d'expiration</label>
          <input 
            type="datetime-local"
            name="expires_at"
            value={data.expires_at ? data.expires_at.substring(0, 16) : ''}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Assigner à un client (optionnel)</label>
        <select 
          name="customer_id" 
          value={data.customer_id || ''} 
          onChange={onChange}
        >
          <option value="">Tous les clients (public)</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.email}
            </option>
          ))}
        </select>
        <small style={{ color: '#7f8c8d' }}>
          Si vous assignez à un client, le coupon sera personnel et non public
        </small>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input 
            type="checkbox"
            name="is_active"
            checked={data.is_active !== false}
            onChange={(e) => onChange({ target: { name: 'is_active', value: e.target.checked } })}
          />
          <span>Coupon actif</span>
        </label>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input 
            type="checkbox"
            name="is_public"
            checked={data.is_public || false}
            onChange={(e) => onChange({ target: { name: 'is_public', value: e.target.checked } })}
            disabled={data.customer_id}
          />
          <span>Visible publiquement (sur la page des coupons)</span>
        </label>
      </div>
    </>
  );

  // ==================== RENDER CUSTOMER FORM ====================
  const renderCustomerForm = () => (
    <>
      <div className="form-group">
        <label>Nom complet</label>
        <input 
          type="text"
          name="name"
          value={data.name || ''}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input 
          type="email"
          name="email"
          value={data.email || ''}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Téléphone</label>
        <input 
          type="tel"
          name="phone"
          value={data.phone || ''}
          onChange={onChange}
          placeholder="+212 6XX XXX XXX"
        />
      </div>

      <div className="form-group">
        <label>Adresse</label>
        <textarea
          name="address"
          value={data.address || ''}
          onChange={onChange}
          rows="3"
          placeholder="Adresse complète..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Type de compte</label>
          <select name="tier" value={data.tier || 'regular'} onChange={onChange}>
            <option value="regular">Client régulier</option>
            <option value="pro">Client professionnel (PRO)</option>
          </select>
        </div>
        {data.tier === 'pro' && (
          <div className="form-group">
            <label>Réduction PRO (%)</label>
            <input 
              type="number"
              name="pro_discount"
              value={data.pro_discount || ''}
              onChange={onChange}
              min="0"
              max="100"
              placeholder="Ex: 15"
            />
          </div>
        )}
      </div>

      {data.tier === 'pro' && (
        <div className="form-group">
          <label>Nom de l'entreprise</label>
          <input 
            type="text"
            name="company_name"
            value={data.company_name || ''}
            onChange={onChange}
            placeholder="Nom de l'entreprise"
          />
        </div>
      )}

      <div className="form-group">
        <label>Rôle</label>
        <select name="role" value={data.role || 'customer'} onChange={onChange}>
          <option value="customer">Client</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input 
            type="checkbox"
            name="email_verified"
            checked={data.email_verified_at !== null}
            onChange={(e) => onChange({ 
              target: { 
                name: 'email_verified_at', 
                value: e.target.checked ? new Date().toISOString() : null 
              } 
            })}
          />
          <span>Email vérifié</span>
        </label>
      </div>
    </>
  );

  // ==================== RENDER PRINCIPAL ====================

  return (
    <motion.div 
      className="admin-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className={`admin-modal-content ${type}-modal`}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>
            {type === 'product' && <Icons.Package size={20} style={{ marginRight: '10px' }} />}
            {type === 'category' && <Icons.Filter size={20} style={{ marginRight: '10px' }} />}
            {type === 'coupon' && <Icons.Percent size={20} style={{ marginRight: '10px' }} />}
            {type === 'customer' && <Icons.User size={20} style={{ marginRight: '10px' }} />}
            {getTitle()}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <Icons.X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {type === 'product' && renderProductForm()}
          {type === 'category' && renderCategoryForm()}
          {type === 'coupon' && renderCouponForm()}
          {type === 'customer' && renderCustomerForm()}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Annuler
          </button>
          <button className="submit-btn" onClick={onSubmit}>
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// PropTypes
AdminModal.propTypes = {
  type: PropTypes.oneOf(['product', 'category', 'coupon', 'customer']).isRequired,
  data: PropTypes.object,
  isEditing: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  categories: PropTypes.array,
  customers: PropTypes.array
};

AdminModal.defaultProps = {
  data: {},
  isEditing: false,
  categories: [],
  customers: []
};
// Admin Dashboard Page
// ==================== ADMIN DASHBOARD PAGE COMPLETE ====================
// ==================== ADMIN DASHBOARD PAGE COMPLETE ====================
const AdminDashboardPage = ({ navigate }) => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data for tables
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Pagination - ÉTAT CENTRALISÉ
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);
  const [tableLoading, setTableLoading] = useState(false);
  
  const { user, isAdmin } = useAuth();

  // Check authentication
  useEffect(() => {
    if (user === undefined) return;
    
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    setCheckingAuth(false);
    fetchDashboardData();
  }, [user]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await api.get('/admin/stats').catch(err => {
        console.log('Stats error:', err);
        return { data: { success: false, data: {} } };
      });
      
      // Fetch recent orders
      const ordersRes = await api.get('/admin/orders?per_page=5').catch(err => {
        console.log('Orders error:', err);
        return { data: { success: false, data: { data: [] } } };
      });
      
      // Fetch recent customers
      const customersRes = await api.get('/admin/customers?per_page=5').catch(err => {
        console.log('Customers error:', err);
        return { data: { success: false, data: { data: [] } } };
      });
      
      // Fetch low stock products
      const productsRes = await api.get('/admin/products/low-stock?per_page=5').catch(err => {
        console.log('Products error:', err);
        return { data: { success: false, data: { data: [] } } };
      });
      
      // Fetch categories
      const categoriesRes = await api.get('/categories').catch(err => {
        console.log('Categories error:', err);
        return { data: { success: false, data: [] } };
      });
      
      // Fetch coupons
      const couponsRes = await api.get('/admin/coupons?per_page=5').catch(err => {
        console.log('Coupons error:', err);
        return { data: { success: false, data: { data: [] } } };
      });
      
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (ordersRes.data.success) setRecentOrders(ordersRes.data.data.data || []);
      if (customersRes.data.success) setRecentCustomers(customersRes.data.data.data || []);
      if (productsRes.data.success) setLowStockProducts(productsRes.data.data.data || []);
      if (categoriesRes.data.success) setCategories(categoriesRes.data.data);
      if (couponsRes.data.success) setCoupons(couponsRes.data.data.data || []);
      
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FONCTIONS DE PAGINATION ====================
  
  // Fetch products with pagination
  const fetchProducts = async (page = 1) => {
    console.log('📦 fetchProducts appelé avec page:', page);
    setTableLoading(true);
    
    try {
      const response = await api.get(`/admin/products?page=${page}&per_page=${itemsPerPage}`);
      console.log('📦 Réponse API produits:', response.data);
      
      if (response.data.success) {
        // La structure de pagination de Laravel
        const paginatedData = response.data.data;
        
        console.log('📦 Données paginées reçues:', {
          current_page: paginatedData.current_page,
          last_page: paginatedData.last_page,
          total: paginatedData.total,
          count: paginatedData.data?.length
        });
        
        setProducts(paginatedData.data || []);
        setCurrentPage(paginatedData.current_page || page);
        setTotalPages(paginatedData.last_page || 1);
      }
    } catch (err) {
      console.error('❌ Failed to fetch products:', err);
      alert('Erreur lors du chargement des produits');
    } finally {
      setTableLoading(false);
    }
  };

  // Fetch customers with pagination
  const fetchCustomers = async (page = 1) => {
    console.log('👥 fetchCustomers appelé avec page:', page);
    setTableLoading(true);
    
    try {
      const response = await api.get(`/admin/customers?page=${page}&per_page=${itemsPerPage}`);
      console.log('👥 Réponse API clients:', response.data);
      
      if (response.data.success) {
        const paginatedData = response.data.data;
        setCustomers(paginatedData.data || []);
        setCurrentPage(paginatedData.current_page || page);
        setTotalPages(paginatedData.last_page || 1);
      }
    } catch (err) {
      console.error('❌ Failed to fetch customers:', err);
      alert('Erreur lors du chargement des clients');
    } finally {
      setTableLoading(false);
    }
  };

  // Fetch coupons with pagination
  const fetchCoupons = async (page = 1) => {
    console.log('🏷️ fetchCoupons appelé avec page:', page);
    setTableLoading(true);
    
    try {
      const response = await api.get(`/admin/coupons?page=${page}&per_page=${itemsPerPage}`);
      console.log('🏷️ Réponse API coupons:', response.data);
      
      if (response.data.success) {
        const paginatedData = response.data.data;
        setCoupons(paginatedData.data || []);
        setCurrentPage(paginatedData.current_page || page);
        setTotalPages(paginatedData.last_page || 1);
      }
    } catch (err) {
      console.error('❌ Failed to fetch coupons:', err);
      alert('Erreur lors du chargement des coupons');
    } finally {
      setTableLoading(false);
    }
  };

  // Fetch orders with pagination
  const fetchOrders = async (page = 1, status = '') => {
    console.log('📋 fetchOrders appelé avec page:', page);
    setTableLoading(true);
    
    try {
      let url = `/admin/orders?page=${page}&per_page=${itemsPerPage}`;
      if (status) url += `&status=${status}`;
      
      const response = await api.get(url);
      console.log('📋 Réponse API commandes:', response.data);
      
      if (response.data.success) {
        const paginatedData = response.data.data;
        setOrders(paginatedData.data || []);
        setCurrentPage(paginatedData.current_page || page);
        setTotalPages(paginatedData.last_page || 1);
      }
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err);
      alert('Erreur lors du chargement des commandes');
    } finally {
      setTableLoading(false);
    }
  };

  // Handle tab change with reset pagination
  const handleTabChange = (tab) => {
    console.log('🔄 Changement d\'onglet vers:', tab);
    setActiveTab(tab);
    setCurrentPage(1); // Reset à la page 1
    
    if (tab === 'products') fetchProducts(1);
    if (tab === 'customers') fetchCustomers(1);
    if (tab === 'coupons') fetchCoupons(1);
    if (tab === 'orders') fetchOrders(1);
  };

  // Handle page change - FONCTION CRITIQUE POUR LA PAGINATION
  const handlePageChange = (newPage) => {
    console.log('📄 handlePageChange appelé avec page:', newPage);
    console.log('📄 Onglet actif:', activeTab);
    console.log('📄 Page actuelle avant changement:', currentPage);
    
    // Éviter les changements inutiles
    if (newPage === currentPage) {
      console.log('📄 Même page, ignoré');
      return;
    }
    
    if (newPage < 1 || newPage > totalPages) {
      console.log('📄 Page hors limites, ignoré');
      return;
    }
    
    // Mettre à jour l'état local
    setCurrentPage(newPage);
    
    // Recharger les données en fonction de l'onglet actif
    console.log('📄 Rechargement des données pour la page', newPage);
    
    if (activeTab === 'products') {
      fetchProducts(newPage);
    } else if (activeTab === 'customers') {
      fetchCustomers(newPage);
    } else if (activeTab === 'coupons') {
      fetchCoupons(newPage);
    } else if (activeTab === 'orders') {
      fetchOrders(newPage);
    }
  };

  // ==================== CRUD OPERATIONS ====================

  // Open modal for adding/editing
  const openModal = (type, item = null) => {
    setModalType(type);
    
    if (item) {
      setEditingItem(item);
      
      if (type === 'product') {
        // Récupérer toutes les images du produit
        let productImages = [];
        
        if (item.images_array && Array.isArray(item.images_array)) {
          productImages = item.images_array;
        } else if (item.images && Array.isArray(item.images)) {
          productImages = item.images.map(img => img.image_path);
        } else if (item.image) {
          productImages = [item.image];
        }
        
        setFormData({
          id: item.id,
          name: item.name || '',
          sku: item.sku || '',
          price: item.price?.toString() || '',
          stock: item.stock?.toString() || '',
          category_id: item.category_id || '',
          brand: item.brand || '',
          image: item.image || '',
          images: productImages,
          description: item.description || '',
          features: item.features || [],
          badge: item.badge || '',
          featured: item.featured || false
        });
      } else if (type === 'category') {
        setFormData({
          id: item.id,
          name: item.name || '',
          color: item.color || '#6d9eeb',
          image: item.image || ''
        });
      } else if (type === 'coupon') {
        setFormData({
          id: item.id,
          code: item.code || '',
          name: item.name || '',
          description: item.description || '',
          type: item.type || 'percentage',
          value: item.value?.toString() || '',
          min_order_amount: item.min_order_amount?.toString() || '',
          max_uses: item.max_uses?.toString() || '',
          customer_id: item.customer_id || '',
          is_active: item.is_active !== false,
          is_public: item.is_public || false,
          starts_at: item.starts_at || '',
          expires_at: item.expires_at || ''
        });
      } else if (type === 'customer') {
        setFormData({
          id: item.id,
          name: item.name || '',
          email: item.email || '',
          phone: item.phone || '',
          address: item.address || '',
          tier: item.tier || 'regular',
          pro_discount: item.pro_discount || '',
          company_name: item.company_name || '',
          role: item.role || 'customer',
          email_verified_at: item.email_verified_at
        });
      }
    } else {
      setEditingItem(null);
      // Dans handleSubmit, modifiez la partie PUT

      if (type === 'product') {
        setFormData({
          name: '',
          sku: 'PRD-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          price: '',
          stock: '',
          category_id: '',
          brand: '',
          image: '',
          images: [],
          description: '',
          features: [],
          badge: '',
          featured: false
        });
      } else if (type === 'category') {
        setFormData({
          name: '',
          color: '#6d9eeb',
          image: ''
        });
      } else if (type === 'coupon') {
        setFormData({
          code: '',
          name: '',
          description: '',
          type: 'percentage',
          value: '',
          min_order_amount: '',
          max_uses: '',
          customer_id: '',
          is_active: true,
          is_public: false,
          starts_at: '',
          expires_at: ''
        });
      } else {
        setFormData({});
      }
    }
    
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      let response;
      let dataToSend = { ...formData };
      
      if (modalType === 'product') {
        if (dataToSend.features && !Array.isArray(dataToSend.features)) {
          dataToSend.features = [dataToSend.features];
        }
        
        if (dataToSend.features) {
          dataToSend.features = dataToSend.features.filter(f => f && f.trim() !== '');
        }
        
        if (dataToSend.images && Array.isArray(dataToSend.images)) {
          dataToSend.images = dataToSend.images.filter(img => img && img.trim() !== '');
          if (dataToSend.images.length > 0) {
            dataToSend.image = dataToSend.images[0];
          }
        } else {
          dataToSend.images = [];
        }
        
        dataToSend.price = parseFloat(dataToSend.price) || 0;
        dataToSend.stock = parseInt(dataToSend.stock) || 0;
        dataToSend.category_id = parseInt(dataToSend.category_id) || null;
      }
      
      if (modalType === 'product') {
        if (editingItem) {
          response = await api.put(`/admin/products/${editingItem.id}`, dataToSend);
        } else {
          response = await api.post('/admin/products', dataToSend);
        }
      } else if (modalType === 'category') {
        if (editingItem) {
          response = await api.put(`/admin/categories/${editingItem.id}`, dataToSend);
        } else {
          response = await api.post('/admin/categories', dataToSend);
        }
      } else if (modalType === 'coupon') {
        if (editingItem) {
          response = await api.put(`/admin/coupons/${editingItem.id}`, dataToSend);
        } else {
          response = await api.post('/admin/coupons', dataToSend);
        }
      } else if (modalType === 'customer') {
        response = await api.put(`/admin/customers/${editingItem.id}`, dataToSend);
      }
      
      if (response?.data.success) {
        setShowModal(false);
        
        if (modalType === 'product') {
          if (activeTab === 'products') fetchProducts(currentPage);
          else fetchDashboardData();
        }
        if (modalType === 'category') {
          fetchDashboardData();
          if (activeTab === 'products') fetchProducts(currentPage);
        }
        if (modalType === 'coupon') {
          if (activeTab === 'coupons') fetchCoupons(currentPage);
          else fetchDashboardData();
        }
        if (modalType === 'customer') {
          if (activeTab === 'customers') fetchCustomers(currentPage);
          else fetchDashboardData();
        }
        
        alert(editingItem ? 'Élément mis à jour avec succès' : 'Élément créé avec succès');
      }
    } catch (err) {
      console.error('Failed to save:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la sauvegarde';
      alert(errorMessage);
    }
  };

  // Handle delete
  const handleDelete = async (type, id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    
    try {
      let response;
      
      if (type === 'product') {
        response = await api.delete(`/admin/products/${id}`);
      } else if (type === 'category') {
        response = await api.delete(`/admin/categories/${id}`);
      } else if (type === 'coupon') {
        response = await api.delete(`/admin/coupons/${id}`);
      }
      
      if (response?.data.success) {
        if (type === 'product') {
          if (activeTab === 'products') fetchProducts(currentPage);
          else fetchDashboardData();
        }
        if (type === 'category') {
          fetchDashboardData();
          if (activeTab === 'products') fetchProducts(currentPage);
        }
        if (type === 'coupon') {
          if (activeTab === 'coupons') fetchCoupons(currentPage);
          else fetchDashboardData();
        }
        
        alert('Élément supprimé avec succès');
      }
    } catch (err) {
      console.error('Failed to delete:', err);
      
      const errorMessage = err.response?.data?.error || err.message;
      
      if (errorMessage.includes('commandes')) {
        alert('❌ Impossible de supprimer: Ce produit a des commandes existantes');
      } else if (errorMessage.includes('produits')) {
        alert('❌ Impossible de supprimer: Cette catégorie contient des produits');
      } else {
        alert('Erreur lors de la suppression: ' + errorMessage);
      }
    }
  };

  // Handle order status update
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        if (activeTab === 'orders') fetchOrders(currentPage);
        else fetchDashboardData();
        alert('Statut mis à jour avec succès');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  // Loading state
  if (checkingAuth || loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="admin-dashboard-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="admin-container">
        {/* Admin Header */}
        <div className="admin-header">
          <h1>
            <Icons.User size={28} />
            Administration TECLAB
          </h1>
          <div className="admin-user">
            <span>{user?.name}</span>
            <button onClick={() => navigate('/')} className="view-site-btn">
              <Icons.Eye size={16} /> Voir le site
            </button>
          </div>
        </div>

        {/* Admin Layout */}
        <div className="admin-layout">
          {/* Sidebar */}
          <div className="admin-sidebar">
            <div className="sidebar-menu">
              <button 
                className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleTabChange('dashboard')}
              >
                <Icons.Home size={18} />
                <span>Tableau de bord</span>
              </button>
              
              <button 
                className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => handleTabChange('orders')}
              >
                <Icons.ShoppingBag size={18} />
                <span>Commandes</span>
                {stats?.pending_orders > 0 && (
                  <span className="menu-badge">{stats.pending_orders}</span>
                )}
              </button>
              
              <button 
                className={`menu-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => handleTabChange('products')}
              >
                <Icons.Package size={18} />
                <span>Produits</span>
                {lowStockProducts.length > 0 && (
                  <span className="menu-badge warning">{lowStockProducts.length}</span>
                )}
              </button>
              
              <button 
                className={`menu-item ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => handleTabChange('categories')}
              >
                <Icons.Filter size={18} />
                <span>Catégories</span>
              </button>
              
              <button 
                className={`menu-item ${activeTab === 'customers' ? 'active' : ''}`}
                onClick={() => handleTabChange('customers')}
              >
                <Icons.Users size={18} />
                <span>Clients</span>
              </button>
              
              <button 
                className={`menu-item ${activeTab === 'coupons' ? 'active' : ''}`}
                onClick={() => handleTabChange('coupons')}
              >
                <Icons.Percent size={18} />
                <span>Coupons</span>
              </button>
              
              <button 
                className="menu-item"
                onClick={() => navigate('/admin/emails')}
              >
                <Icons.Mail size={18} />
                <span>Campagne Email</span>
              </button>
              
              <button 
                className="menu-item"
                onClick={() => navigate('/dashboard')}
              >
                <Icons.User size={18} />
                <span>Mon Profil</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="admin-content">
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <>
                {/* Stats Grid */}
                <div className="stats-grid">
                  <div className="stat-card" onClick={() => handleTabChange('orders')}>
                    <div className="stat-icon orders">
                      <Icons.ShoppingBag size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Commandes totales</span>
                      <span className="stat-value">{stats?.total_orders || 0}</span>
                    </div>
                  </div>
                  
                  <div className="stat-card" onClick={() => handleTabChange('orders')}>
                    <div className="stat-icon pending">
                      <Icons.Truck size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">En cours</span>
                      <span className="stat-value">{stats?.pending_orders || 0}</span>
                    </div>
                  </div>
                  
                  <div className="stat-card" onClick={() => handleTabChange('products')}>
                    <div className="stat-icon products">
                      <Icons.Package size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Produits</span>
                      <span className="stat-value">{stats?.total_products || 0}</span>
                    </div>
                  </div>
                  
                  <div className="stat-card" onClick={() => handleTabChange('customers')}>
                    <div className="stat-icon customers">
                      <Icons.Users size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Clients</span>
                      <span className="stat-value">{stats?.total_customers || 0}</span>
                    </div>
                  </div>
                  
                  <div className="stat-card highlight" onClick={() => handleTabChange('orders')}>
                    <div className="stat-icon revenue">
                      <Icons.Percent size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Revenu total</span>
                      <span className="stat-value">{stats?.total_revenue || 0} MAD</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                  <h2>Actions rapides</h2>
                  <div className="action-buttons">
                    <button onClick={() => openModal('product')}>
                      <Icons.Plus size={16} /> Nouveau produit
                    </button>
                    <button onClick={() => openModal('category')}>
                      <Icons.Plus size={16} /> Nouvelle catégorie
                    </button>
                    <button onClick={() => openModal('coupon')}>
                      <Icons.Plus size={16} /> Nouveau coupon
                    </button>
                    <button onClick={() => navigate('/admin/emails')}>
                      <Icons.Mail size={16} /> Envoyer email
                    </button>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="admin-columns">
                  {/* Left Column */}
                  <div className="admin-column">
                    {/* Recent Orders */}
                    <div className="admin-card">
                      <div className="card-header">
                        <h3>Commandes récentes</h3>
                        <button onClick={() => handleTabChange('orders')} className="view-all">
                          Voir tout <Icons.ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="recent-orders-list">
                        {recentOrders.length === 0 ? (
                          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Aucune commande récente</p>
                        ) : (
                          recentOrders.map(order => (
                            <div 
                              key={order.id} 
                              className="recent-order-item"
                              onClick={() => navigate(`/admin/orders/${order.id}`)}
                            >
                              <div className="order-info">
                                <span className="order-number">#{order.order_number}</span>
                                <span className="order-customer">{order.customer?.name}</span>
                              </div>
                              <div className="order-status-price">
                                <span className={`status-badge ${order.status}`}>
                                  {order.status}
                                </span>
                                <span className="order-price">{order.total} MAD</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Low Stock Products */}
                    <div className="admin-card">
                      <div className="card-header">
                        <h3>Stock faible</h3>
                        <button onClick={() => handleTabChange('products')} className="view-all">
                          Gérer <Icons.ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="low-stock-list">
                        {lowStockProducts.length === 0 ? (
                          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Aucun produit en stock faible</p>
                        ) : (
                          lowStockProducts.map(product => (
                            <div key={product.id} className="low-stock-item">
                              <span className="product-name">{product.name}</span>
                              <span className={`stock-badge ${product.stock < 5 ? 'critical' : 'warning'}`}>
                                {product.stock} unités
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="admin-column">
                    {/* Recent Customers */}
                    <div className="admin-card">
                      <div className="card-header">
                        <h3>Nouveaux clients</h3>
                        <button onClick={() => handleTabChange('customers')} className="view-all">
                          Voir tout <Icons.ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="recent-customers-list">
                        {recentCustomers.length === 0 ? (
                          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Aucun client récent</p>
                        ) : (
                          recentCustomers.map(customer => (
                            <div key={customer.id} className="recent-customer-item">
                              <div className="customer-avatar">
                                <Icons.User size={16} />
                              </div>
                              <div className="customer-info">
                                <span className="customer-name">{customer.name}</span>
                                <span className="customer-email">{customer.email}</span>
                              </div>
                              <span className="customer-date">
                                {new Date(customer.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Recent Coupons */}
                    <div className="admin-card">
                      <div className="card-header">
                        <h3>Coupons récents</h3>
                        <button onClick={() => handleTabChange('coupons')} className="view-all">
                          Voir tout <Icons.ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="recent-coupons-list">
                        {coupons.length === 0 ? (
                          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Aucun coupon récent</p>
                        ) : (
                          coupons.slice(0, 5).map(coupon => (
                            <div key={coupon.id} className="recent-coupon-item">
                              <div className="coupon-code">
                                <Icons.Percent size={14} />
                                <span>{coupon.code}</span>
                              </div>
                              <span className="coupon-value">
                                {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} MAD`}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <OrdersTable 
                orders={orders}
                onStatusChange={updateOrderStatus}
                onRefresh={() => fetchOrders(currentPage)}
                onView={(order) => navigate(`/admin/orders/${order.id}`)}
                onBack={() => handleTabChange('dashboard')}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={tableLoading}
              />
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <ProductsTable 
                products={products}
                categories={categories}
                onAdd={() => openModal('product')}
                onEdit={(product) => openModal('product', product)}
                onDelete={(id) => handleDelete('product', id)}
                onRefresh={() => fetchProducts(currentPage)}
                onBack={() => handleTabChange('dashboard')}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={tableLoading}
              />
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <CategoriesTable 
                categories={categories}
                onAdd={() => openModal('category')}
                onEdit={(category) => openModal('category', category)}
                onDelete={(id) => handleDelete('category', id)}
                onRefresh={fetchDashboardData}
                onBack={() => handleTabChange('dashboard')}
              />
            )}

            {/* CUSTOMERS TAB */}
            {activeTab === 'customers' && (
              <CustomersTable 
                customers={customers}
                onEdit={(customer) => openModal('customer', customer)}
                onRefresh={() => fetchCustomers(currentPage)}
                onView={(customer) => navigate(`/admin/customers/${customer.id}`)}
                onBack={() => handleTabChange('dashboard')}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={tableLoading}
              />
            )}

            {/* COUPONS TAB */}
            {activeTab === 'coupons' && (
              <CouponsTable 
                coupons={coupons}
                customers={customers}
                onAdd={() => openModal('coupon')}
                onEdit={(coupon) => openModal('coupon', coupon)}
                onDelete={(id) => handleDelete('coupon', id)}
                onRefresh={() => fetchCoupons(currentPage)}
                onBack={() => handleTabChange('dashboard')}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={tableLoading}
              />
            )}
          </div>
        </div>
      </div>

      {/* Admin Modal */}
      <AnimatePresence>
        {showModal && (
          <AdminModal
            type={modalType}
            data={formData}
            isEditing={!!editingItem}
            onClose={() => setShowModal(false)}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            categories={categories}
            customers={customers}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
// ==================== ADMIN PAGES (SIMPLIFIED FOR BREVITY) ====================
// Note: For the complete admin pages (AdminDashboardPage, AdminModal, etc.),
// please refer to the previous messages in our conversation.
// Due to length constraints, I'm including only the main App function below.

// ==================== MAIN APP ====================
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    
  };

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    const handleClick = (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        navigate(e.target.getAttribute('href'));
      }
    };

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('popstate', handlePathChange);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('popstate', handlePathChange);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    const basePath = currentPath.split('?')[0];
    
    // Public routes
    if (basePath === '/') return <HomePage navigate={navigate} />;
    if (basePath === '/about') return <AboutPage />;
    if (basePath === '/products') return <ProductsPage navigate={navigate} />;
    if (basePath.startsWith('/product/')) return <ProductDetailPage navigate={navigate} />;
    if (basePath === '/categories') return <CategoriesPage navigate={navigate} />;
    if (basePath === '/cart') return <CartPage navigate={navigate} />;
    if (basePath === '/checkout') return <CheckoutPage navigate={navigate} />;
    if (basePath === '/login') return <LoginPage navigate={navigate} />;
    if (basePath === '/register') return <RegisterPage navigate={navigate} />;
    if (basePath === '/dashboard') return <DashboardPage navigate={navigate} />;
    if (basePath === '/orders') return <OrdersPage navigate={navigate} />;
    if (basePath.startsWith('/orders/')) return <OrderDetailPage navigate={navigate} />;
    if (basePath === '/verify-email/success') return <VerificationSuccessPage navigate={navigate} />;
    if (basePath === '/verify-email/error') return <VerificationErrorPage navigate={navigate} />;
    
    // User pages
    if (basePath === '/wishlist') return <WishlistPage navigate={navigate} />;
    if (basePath === '/coupons') return <CouponsPage navigate={navigate} />;
    
    // Admin routes
    if (basePath === '/admin') return <AdminDashboardPage navigate={navigate} />;
    if (basePath === '/admin/orders') return <AdminOrdersPage navigate={navigate} />;
    if (basePath.startsWith('/admin/orders/')) return <AdminOrderDetailPage navigate={navigate} />;
    if (basePath === '/admin/emails') return <EmailCampaign />;
    
    // 404
    return (
      <div className="not-found">
        <h1>404</h1>
        <p>Page non trouvée</p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <CouponProvider>
              <FavoritesProvider>
                <div className="App">
                  <Header currentPath={currentPath} navigate={navigate} />
                  <main className="main-content">
                    {renderPage()}
                  </main>
                  <Footer navigate={navigate} />
                  
                  <AnimatePresence>
                    {showBackToTop && (
                      <motion.div 
                        className="back-to-top"
                        onClick={scrollToTop}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icons.ArrowUp />
                      </motion.div>
                    )}
                  </AnimatePresence>
                 
                </div>
              </FavoritesProvider>
            </CouponProvider>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
