import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import api from './api';
import { favoritesApi, couponsApi } from './api';
import './App.css';
import EmailCampaign from './EmailCampaign';
// ==================== API CONFIGURATION ====================

// ==================== ICON COMPONENTS ====================
const Icons = {
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
// ==================== AUTH PROVIDER ====================
// ==================== AUTH PROVIDER ====================
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

  // In the AuthProvider, update the value object:

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
  isPro: user?.tier === 'pro', // Add this
  proDiscount: user?.pro_discount || 0, // Add this
  companyName: user?.company_name, // Add this
  isEmailVerified: user?.email_verified_at !== null,
};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};// ==================== CART PROVIDER ====================

// ==================== FAVORITES PROVIDER ====================
const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch favorites when authenticated
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
        // Handle paginated response
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
      alert('Veuillez vous connecter pour ajouter aux favoris');
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

  // Add favorites count
  const favoritesCount = favorites.length;

  const value = {
    favorites,
    loading,
    favoritesCount, // Add this
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    checkIsFavorite,
    refreshFavorites: fetchFavorites
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};   
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  // Guest session management
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('guest_cart_session') || '';
  });

  // Save session ID to localStorage
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('guest_cart_session', sessionId);
    }
  }, [sessionId]);

  // Get headers with session for guests only
  const getHeaders = () => {
    const headers = {};
    if (!isAuthenticated && sessionId) {
      headers['X-Cart-Session'] = sessionId;
    }
    return headers;
  };

  // Fetch cart
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

  // Load cart on mount and when auth changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user?.id]);

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
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
       
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  // Update quantity
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

  // Remove from cart
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

  // Clear cart
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ==================== PRODUCT PROVIDER ====================
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

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, selectedBrands, priceRange, sortBy, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands');
      if (response.data.success && response.data.data) {
        setBrands(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedBrands.length > 0) params.append('brands', selectedBrands.join(','));
      params.append('min_price', priceRange.min);
      params.append('max_price', priceRange.max);
      params.append('sort_by', sortBy);
      params.append('page', currentPage);
      params.append('per_page', itemsPerPage);

      const response = await api.get(`/products?${params.toString()}`);
      
      if (response.data.success && response.data.data) {
        if (response.data.data.data) {
          setProducts(response.data.data.data);
          setFilteredProducts(response.data.data.data);
          setTotalProducts(response.data.data.total || 0);
          setTotalPages(response.data.data.last_page || 1);
        } else {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
          setTotalProducts(response.data.data.length || 0);
          setTotalPages(1);
        }
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (slug) => {
    try {
      const response = await api.get(`/products/${slug}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Product not found');
    } catch (err) {
      console.error('Failed to fetch product:', err);
      throw err;
    }
  };

  const getFeaturedProducts = async () => {
    try {
      const response = await api.get('/products/featured');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch featured products:', err);
      return [];
    }
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 50000 });
    setSortBy('featured');
    setCurrentPage(1);
  };

  const value = {
    products,
    filteredProducts,
    totalProducts,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrands,
    toggleBrand,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    clearFilters,
    categories,
    brands,
    getProduct,
    getFeaturedProducts,
    refreshProducts: fetchProducts
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

// ==================== COUPON PROVIDER ====================
// ==================== COUPON PROVIDER ====================
// ==================== COUPON PROVIDER ====================
const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const { isAuthenticated, user } = useAuth(); // Add user here

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      // If user is authenticated, we need to get their personal coupons
      // The backend should filter based on the authenticated user
      const response = await api.get('/coupons');
      if (response.data.success && response.data.data) {
        // The backend should already filter based on the authenticated user
        // But if it doesn't, we can filter here
        let couponsData = response.data.data;
        
        // If backend returns all coupons, filter for current user only
        if (isAuthenticated && user) {
          // Filter coupons that belong to this user OR are public
          // But since you want only personal coupons visible, filter by customer_id
          couponsData = couponsData.filter(coupon => 
            coupon.customer_id === user.id
          );
        } else {
          // If not authenticated, show no coupons (since all are private)
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

  // Fetch coupons when authentication state changes
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

  // Add coupons count
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carousel-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="carousel-slide"
          style={{ backgroundColor: offers[currentIndex].bgColor }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <div className="carousel-content">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ color: offers[currentIndex].textColor }}
            >
              {offers[currentIndex].title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ color: offers[currentIndex].textColor }}
            >
              {offers[currentIndex].subtitle}
            </motion.p>
            <motion.button 
              className="carousel-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              En savoir plus
            </motion.button>
          </div>
          <motion.div 
            className="carousel-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img src={offers[currentIndex].image} alt={offers[currentIndex].title} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      
      <button className="carousel-nav carousel-prev" onClick={() => setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length)}>
        <Icons.ChevronLeft />
      </button>
      <button className="carousel-nav carousel-next" onClick={() => setCurrentIndex((prev) => (prev + 1) % offers.length)}>
        <Icons.ChevronRight />
      </button>
    </div>
  );
};

// Product Card Component
// Update the ProductCard component in your App.js
// ==================== PRODUCT CARD COMPONENT (FIXED) ====================
// ==================== PRODUCT CARD COMPONENT ====================
const ProductCard = ({ 
  product, 
  onAddToCart, 
  onViewDetails, 
  onToggleFavorite, 
  isFavorite,
  isPro,
  proDiscount
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Calculate pro price
  const calculateProPrice = (originalPrice) => {
    if (isPro && proDiscount > 0) {
      const discount = (originalPrice * proDiscount) / 100;
      return Math.round(originalPrice - discount);
    }
    return originalPrice;
  };

  const displayPrice = calculateProPrice(product.price);
  const hasProDiscount = isPro && proDiscount > 0 && displayPrice < product.price;

  // Define handleAddToCart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart && product) {
      const productToAdd = {
        ...product,
        price: displayPrice,
        original_price: hasProDiscount ? product.price : product.original_price
      };
      onAddToCart(productToAdd);
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    }
  };

  // Define handleToggleFavorite
  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (favoriteLoading || !onToggleFavorite || !product) return;
    
    setFavoriteLoading(true);
    try {
      await onToggleFavorite(product.id, isFavorite);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Define handleViewDetails
  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onViewDetails && product) {
      onViewDetails(product);
    }
  };

  if (!product) return null;

  return (
    <motion.div 
      ref={ref}
      className="product-card"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={slideUp}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      <div className="product-image-container">
        <img src={product.image || '/placeholder.jpg'} alt={product.name || 'Product'} className="product-image" />
        
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}
        
        {hasProDiscount && (
          <span className="product-discount pro-discount">
            -{proDiscount}% PRO
          </span>
        )}
        
        {!isPro && product.original_price && (
          <span className="product-discount">
            -{Math.round((1 - product.price / product.original_price) * 100)}%
          </span>
        )}

        <motion.div 
          className="product-actions"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button 
            className="action-btn" 
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={product.stock === 0}
          >
            <Icons.ShoppingBag />
          </motion.button>
          <motion.button 
            className="action-btn"
            onClick={handleViewDetails}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icons.Eye />
          </motion.button>
          <motion.button 
            className={`action-btn ${isFavorite ? 'favorite active' : ''}`}
            onClick={handleToggleFavorite}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={favoriteLoading}
          >
            <Icons.Heart className={favoriteLoading ? 'loading' : ''} />
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {added && (
            <motion.div 
              className="added-animation"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Icons.Check />
            </motion.div>
          )}
        </AnimatePresence>
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
          <span className={`current-price ${hasProDiscount ? 'pro-price' : ''}`}>
            {displayPrice} MAD
          </span>
          
          {hasProDiscount && (
            <span className="original-price">{product.price} MAD</span>
          )}
          
          {!isPro && product.original_price && (
            <span className="original-price">{product.original_price} MAD</span>
          )}
        </div>

        {hasProDiscount && (
          <div className="pro-badge-container">
            <span className="pro-badge-small">
              <Icons.Star size={12} /> Prix PRO
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
// ==================== WISHLIST PAGE ====================
// ==================== WISHLIST PAGE ====================
// ==================== WISHLIST PAGE ====================
const WishlistPage = ({ navigate }) => {
  const { favorites, loading, removeFromFavorites, refreshFavorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isPro, proDiscount } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      refreshFavorites();
    }
  }, [isAuthenticated, navigate]);

  const handleAddToCart = (product) => {
    // Calculate pro price if user is pro
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
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        className="wishlist-page"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
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
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de vos favoris...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <motion.div 
        className="wishlist-page empty-wishlist"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container">
          <Icons.Heart size={64} />
          <h2>Votre wishlist est vide</h2>
          <p>Découvrez nos produits et ajoutez-les à vos favoris</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Découvrir nos produits
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="wishlist-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <div className="page-header">
          <h1>Mes Favoris</h1>
          <p className="favorites-count">{favorites.length} produit(s) dans votre wishlist</p>
        </div>

        <div className="wishlist-grid">
          {favorites.map(product => (
            <div key={product.id} className="wishlist-item">
              <div className="wishlist-item-image" onClick={() => navigate(`/product/${product.slug}`)}>
                <img src={product.image} alt={product.name} />
              </div>
              
              <div className="wishlist-item-info">
                <h3 onClick={() => navigate(`/product/${product.slug}`)}>{product.name}</h3>
                <ProductPrice 
                  price={product.price}
                  originalPrice={product.original_price}
                  isPro={isPro}
                  proDiscount={proDiscount}
                />
                {product.stock > 0 ? (
                  <span className="in-stock">En stock</span>
                ) : (
                  <span className="out-of-stock">Rupture de stock</span>
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
      </div>
    </motion.div>
  );
};
// ==================== COUPONS PAGE ====================
// Update the CouponsPage component
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
// Header Component
// Header Component
// Header Component - Complete fixed version
const Header = ({ currentPath, navigate }) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { setSearchQuery, categories } = useProducts(); // Get categories from ProductContext
  const { favoritesCount } = useFavorites();
  const { couponsCount } = useCoupons();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate('/products');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    setShowCategoryMenu(false);
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <>
      <div className="announcement-bar">
        <div className="marquee">
          <span><Icons.Truck /> LIVRAISON GRATUITE À PARTIR DE 1000DH</span>
        </div>
      </div>

      <motion.header 
        className="header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-top">
          <div className="container">
            <div className="header-left">
              <motion.button 
                className="menu-toggle" 
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                whileHover={{ backgroundColor: 'var(--primary-dark)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Icons.Menu />
                <span>Catégories</span>
              </motion.button>

              <a href="/" className="logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                <img src="https://www.teclab.ma/storage/products/partenaires/teclab-logo-320px.png" alt="TECLAB" />
              </a>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
              <input 
                type="text"
                placeholder="Rechercher un produit..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <motion.button 
                type="submit"
                whileHover={{ backgroundColor: 'var(--primary-dark)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Icons.Search />
              </motion.button>
            </form>

            <div className="header-right">
              {/* Coupons icon with counter */}
              <motion.a 
                href="/coupons" 
                className="header-icon coupons-icon" 
                onClick={(e) => { e.preventDefault(); navigate('/coupons'); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icons.Percent />
                {isAuthenticated && couponsCount > 0 && (
                  <motion.span 
                    className="count coupons-count"
                    key={couponsCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {couponsCount}
                  </motion.span>
                )}
              </motion.a>
              
              {/* Wishlist icon with counter */}
              <motion.a 
                href="/wishlist" 
                className="header-icon wishlist-icon" 
                onClick={(e) => { e.preventDefault(); navigate('/wishlist'); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icons.Heart />
                {isAuthenticated && favoritesCount > 0 && (
                  <motion.span 
                    className="count wishlist-count"
                    key={favoritesCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {favoritesCount}
                  </motion.span>
                )}
              </motion.a>
              
              {/* Cart icon with counter */}
              <div className="ps-cart--mini">
                <motion.a 
                  href="/cart" 
                  className="header-icon cart-icon" 
                  onClick={(e) => { e.preventDefault(); navigate('/cart'); }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icons.ShoppingBag />
                  <motion.span 
                    className="count cart-count"
                    key={cartCount}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    {cartCount}
                  </motion.span>
                </motion.a>
              </div>

              <div className="user-menu">
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
                      <button onClick={handleLogout}>Déconnexion</button>
                    </>
                  ) : (
                    <>
                      <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Connexion</a>
                      <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Inscription</a>
                    </>
                  )}
                </div>
              </div>

              <motion.button 
                className="mobile-menu-toggle" 
                onClick={() => setShowMobileMenu(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icons.Menu />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Categories Mega Menu */}
        <AnimatePresence>
          {showCategoryMenu && (
            <motion.div 
              className="categories-mega-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="container">
                <div className="categories-grid-header">
                  {categories.length > 0 ? (
                    categories.map(category => (
                      <motion.div 
                        key={category.id}
                        className="category-menu-item"
                        whileHover={{ x: 5 }}
                        onClick={() => handleCategoryClick(category.id, category.name)}
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
                      </motion.div>
                    ))
                  ) : (
                    <div className="loading-categories">Chargement des catégories...</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div 
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
            >
              <motion.div 
                className="mobile-menu-content"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="mobile-menu-header">
                  <h3>Menu</h3>
                  <button className="close-btn" onClick={() => setShowMobileMenu(false)}>
                    <Icons.X />
                  </button>
                </div>

                <div className="mobile-menu-body">
                  <div className="mobile-menu-section">
                    <h4>Catégories</h4>
                    <div className="mobile-categories-list">
                      <a 
                        href="/products" 
                        className="mobile-category-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMobileMenu(false);
                          navigate('/products');
                        }}
                      >
                        Tous les produits
                      </a>
                      {categories.map(category => (
                        <a 
                          key={category.id}
                          href={`/products?category=${category.id}`}
                          className="mobile-category-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowMobileMenu(false);
                            navigate(`/products?category=${category.id}`);
                          }}
                        >
                          {category.name}
                          <span className="category-count">{category.products_count || 0}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="mobile-menu-section">
                    <h4>Liens rapides</h4>
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
                        <Icons.Package size={18} /> Produits
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
                      <a 
                        href="/coupons" 
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMobileMenu(false);
                          navigate('/coupons');
                        }}
                      >
                        <Icons.Percent size={18} /> Coupons
                      </a>
                      {isAuthenticated ? (
                        <>
                          <a 
                            href="/dashboard" 
                            onClick={(e) => {
                              e.preventDefault();
                              setShowMobileMenu(false);
                              navigate('/dashboard');
                            }}
                          >
                            <Icons.User size={18} /> Mon Compte
                          </a>
                          <a 
                            href="/orders" 
                            onClick={(e) => {
                              e.preventDefault();
                              setShowMobileMenu(false);
                              navigate('/orders');
                            }}
                          >
                            <Icons.Package size={18} /> Mes Commandes
                          </a>
                          <a 
                            href="/wishlist" 
                            onClick={(e) => {
                              e.preventDefault();
                              setShowMobileMenu(false);
                              navigate('/wishlist');
                            }}
                          >
                            <Icons.Heart size={18} /> Mes Favoris
                          </a>
                          <button onClick={handleLogout} className="mobile-logout-btn">
                            <Icons.LogOut size={18} /> Déconnexion
                          </button>
                        </>
                      ) : (
                        <>
                          <a 
                            href="/login" 
                            onClick={(e) => {
                              e.preventDefault();
                              setShowMobileMenu(false);
                              navigate('/login');
                            }}
                          >
                            <Icons.User size={18} /> Connexion
                          </a>
                          <a 
                            href="/register" 
                            onClick={(e) => {
                              e.preventDefault();
                              setShowMobileMenu(false);
                              navigate('/register');
                            }}
                          >
                            <Icons.User size={18} /> Inscription
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};
// Footer Component
const Footer = ({ navigate }) => {
  return (
    <footer className="footer">
      <div className="container">
        // In Footer component, update the widget section:
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

// ==================== PAGES ====================

// Home Page
// Home Page
const HomePage = ({ navigate }) => {
  const { addToCart } = useCart();
  const { getFeaturedProducts } = useProducts();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, checkIsFavorite } = useFavorites();
  const { isPro, proDiscount } = useAuth(); // Add this line

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
                />
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};
// Products Page
// Products Page - FIXED
// Products Page - REDESIGNED
// Products Page
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
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange
  } = useProducts();
  const { addToCart } = useCart();
  const { toggleFavorite, checkIsFavorite } = useFavorites();
  const { isPro, proDiscount } = useAuth();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  // Get category name from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('category');
    
    if (categoryId && categories.length > 0) {
      const category = categories.find(c => c.id.toString() === categoryId);
      if (category) {
        setSelectedCategory(categoryId);
        setSelectedCategoryName(category.name);
      }
    }
  }, [categories]);

  // Update selected category name when category changes
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const category = categories.find(c => c.id.toString() === selectedCategory);
      if (category) {
        setSelectedCategoryName(category.name);
      }
    } else {
      setSelectedCategoryName('');
    }
  }, [selectedCategory, categories]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      navigate(`/products?category=${categoryId}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <motion.div 
      className="products-page redesigned"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="page-header modern">
        <div className="container">
          <h1>
            {selectedCategoryName ? selectedCategoryName : 'Tous nos produits'}
          </h1>
          <p className="products-count">{totalProducts} produits trouvés</p>
        </div>
      </div>

      <div className="container">
        <div className="products-layout redesigned">
          {/* Desktop Sidebar */}
          <aside className="sidebar redesigned">
            <div className="filter-sidebar redesigned">
              <h3>Filtres</h3>
              
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

              <div className="filter-section">
                <h4>Prix maximum</h4>
                <div className="price-range">
                  <input 
                    type="range" 
                    min="0" 
                    max="50000" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="price-slider"
                  />
                  <div className="price-display">
                    <span>0 MAD</span>
                    <span className="max-price">{priceRange.max} MAD</span>
                  </div>
                </div>
              </div>

              <div className="filter-section">
                <h4>Trier par</h4>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="featured">En vedette</option>
                  <option value="price-asc">Prix: croissant</option>
                  <option value="price-desc">Prix: décroissant</option>
                  <option value="name-asc">Nom: A-Z</option>
                  <option value="name-desc">Nom: Z-A</option>
                </select>
              </div>

              <button className="clear-filters-btn" onClick={clearFilters}>
                <Icons.X size={16} /> Effacer tous les filtres
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="products-main redesigned">
            <div className="products-toolbar redesigned">
              <div className="search-box redesigned">
                <Icons.Search className="search-icon" />
                <input 
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-search" onClick={() => setSearchQuery('')}>
                    <Icons.X size={16} />
                  </button>
                )}
              </div>

              <button 
                className="mobile-filter-btn redesigned" 
                onClick={() => setShowFilter(true)}
              >
                <Icons.Filter /> Filtrer
              </button>
            </div>

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
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination redesigned">
                    <button 
                      className="pagination-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
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
                              onClick={() => setCurrentPage(pageNum)}
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
                      onClick={() => setCurrentPage(currentPage + 1)}
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
                <button className="reset-filters-btn" onClick={clearFilters}>
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {showFilter && (
          <motion.div 
            className="mobile-filter-modal redesigned"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilter(false)}
          >
            <motion.div 
              className="mobile-filter-content redesigned"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="mobile-filter-header">
                <h3>Filtres</h3>
                <button className="close-btn" onClick={() => setShowFilter(false)}>
                  <Icons.X />
                </button>
              </div>

              <div className="mobile-filter-body">
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

                <div className="filter-section">
                  <h4>Prix maximum</h4>
                  <div className="price-range">
                    <input 
                      type="range" 
                      min="0" 
                      max="50000" 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="price-slider"
                    />
                    <div className="price-display">
                      <span>0 MAD</span>
                      <span className="max-price">{priceRange.max} MAD</span>
                    </div>
                  </div>
                </div>

                <div className="filter-section">
                  <h4>Trier par</h4>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
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
                <button className="clear-btn" onClick={clearFilters}>
                  Effacer tout
                </button>
                <button className="apply-btn" onClick={() => setShowFilter(false)}>
                  Appliquer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
// Product Detail Page with Multiple Images
// Product Detail Page with Multiple Images - COMPLETE FIXED VERSION
// Product Detail Page with Multiple Images - COMPLETE FIXED VERSION
const ProductDetailPage = ({ navigate }) => {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { getProduct } = useProducts();
  const { isAuthenticated, isPro, proDiscount } = useAuth();
  const { toggleFavorite, checkIsFavorite } = useFavorites();

  useEffect(() => {
    const path = window.location.pathname;
    const slug = path.split('/').pop();
    loadProduct(slug);
  }, []);

  const loadProduct = async (slug) => {
    setLoading(true);
    try {
      const data = await getProduct(slug);
      console.log('Product data:', data); // Debug log
      if (data) {
        setProduct(data.product || data);
        setRelated(data.related || []);
        setIsFavorite(data.is_favorite || false);
      }
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };

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
    
    // Calculate pro price if user is pro
    let priceToUse = product.price;
    if (isPro && proDiscount > 0 && product.original_price) {
      priceToUse = product.price; // Price already has pro discount applied from backend
    }
    
    const productToAdd = {
      ...product,
      price: priceToUse
    };
    
    addToCart(productToAdd, quantity);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du produit...</p>
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

  // Get all images - use images_array from API or fallback to single image
  const productImages = product.images_array || (product.images ? product.images.map(img => img.image_path) : [product.image]);
  const hasProDiscount = isPro && proDiscount > 0 && product.original_price && product.original_price > product.price;

  return (
    <motion.div 
      className="product-detail-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
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
              <img src={productImages[selectedImage] || product.image} alt={product.name} />
              {hasProDiscount && (
                <span className="product-discount pro-discount">
                  -{proDiscount}% PRO
                </span>
              )}
              {product.badge && (
                <span className="product-badge">{product.badge}</span>
              )}
            </div>
            
            {/* Thumbnail Images - Show if more than 1 image */}
            {productImages.length > 1 && (
              <div className="thumbnail-images">
                {productImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
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

            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}>★</span>
              ))}
              <span className="rating-count">({product.reviews_count || 0} avis)</span>
            </div>

            <div className="product-price">
              <span className={`current-price ${hasProDiscount ? 'pro-price' : ''}`}>
                {product.price} MAD
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="original-price">{product.original_price} MAD</span>
              )}
              {hasProDiscount && (
                <span className="pro-badge">Prix PRO -{proDiscount}%</span>
              )}
            </div>

            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">
                  <Icons.Check size={16} /> En stock ({product.stock} disponibles)
                </span>
              ) : (
                <span className="out-of-stock">
                  <Icons.X size={16} /> Rupture de stock
                </span>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

           // In ProductDetailPage, update the features section:

{product.features && (
  <div className="product-features">
    <h3>Caractéristiques</h3>
    <ul>
      {(() => {
        // Handle different types of features
        let featuresList = [];
        
        if (Array.isArray(product.features)) {
          // If it's already an array
          featuresList = product.features;
        } else if (typeof product.features === 'string') {
          try {
            // Try to parse JSON string
            const parsed = JSON.parse(product.features);
            featuresList = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            // If not valid JSON, treat as single string
            featuresList = [product.features];
          }
        } else if (product.features) {
          // If it's something else, convert to string
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
                className={`wishlist-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleAddToWishlist}
              >
                <Icons.Heart /> {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </button>
            </div>

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

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="related-products">
            <h3>Produits similaires</h3>
            <div className="products-grid">
              {related.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                  onViewDetails={(product) => navigate(`/product/${product.slug}`)}
                  isFavorite={checkIsFavorite(product.id)}
                  onToggleFavorite={toggleFavorite}
                  isPro={isPro}
                  proDiscount={proDiscount}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
// Checkout Page
// Checkout Page - FIXED (without coupon dependency)
// Checkout Page
// Update CheckoutPage component
// In CheckoutPage, add coupon display
// Checkout Page - COMPLETE FIXED VERSION
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

  // Calculate totals with coupon
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

        {/* Show applied coupon */}
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
// Add this component before the ProductCard
const ProductPrice = ({ price, originalPrice, isPro, proDiscount }) => {
  const calculateProPrice = () => {
    if (isPro && proDiscount > 0) {
      const discount = (price * proDiscount) / 100;
      return Math.round(price - discount);
    }
    return price;
  };

  const displayPrice = calculateProPrice();
  const hasProDiscount = isPro && proDiscount > 0 && displayPrice < price;

  if (hasProDiscount) {
    return (
      <div className="product-price pro-price">
        <span className="current-price pro">{displayPrice} MAD</span>
        <span className="original-price">{price} MAD</span>
        <span className="pro-badge">-{proDiscount}% PRO</span>
      </div>
    );
  }
  
  return (
    <div className="product-price">
      <span className="current-price">{price} MAD</span>
      {originalPrice && originalPrice > price && (
        <span className="original-price">{originalPrice} MAD</span>
      )}
    </div>
  );
};

// In your ProductCard component, use it like this:

// Cart Page
// Update CartPage component
// Update CartPage component with proper number handling
// Cart Page - COMPLETE FIXED VERSION
const CartPage = ({ navigate }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { validateCoupon, appliedCoupon, discount, removeCoupon } = useCoupons();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Ensure discount is a number
  const discountAmount = typeof discount === 'number' ? discount : parseFloat(discount) || 0;
  const subtotal = typeof cartTotal === 'number' ? cartTotal : parseFloat(cartTotal) || 0;
  
  // Calculate totals with discount
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shipping = subtotalAfterDiscount > 1000 ? 0 : 50;
  const tax = subtotalAfterDiscount * 0.2;
  const grandTotal = subtotalAfterDiscount + shipping + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Veuillez entrer un code promo');
      return;
    }

    setApplyingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      console.log('🔍 Applying coupon:', couponCode);
      console.log('🔍 Cart subtotal:', subtotal);
      
      await validateCoupon(couponCode, subtotal);
      setCouponCode('');
      setCouponSuccess('✅ Coupon appliqué avec succès!');
      setTimeout(() => setCouponSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Coupon error:', err);
      // Display the specific error message from the backend
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

  // Format number to 2 decimal places safely
  const formatPrice = (value) => {
    const num = typeof value === 'number' ? value : parseFloat(value) || 0;
    return num.toFixed(2);
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
                  <span className="item-price">{formatPrice(item.price)} MAD</span>
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
                  {formatPrice(item.price * item.quantity)} MAD
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
            
            {/* Coupon Section */}
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
              <span>Sous-total après réduction</span>
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
              <span>Total</span>
              <span>{formatPrice(grandTotal)} MAD</span>
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

// Login Page
const LoginPage = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
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

// Register Page
// Update the RegisterPage component to include phone and address fields
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
// Dashboard Page
// Dashboard Page - ORIGINAL VERSION
// Dashboard Page - COMPLETE FIXED VERSION
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
    
    // Check if response exists and has success flag
    if (response && response.success) {
      setVerificationMessage('Email de vérification renvoyé avec succès !');
    } else {
      // If we got here without error, assume success
      setVerificationMessage('Email de vérification renvoyé avec succès !');
    }
  } catch (err) {
    console.error('Resend error:', err);
    
    // Get error message from response if available
    const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de l\'envoi';
    setVerificationMessage(errorMessage);
  } finally {
    setVerificationLoading(false);
    
    // Clear message after 5 seconds
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
        
{/* Debug - Remove after fixing */}
<div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
  <h4>Debug Info</h4>
  <p><strong>Email verified_at:</strong> {user?.email_verified_at || 'null'}</p>
  <p><strong>isEmailVerified:</strong> {user?.email_verified_at !== null ? 'true' : 'false'}</p>
  <button 
    onClick={() => {
      // Force refresh user data
      api.get('/auth/me').then(res => {
        if (res.data.success) {
          const updatedUser = res.data.data;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.location.reload();
        }
      });
    }}
    style={{ padding: '5px 10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
  >
    🔄 Refresh User Data
  </button>
</div>
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
// Order Detail Page
const OrderDetailPage = ({ navigate }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const orderId = path.split('/').pop();
    fetchOrder(orderId);
  }, []);

  const fetchOrder = async (orderId) => {
  setLoading(true);
  try {
    console.log('Fetching order:', orderId);
    const response = await api.get(`/orders/${orderId}`);
    console.log('Order response:', response.data);
    
    if (response.data.success && response.data.data) {
      setOrder(response.data.data);
    } else {
      console.error('Order not found in response');
    }
  } catch (err) {
    console.error('Failed to fetch order:', err);
    console.error('Error response:', err.response?.data);
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
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
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

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  if (!order) {
    return <div className="not-found">Commande non trouvée</div>;
  }

  return (
    <motion.div 
      className="order-detail-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <div className="order-detail-header">
          <h1>Commande #{order.order_number}</h1>
          <span className={`order-status ${getStatusClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="order-info-grid">
          <div className="info-card">
            <h3>Date</h3>
            <p>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>

          <div className="info-card">
            <h3>Adresse de livraison</h3>
            <p>{order.shipping_address}</p>
          </div>

          <div className="info-card">
            <h3>Mode de paiement</h3>
            <p>{order.payment_method === 'carte' ? 'Carte bancaire' : 'Espèces à la livraison'}</p>
          </div>

          {order.coupon && (
            <div className="info-card">
              <h3>Coupon appliqué</h3>
              <p>{order.coupon.code} - {order.discount_amount} MAD de réduction</p>
            </div>
          )}
        </div>

        <div className="order-items-section">
          <h2>Articles commandés</h2>
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
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td>{item.price} MAD</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toFixed(2)} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="order-totals">
            <div className="total-row">
              <span>Sous-total</span>
              <span>{order.subtotal} MAD</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="total-row discount">
                <span>Réduction</span>
                <span>-{order.discount_amount} MAD</span>
              </div>
            )}
            <div className="total-row">
              <span>Livraison</span>
              <span>{order.shipping > 0 ? `${order.shipping} MAD` : 'Gratuite'}</span>
            </div>
            <div className="total-row">
              <span>TVA (20%)</span>
              <span>{order.tax} MAD</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>{order.total} MAD</span>
            </div>
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
    </motion.div>
  );
};
// Email Verification Success Page
// Email Verification Success Page
const VerificationSuccessPage = ({ navigate }) => {
  const { checkVerification } = useAuth();
  
  useEffect(() => {
    const refreshUser = async () => {
      // Refresh user data from backend
      if (checkVerification) {
        await checkVerification();
      }
      
      // Redirect after 3 seconds
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

// Email Verification Error Page
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
// Orders Page
const OrdersPage = ({ navigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, navigate]);

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

  if (loading) {
    return (
      <motion.div 
        className="orders-page"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container">
          <h1>Mes Commandes</h1>
          <div className="loading-spinner">Chargement de vos commandes...</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="orders-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <h1>Mes Commandes</h1>

        {orders.length === 0 ? (
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
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <motion.div
                key={order.id}
                className="order-card"
                variants={slideUp}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="order-header">
                  <div className="order-header-left">
                    <h3>Commande #{order.order_number}</h3>
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
                    <strong>{order.total} MAD</strong>
                  </div>
                  {order.payment_method === 'espèces' && (
                    <span className="payment-badge">
                      <Icons.Truck size={14} />
                      Paiement à la livraison
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
// ==================== ADMIN PAGES ====================

// Admin Dashboard Page
const AdminDashboardPage = ({ navigate }) => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Wait for user to load
    if (user === undefined) return;
    
    console.log('🔍 User loaded:', user);
    
    // Check if user is null (not logged in) or not admin
    if (!user || user.role !== 'admin') {
      console.log('🔍 Not admin or not logged in, redirecting');
      navigate('/');
      return;
    }
    
    setCheckingAuth(false);
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/orders?per_page=5')
      ]);
      
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (ordersRes.data.success) {
        setRecentOrders(ordersRes.data.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (checkingAuth || loading) {
    return (
      <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="admin-dashboard"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <h1>Tableau de bord administrateur</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Icons.ShoppingBag size={32} />
            </div>
            
            <div className="stat-content">
              <h3>Commandes totales</h3>
              <p className="stat-number">{stats?.total_orders || 0}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Icons.Truck size={32} />
            </div>
            <div className="stat-content">
              <h3>Commandes en cours</h3>
              <p className="stat-number">{stats?.pending_orders || 0}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Icons.Check size={32} />
            </div>
            <div className="stat-content">
              <h3>Commandes livrées</h3>
              <p className="stat-number">{stats?.completed_orders || 0}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Icons.Users size={32} />
            </div>
            <div className="stat-content">
              <h3>Clients</h3>
              <p className="stat-number">{stats?.total_customers || 0}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Icons.Package size={32} />
            </div>
            <div className="stat-content">
              <h3>Produits</h3>
              <p className="stat-number">{stats?.total_products || 0}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Icons.Percent size={32} />
            </div>
            <div className="stat-content">
              <h3>Revenu total</h3>
              <p className="stat-number">{stats?.total_revenue || 0} MAD</p>
            </div>
          </div>
        </div>

        <div className="recent-orders-section">
          <h2>Commandes récentes</h2>
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
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.customer?.name}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.total} MAD</td>
                  <td>
                    <span className={`status-badge ${
                      order.status === 'en cours' ? 'status-pending' : 
                      order.status === 'expédiée' ? 'status-shipped' : 
                      order.status === 'livré' ? 'status-delivered' : 'status-cancelled'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="view-btn"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="view-all">
            <button onClick={() => navigate('/admin/orders')}>
              Voir toutes les commandes
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
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
// ==================== ABOUT PAGE ====================
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

  // Animation variants
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
      {/* Hero Section with Parallax */}
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
        
        {/* Animated floating elements */}
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

      {/* Stats Section with Counter Animation */}
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

      {/* History Section with Reveal Animation */}
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

      {/* Quality Commitment Section */}
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

      {/* Values Section with Card Flip Effect */}
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

      {/* Categories Section */}
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

      {/* Why Choose Us Section */}
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

      {/* Contact Info - ONLY MAIL AND PHONE, NO LINKS TO OTHER PAGES */}
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
// ==================== MAIN APP ====================
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
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
  if (basePath === '/about') return <AboutPage navigate={navigate} />;
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
  
  // Admin routes - THESE SHOULD BE HERE
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
  <AuthProvider>
    <CartProvider>
      <ProductProvider>
        <CouponProvider>
          <FavoritesProvider> {/* Add this */}
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
          </FavoritesProvider> {/* Add this */}
        </CouponProvider>
      </ProductProvider>
    </CartProvider>
  </AuthProvider>
);
}

export default App;