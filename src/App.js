import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import './App.css';

// ==================== ICON COMPONENTS ====================
const Icons = {
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
  Gift: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
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
  ChevronDown: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevronUp: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <polyline points="18 15 12 9 6 15" />
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
  RefreshCw: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  CreditCard: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  Headphones: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  MapPin: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Mail: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
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
  LogIn: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  Facebook: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Twitter: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
  Youtube: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  Linkedin: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  WhatsApp: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Ticket: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
      <circle cx="8" cy="12" r="1" />
      <circle cx="16" cy="12" r="1" />
    </svg>
  ),
  RProject: (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
};

// ==================== ANIMATION VARIANTS ====================
// Optimized variants for better performance
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

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  }
};

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};

// ==================== DATA ====================

const categories = [
  { 
    id: 38, 
    name: 'TUBES DE PRELEVEMENT', 
    slug: 'tubes-de-prelevement', 
    color: '#6d9eeb', 
    count: 45, 
    image: 'https://www.teclab.ma/storage/products/tube-sous-vide/whatsapp-image-2026-01-21-at-140953-photoroom-300x300.png'
  },
  { 
    id: 40, 
    name: 'AIGUILLES ET ACCESSOIRES', 
    slug: 'aiguilles-et-accessoires', 
    color: '#ff6b6b', 
    count: 32, 
    image: 'https://www.teclab.ma/storage/products/aiguilles/whatsapp-image-2026-01-22-at-115703-300x300.jpeg'
  },
  { 
    id: 41, 
    name: 'CONSOMMABLES DE LABORATOIRE', 
    slug: 'consommables', 
    color: '#4ecdc4', 
    count: 78, 
    image: 'https://www.teclab.ma/storage/products/chatgpt-image-feb-26-2026-02-01-23-pm-300x300.png'
  },
  { 
    id: 75, 
    name: 'REACTIFS DE LABORATOIRE', 
    slug: 'reactifs', 
    color: '#45b7d1', 
    count: 56, 
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg'
  },
  { 
    id: 95, 
    name: 'ANALYSEURS', 
    slug: 'analyseurs', 
    color: '#f9ca24', 
    count: 23, 
    image: 'https://www.teclab.ma/storage/products/machine/chatgpt-image-feb-14-2026-12-09-48-pm-300x300.png'
  },
  { 
    id: 116, 
    name: 'EQUIPEMENTS DE LABORATOIRE', 
    slug: 'equipements', 
    color: '#a55eea', 
    count: 34, 
    image: 'https://www.teclab.ma/storage/products/divers/gemini-generated-image-mt5nx2mt5nx2mt5n-300x300.jpg'
  },
];

// Carousel offers data
const carouselOffers = [
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
];

const products = [
  {
    id: 1,
    name: 'Tube PRP GEL+NC1:9',
    slug: 'tube-prp-gelnc19',
    sku: 'KS100PRP',
    price: 140,
    originalPrice: 150,
    category: 'TUBES DE PRELEVEMENT',
    categoryId: 38,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/tube-sous-vide/whatsapp-image-2026-01-21-at-140953-photoroom-300x300.png',
    description: 'Tube PRP jetable avec ACD+GEL. La cellulose, la fibronectine et la vitronectine contenues dans le PRP peuvent transformer le PRP contenant de la thrombine en gel. Le PRP peut favoriser la régénération osseuse, augmenter la densité osseuse et favoriser la cicatrisation des plaies.',
    features: [
      'Tube PRP stérile, à usage unique',
      'Diamètre: 15mm, bouchon: 18mm',
      'Modèle 10ml: jusqu\'à 9ml de sang',
      'Modèle 15ml: jusqu\'à 12ml de sang',
      'Certifié CE classe IIa'
    ],
    attributes: {
      condition: ['Unité', 'Boîte/100'],
      color: ['BLUE', 'GREEN'],
      size: ['10ML', '15ML']
    },
    stock: 45,
    rating: 4.5,
    reviews: 12,
    badge: 'Hot',
    featured: true
  },
  {
    id: 2,
    name: 'Tube Sous Vide ESR 1,6ml en Verre',
    slug: 'tube-sous-vide-esr',
    sku: 'ESR001',
    price: 120,
    originalPrice: null,
    category: 'TUBES DE PRELEVEMENT',
    categoryId: 38,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/tube-sous-vide/gemini-generated-image-b4on7wb4on7wb4on-300x300.jpg',
    description: 'Tube sous vide pour vitesse de sédimentation (ESR) en verre de haute qualité. Idéal pour les tests de laboratoire précis.',
    stock: 38,
    rating: 4.2,
    reviews: 8,
    badge: 'Hot',
    featured: true
  },
  {
    id: 3,
    name: 'Tube Sous Vide Fluoré De Potassium',
    slug: 'tube-sous-vide-fluor',
    sku: 'FLU002',
    price: 130,
    originalPrice: null,
    category: 'TUBES DE PRELEVEMENT',
    categoryId: 38,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/tube-sous-vide/wechatimage-202209012048532-600x-300x300.jpg',
    description: 'Tube sous vide avec fluorure de potassium pour la stabilisation du glucose.',
    stock: 52,
    rating: 4.7,
    reviews: 15,
    badge: 'Hot'
  },
  {
    id: 4,
    name: 'Tube Sous Vide avec Gel Séparateur',
    slug: 'tube-sous-vide-gel',
    sku: 'GEL003',
    price: 140,
    originalPrice: null,
    category: 'TUBES DE PRELEVEMENT',
    categoryId: 38,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/tube-sous-vide/wechatimage-202209012048541-2a25-300x300.jpg',
    description: 'Tube sous vide avec gel séparateur pour une séparation optimale du sérum.',
    stock: 27,
    rating: 4.3,
    reviews: 10,
    badge: 'Hot'
  },
  {
    id: 5,
    name: 'Tube Sous Vide Héparine',
    slug: 'tube-sous-vide-heparine',
    sku: 'HEP004',
    price: 125,
    originalPrice: null,
    category: 'TUBES DE PRELEVEMENT',
    categoryId: 38,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/tube-sous-vide/wechatimage-20220901204853-1200x-300x300.jpg',
    description: 'Tube sous vide avec héparine de lithium pour les tests de chimie clinique.',
    stock: 63,
    rating: 4.6,
    reviews: 14
  },
  {
    id: 6,
    name: 'Tube Sous Vide Citrate pour V.S',
    slug: 'tube-sous-vide-citrate-vs',
    sku: 'CIT005',
    price: 135,
    originalPrice: null,
    category: 'TUBES DE PRELEVEMENT',
    categoryId: 38,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/tube-sous-vide/whatsapp-image-2026-01-21-at-140429-1-photoroom-300x300.png',
    description: 'Tube sous vide avec citrate de sodium pour la vitesse de sédimentation.',
    stock: 41,
    rating: 4.4,
    reviews: 9
  },
  {
    id: 7,
    name: 'Tube Sous Vide Citrate pour Coagulation',
    slug: 'tube-sous-vide-citrate-coag',
    sku: 'CIT006',
    price: 138,
    originalPrice: null,
    category: 'TUBES DE PRELEVEMENT',
    categoryId: 38,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/tube-sous-vide/wechatimage-20220901204854-1024x-300x300.jpg',
    description: 'Tube sous vide avec citrate de sodium pour les tests de coagulation.',
    stock: 35,
    rating: 4.5,
    reviews: 11
  },
  {
    id: 8,
    name: 'Tube Sous Vide EDTA',
    slug: 'tube-sous-vide-edta',
    sku: 'EDTA007',
    price: 125,
    originalPrice: null,
    category: 'TUBES DE PRELEVEMENT',
    categoryId: 38,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/tube-sous-vide/65309-home-default-300x300.jpg',
    description: 'Tube sous vide avec EDTA pour les analyses hématologiques.',
    stock: 58,
    rating: 4.6,
    reviews: 13
  },
  {
    id: 9,
    name: 'Tube Sous Vide SEC avec Activateur',
    slug: 'tube-sous-vide-sec',
    sku: 'SEC008',
    price: 132,
    originalPrice: null,
    category: 'TUBES DE PRELEVEMENT',
    categoryId: 38,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/tube-sous-vide/wechatimage-202209012048531-1200x-300x300.webp',
    description: 'Tube sous vide avec activateur de coagulation pour les tests biochimiques.',
    stock: 42,
    rating: 4.4,
    reviews: 9
  },
  {
    id: 10,
    name: 'Tampon Alcoolisé',
    slug: 'tampon-alcoolise',
    sku: 'TAM001',
    price: 45,
    originalPrice: null,
    category: 'AIGUILLES ET ACCESSOIRES',
    categoryId: 40,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/aiguilles/whatsapp-image-2026-01-22-at-115900-300x300.jpeg',
    description: 'Tampons alcoolisés individuels pour la désinfection de la peau avant prélèvement.',
    stock: 200,
    rating: 4.1,
    reviews: 6,
    badge: 'Hot'
  },
  {
    id: 11,
    name: 'Garrot avec crochet',
    slug: 'garrot-crochet',
    sku: 'GAR002',
    price: 65,
    originalPrice: null,
    category: 'AIGUILLES ET ACCESSOIRES',
    categoryId: 40,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/aiguilles/whatsapp-image-2026-01-22-at-115548-300x300.jpeg',
    description: 'Garrot professionnel avec système de crochet pour un maintien facile.',
    stock: 85,
    rating: 4.3,
    reviews: 7,
    badge: 'Hot'
  },
  {
    id: 12,
    name: 'Corps avec éjection d\'aiguille',
    slug: 'corps-ejection-aiguille',
    sku: 'COR003',
    price: 85,
    originalPrice: null,
    category: 'AIGUILLES ET ACCESSOIRES',
    categoryId: 40,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/aiguilles/whatsapp-image-2026-01-22-at-115425-300x300.jpeg',
    description: 'Corps de prélèvement avec système d\'éjection d\'aiguille intégré.',
    stock: 42,
    rating: 4.5,
    reviews: 11,
    badge: 'Hot'
  },
  {
    id: 13,
    name: 'Corps pour Aiguille',
    slug: 'corps-aiguille',
    sku: 'COR004',
    price: 55,
    originalPrice: null,
    category: 'AIGUILLES ET ACCESSOIRES',
    categoryId: 40,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/aiguilles/whatsapp-image-2026-01-22-at-115222-300x300.jpeg',
    description: 'Corps de prélèvement standard compatible avec la plupart des aiguilles.',
    stock: 97,
    rating: 4.2,
    reviews: 5
  },
  {
    id: 14,
    name: 'Aiguille Hypodermique 25G',
    slug: 'aiguille-hypodermique-25g',
    sku: 'AIG005',
    price: 35,
    originalPrice: null,
    category: 'AIGUILLES ET ACCESSOIRES',
    categoryId: 40,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/aiguilles/whatsapp-image-2026-01-22-at-115703-300x300.jpeg',
    description: 'Aiguille hypodermique stérile 25G x 1 pouce. Pour injections et prélèvements.',
    stock: 150,
    rating: 4.4,
    reviews: 8
  },
  {
    id: 15,
    name: 'Aiguille épicrânienne',
    slug: 'aiguille-epicranienne',
    sku: 'AIG006',
    price: 38,
    originalPrice: null,
    category: 'AIGUILLES ET ACCESSOIRES',
    categoryId: 40,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/aiguilles/whatsapp-image-2026-01-22-at-120743-300x300.jpeg',
    description: 'Aiguille épicrânienne pour prélèvements spécifiques.',
    stock: 75,
    rating: 4.3,
    reviews: 6
  },
  {
    id: 16,
    name: 'Aiguille avec vision 22G',
    slug: 'aiguille-vision-22g',
    sku: 'AIG007',
    price: 42,
    originalPrice: null,
    category: 'AIGUILLES ET ACCESSOIRES',
    categoryId: 40,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/aiguilles/whatsapp-image-2026-01-22-at-114911-1-300x300.jpeg',
    description: 'Aiguille avec chambre de vision pour un contrôle optimal du flux sanguin.',
    stock: 62,
    rating: 4.6,
    reviews: 9
  },
  {
    id: 17,
    name: 'Aiguille sous vide 21G',
    slug: 'aiguille-sous-vide-21g',
    sku: 'AIG008',
    price: 40,
    originalPrice: null,
    category: 'AIGUILLES ET ACCESSOIRES',
    categoryId: 40,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/aiguilles/whatsapp-image-2026-01-21-at-165605-300x300.jpeg',
    description: 'Aiguille sous vide standard 21G pour prélèvement sanguin.',
    stock: 120,
    rating: 4.5,
    reviews: 10
  },
  {
    id: 18,
    name: 'Sparadrap CURE-AID',
    slug: 'sparadrap-cure-aid',
    sku: 'SPA001',
    price: 150,
    originalPrice: 200,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Cure-Aid',
    image: 'https://www.teclab.ma/storage/products/chatgpt-image-feb-26-2026-02-01-23-pm-300x300.png',
    description: 'Sparadrap hypoallergénique pour fixation de pansements et compresses.',
    stock: 75,
    rating: 4.4,
    reviews: 18,
    discount: '-25%'
  },
  {
    id: 19,
    name: 'RACK/cône Blanc 96 Trous',
    slug: 'rack-cone-blanc-96',
    sku: 'RAC001',
    price: 95,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Labware',
    image: 'https://www.teclab.ma/storage/products/aiguilles/chatgpt-image-feb-24-2026-02-31-01-pm-300x300.png',
    description: 'Rack pour cônes de pipettes, 96 trous. Compatible avec la plupart des pipettes automatiques.',
    stock: 30,
    rating: 4.2,
    reviews: 7,
    badge: 'Hot'
  },
  {
    id: 20,
    name: 'Ecouvillon stérile tige en bois',
    slug: 'ecouvillon-sterile-bois',
    sku: 'ECO001',
    price: 75,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Carestainer',
    image: 'https://www.teclab.ma/storage/products/eccouvillons/gemini-generated-image-dp8g8idp8g8idp8g-300x300.jpg',
    description: 'Ecouvillon stérile avec tige en bois pour prélèvements microbiologiques.',
    stock: 200,
    rating: 4.3,
    reviews: 9,
    badge: 'Hot'
  },
  {
    id: 21,
    name: 'CUPULE ACCESS 2',
    slug: 'cupule-access-2',
    sku: 'CUP001',
    price: 180,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Beckman Coulter',
    image: 'https://www.teclab.ma/storage/products/autre/chatgpt-image-feb-24-2026-01-32-00-pm-300x300.png',
    description: 'Cupule pour analyseur ACCESS 2 de Beckman Coulter.',
    stock: 120,
    rating: 4.5,
    reviews: 12
  },
  {
    id: 22,
    name: 'CUVETTE HITACHI',
    slug: 'cuvette-hitachi',
    sku: 'CUV001',
    price: 220,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Hitachi',
    image: 'https://www.teclab.ma/storage/products/cupule-godet/gemini-generated-image-2gfnvt2gfnvt2gfn-300x300.jpg',
    description: 'Cuvette pour analyseurs Hitachi, haute qualité optique.',
    stock: 85,
    rating: 4.7,
    reviews: 8
  },
  {
    id: 23,
    name: 'CUVETTE KONELAB',
    slug: 'cuvette-konelab',
    sku: 'CUV002',
    price: 210,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Konelab',
    image: 'https://www.teclab.ma/storage/products/cupule-godet/gemini-generated-image-k4t0klk4t0klk4t0-300x300.jpg',
    description: 'Cuvette pour analyseurs Konelab, précision et fiabilité.',
    stock: 64,
    rating: 4.6,
    reviews: 7
  },
  {
    id: 24,
    name: 'FLACON DE BILLE STAGO',
    slug: 'flacon-bille-stago',
    sku: 'FLA001',
    price: 195,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Stago',
    image: 'https://www.teclab.ma/storage/products/cupule-godet/gemini-generated-image-evfpdyevfpdyevfp-300x300.png',
    description: 'Flacon de billes pour analyseurs Stago, qualité garantie.',
    stock: 45,
    rating: 4.8,
    reviews: 5
  },
  {
    id: 25,
    name: 'CUVETTE STAGO',
    slug: 'cuvette-stago',
    sku: 'CUV003',
    price: 185,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Stago',
    image: 'https://www.teclab.ma/storage/products/cupule-godet/gemini-generated-image-4dbarv4dbarv4dba-300x300.jpg',
    description: 'Cuvette pour analyseurs Stago, qualité optique optimale.',
    stock: 52,
    rating: 4.5,
    reviews: 6
  },
  {
    id: 26,
    name: 'CUPULE pour SYSMEX CS',
    slug: 'cupule-sysmex-cs',
    sku: 'CUP002',
    price: 175,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Sysmex',
    image: 'https://www.teclab.ma/storage/products/cupule-godet/gemini-generated-image-91dpm491dpm491dp-300x300.jpg',
    description: 'Cupule pour analyseur SYSMEX CS, précision garantie.',
    stock: 38,
    rating: 4.7,
    reviews: 4
  },
  {
    id: 27,
    name: 'CUPULE pour SYSMEX CA',
    slug: 'cupule-sysmex-ca',
    sku: 'CUP003',
    price: 170,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Sysmex',
    image: 'https://www.teclab.ma/storage/products/cupule-godet/gemini-generated-image-qmaokxqmaokxqmao-300x300.jpg',
    description: 'Cupule pour analyseur SYSMEX CA, qualité supérieure.',
    stock: 42,
    rating: 4.6,
    reviews: 5
  },
  {
    id: 28,
    name: 'CUPULE pour A15/A25',
    slug: 'cupule-a15-a25',
    sku: 'CUP004',
    price: 155,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/products/cupule-godet/gemini-generated-image-ypliy4ypliy4ypli-300x300.jpg',
    description: 'Cupule pour automates A15 et A25, compatible avec Bioelab.',
    stock: 56,
    rating: 4.4,
    reviews: 7
  },
  {
    id: 29,
    name: 'Micropipette Fixe',
    slug: 'micropipette-fixe',
    sku: 'MIC001',
    price: 450,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Labware',
    image: 'https://www.teclab.ma/storage/products/micropipettes/gemini-generated-image-l3thb9l3thb9l3th-300x300.jpg',
    description: 'Micropipette à volume fixe, précision et ergonomie.',
    stock: 25,
    rating: 4.8,
    reviews: 10
  },
  {
    id: 30,
    name: 'Micropipette Réglable',
    slug: 'micropipette-reglable',
    sku: 'MIC002',
    price: 580,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Labware',
    image: 'https://www.teclab.ma/storage/products/micropipettes/gemini-generated-image-vpzim5vpzim5vpzi-300x300.jpg',
    description: 'Micropipette à volume réglable, haute précision.',
    stock: 18,
    rating: 4.9,
    reviews: 8
  },
  {
    id: 31,
    name: 'Parafilm 10cm*38m',
    slug: 'parafilm',
    sku: 'PAR001',
    price: 220,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Parafilm',
    image: 'https://www.teclab.ma/storage/products/divers/gemini-generated-image-ltg7n2ltg7n2ltg7-300x300.jpg',
    description: 'Parafilm pour l\'étanchéité des récipients de laboratoire.',
    stock: 45,
    rating: 4.7,
    reviews: 12
  },
  {
    id: 32,
    name: 'Pince en bois',
    slug: 'pince-bois',
    sku: 'PIN001',
    price: 25,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Labware',
    image: 'https://www.teclab.ma/storage/products/divers/gemini-generated-image-nt2q37nt2q37nt2q-300x300.jpg',
    description: 'Pince en bois pour la manipulation d\'objets chauds.',
    stock: 150,
    rating: 4.2,
    reviews: 15
  },
  {
    id: 33,
    name: 'Micropipette multicanaux',
    slug: 'micropipette-multicanaux',
    sku: 'MIC003',
    price: 890,
    originalPrice: null,
    category: 'CONSOMMABLES DE LABORATOIRE',
    categoryId: 41,
    brand: 'Labware',
    image: 'https://www.teclab.ma/storage/products/micropipettes/gemini-generated-image-vedalrvedalrveda-300x300.jpg',
    description: 'Micropipette multicanaux 8 canaux pour plaques 96 puits.',
    stock: 8,
    rating: 4.9,
    reviews: 4
  },
  {
    id: 34,
    name: 'Analyseur de biochimie BT-330',
    slug: 'analyseur-bt330',
    sku: 'ANA001',
    price: 15000,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/products/machine/chatgpt-image-feb-14-2026-12-09-48-pm-300x300.png',
    description: 'Analyseur de biochimie entièrement automatisé. Haute précision et rapidité.',
    stock: 5,
    rating: 4.8,
    reviews: 3
  },
  {
    id: 35,
    name: 'Analyseur VS SD-100',
    slug: 'analyseur-sd100',
    sku: 'ANA002',
    price: 12000,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Succeeder',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-eim67heim67heim6-300x300.png',
    description: 'Analyseur pour vitesse de sédimentation, automatisé et précis.',
    stock: 3,
    rating: 4.6,
    reviews: 2
  },
  {
    id: 36,
    name: 'Analyseur AS-380',
    slug: 'analyseur-as380',
    sku: 'ANA003',
    price: 18000,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-h7hvj8h7hvj8h7hv-300x300.png',
    description: 'Analyseur de biochimie haute performance avec grande capacité.',
    stock: 2,
    rating: 4.9,
    reviews: 4
  },
  {
    id: 37,
    name: 'Analyseur AS-280',
    slug: 'analyseur-as280',
    sku: 'ANA004',
    price: 14500,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/products/machine/3406e3f080cff89509270b153c5605af-300x300.png',
    description: 'Analyseur de biochimie compact et efficace.',
    stock: 4,
    rating: 4.7,
    reviews: 3,
    badge: 'Hot'
  },
  {
    id: 38,
    name: 'Analyseur BH-5390',
    slug: 'analyseur-bh5390',
    sku: 'ANA005',
    price: 22000,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Urit',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-yew64uyew64uyew6-300x300.png',
    description: 'Analyseur d\'hématologie 5-part avec automate complet.',
    stock: 2,
    rating: 4.8,
    reviews: 2
  },
  {
    id: 39,
    name: 'Analyseur BH-5100',
    slug: 'analyseur-bh5100',
    sku: 'ANA006',
    price: 25000,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Urit',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-ah1r0rah1r0rah1r-300x300.png',
    description: 'Analyseur d\'hématologie haute capacité.',
    stock: 1,
    rating: 4.9,
    reviews: 1
  },
  {
    id: 40,
    name: 'Analyseur SF-8100',
    slug: 'analyseur-sf8100',
    sku: 'ANA007',
    price: 28000,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Succeeder',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-vitlwbvitlwbvitl-300x300.png',
    description: 'Analyseur de coagulation entièrement automatisé.',
    stock: 2,
    rating: 4.8,
    reviews: 2
  },
  {
    id: 41,
    name: 'Analyseur SF-8050',
    slug: 'analyseur-sf8050',
    sku: 'ANA008',
    price: 16500,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Succeeder',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-pvfxm2pvfxm2pvfx-300x300.png',
    description: 'Analyseur de coagulation semi-automatique.',
    stock: 3,
    rating: 4.6,
    reviews: 2
  },
  {
    id: 42,
    name: 'Analyseur SF-400',
    slug: 'analyseur-sf400',
    sku: 'ANA009',
    price: 12500,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Succeeder',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-jmxae8jmxae8jmxa-300x300.png',
    description: 'Analyseur de coagulation semi-automatique compact.',
    stock: 4,
    rating: 4.5,
    reviews: 3
  },
  {
    id: 43,
    name: 'Analyseur MQ-6000',
    slug: 'analyseur-mq6000',
    sku: 'ANA010',
    price: 19500,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Medconn',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-hz7r96hz7r96hz7r-300x300.png',
    description: 'Analyseur d\'hémoglobine glyquée haute précision.',
    stock: 3,
    rating: 4.7,
    reviews: 2
  },
  {
    id: 44,
    name: 'Analyseur MQ-2000PT',
    slug: 'analyseur-mq2000pt',
    sku: 'ANA011',
    price: 16800,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Medconn',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-uih99zuih99zuih9-300x300.png',
    description: 'Analyseur d\'hémoglobine glyquée avec technologie avancée.',
    stock: 4,
    rating: 4.6,
    reviews: 2
  },
  {
    id: 45,
    name: 'Analyseur MQ-3000',
    slug: 'analyseur-mq3000',
    sku: 'ANA012',
    price: 17800,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Medconn',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-iqmn91iqmn91iqmn-300x300.png',
    description: 'Analyseur d\'hémoglobine glyquée avec automate.',
    stock: 3,
    rating: 4.7,
    reviews: 2
  },
  {
    id: 46,
    name: 'Analyseur Hurricane',
    slug: 'analyseur-hurricane',
    sku: 'ANA013',
    price: 32000,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'HIPRO',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-82gnve82gnve82gn-300x300.png',
    description: 'Analyseur Hurricane Immunoassay System, haute performance.',
    stock: 1,
    rating: 5.0,
    reviews: 1
  },
  {
    id: 47,
    name: 'Analyseur HP-AFS/A1 PLUS',
    slug: 'analyseur-hp-afs',
    sku: 'ANA014',
    price: 28500,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'HIPRO',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-8mjsuh8mjsuh8mjs-300x300.png',
    description: 'Analyseur immunologique haute sensibilité.',
    stock: 2,
    rating: 4.8,
    reviews: 1
  },
  {
    id: 48,
    name: 'Analyseur EG-i',
    slug: 'analyseur-egi',
    sku: 'ANA015',
    price: 22500,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Eaglenos',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-39ijah39ijah39ij-300x300.png',
    description: 'Analyseur de gaz du sang, rapide et précis.',
    stock: 2,
    rating: 4.7,
    reviews: 2
  },
  {
    id: 49,
    name: 'Analyseur EG-P1',
    slug: 'analyseur-egp1',
    sku: 'ANA016',
    price: 19800,
    originalPrice: null,
    category: 'ANALYSEURS',
    categoryId: 95,
    brand: 'Eaglenos',
    image: 'https://www.teclab.ma/storage/products/machine/gemini-generated-image-552llq552llq552l-300x300.png',
    description: 'Analyseur d\'électrolytes (K+, Na+, Cl-, iCa2+, iMg2+).',
    stock: 3,
    rating: 4.6,
    reviews: 2
  },
  {
    id: 50,
    name: 'VANCOMYCINE VA-5',
    slug: 'vancomycine-va5',
    sku: 'REA001',
    price: 250,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Vancomycine 5μg pour tests de sensibilité.',
    stock: 60,
    rating: 4.5,
    reviews: 5
  },
  {
    id: 51,
    name: 'VANCOMYCINE VA-30',
    slug: 'vancomycine-va30',
    sku: 'REA002',
    price: 280,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Vancomycine 30μg pour tests de sensibilité.',
    stock: 55,
    rating: 4.6,
    reviews: 4
  },
  {
    id: 52,
    name: 'TOBRAMYCINE TOB-10',
    slug: 'tobramycine-tob10',
    sku: 'REA003',
    price: 220,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Tobramycine 10μg.',
    stock: 48,
    rating: 4.4,
    reviews: 3
  },
  {
    id: 53,
    name: 'TICARCILLINE TIC-75',
    slug: 'ticarcilline-tic75',
    sku: 'REA004',
    price: 265,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Ticarcilline 75μg.',
    stock: 42,
    rating: 4.5,
    reviews: 3
  },
  {
    id: 54,
    name: 'TETRACYCLINE TE-30',
    slug: 'tetracycline-te30',
    sku: 'REA005',
    price: 190,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Tétracycline 30μg.',
    stock: 65,
    rating: 4.3,
    reviews: 6
  },
  {
    id: 55,
    name: 'TEICOPLANINE TEC-30',
    slug: 'teicoplanine-tec30',
    sku: 'REA006',
    price: 275,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Teicoplanine 30μg.',
    stock: 38,
    rating: 4.6,
    reviews: 4
  },
  {
    id: 56,
    name: 'STREPTOMYCINE S-25',
    slug: 'streptomycine-s25',
    sku: 'REA007',
    price: 185,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Streptomycine 25μg.',
    stock: 52,
    rating: 4.4,
    reviews: 5
  },
  {
    id: 57,
    name: 'SPIRAMYCINE SP-100',
    slug: 'spiramycine-sp100',
    sku: 'REA008',
    price: 205,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Spiramycine 100μg.',
    stock: 44,
    rating: 4.5,
    reviews: 4
  },
  {
    id: 58,
    name: 'RIFAMPICINE RA-5',
    slug: 'rifampicine-ra5',
    sku: 'REA009',
    price: 215,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Rifampicine 5μg.',
    stock: 47,
    rating: 4.5,
    reviews: 4
  },
  {
    id: 59,
    name: 'RIFAMPICINE RA-30',
    slug: 'rifampicine-ra30',
    sku: 'REA010',
    price: 235,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Rifampicine 30μg.',
    stock: 41,
    rating: 4.6,
    reviews: 3
  },
  {
    id: 60,
    name: 'PRISTINAMYCIN PT-15',
    slug: 'pristinamycin-pt15',
    sku: 'REA011',
    price: 245,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Pristinamycine 15μg.',
    stock: 36,
    rating: 4.5,
    reviews: 3
  },
  {
    id: 61,
    name: 'PIPERACILLINE/TAZOBACTAM',
    slug: 'piperacilline-tazobactam',
    sku: 'REA012',
    price: 295,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Pipéracilline/Tazobactam 36μg.',
    stock: 32,
    rating: 4.7,
    reviews: 3
  },
  {
    id: 62,
    name: 'PIPERACILLINE PRL-30',
    slug: 'piperacilline-prl30',
    sku: 'REA013',
    price: 255,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Pipéracilline 30μg.',
    stock: 39,
    rating: 4.5,
    reviews: 3
  },
  {
    id: 63,
    name: 'PENICILLINE P-10',
    slug: 'penicilline-p10',
    sku: 'REA014',
    price: 165,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Pénicilline 10μg.',
    stock: 58,
    rating: 4.3,
    reviews: 6
  },
  {
    id: 64,
    name: 'OXACILLINE OX-1',
    slug: 'oxacilline-ox1',
    sku: 'REA015',
    price: 175,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Oxacilline 1μg.',
    stock: 54,
    rating: 4.4,
    reviews: 5
  },
  {
    id: 65,
    name: 'OFLOXACIN OFX-5',
    slug: 'ofloxacin-ofx5',
    sku: 'REA016',
    price: 195,
    originalPrice: null,
    category: 'REACTIFS DE LABORATOIRE',
    categoryId: 75,
    brand: 'Bioelab',
    image: 'https://www.teclab.ma/storage/whatsapp-image-2026-02-03-at-104338-300x300.jpeg',
    description: 'Disque d\'antibiotique Ofloxacine 5μg.',
    stock: 46,
    rating: 4.4,
    reviews: 4
  },
  {
    id: 66,
    name: 'Thermomètre (-10 à 100°C)',
    slug: 'thermometre',
    sku: 'EQU001',
    price: 320,
    originalPrice: null,
    category: 'EQUIPEMENTS DE LABORATOIRE',
    categoryId: 116,
    brand: 'Labware',
    image: 'https://www.teclab.ma/storage/products/divers/gemini-generated-image-mt5nx2mt5nx2mt5n-300x300.jpg',
    description: 'Thermomètre de laboratoire précis de -10°C à 100°C.',
    stock: 25,
    rating: 4.3,
    reviews: 8,
    badge: 'Hot'
  },
  {
    id: 67,
    name: 'Minuteur digital',
    slug: 'minuteur-digital',
    sku: 'EQU002',
    price: 180,
    originalPrice: null,
    category: 'EQUIPEMENTS DE LABORATOIRE',
    categoryId: 116,
    brand: 'Labware',
    image: 'https://www.teclab.ma/storage/products/divers/gemini-generated-image-1yevup1yevup1yev-300x300.jpg',
    description: 'Minuteur digital avec alarme sonore. Mémoire de plusieurs temps.',
    stock: 40,
    rating: 4.6,
    reviews: 12,
    badge: 'Hot'
  },
  {
    id: 68,
    name: 'Minuteur analogique',
    slug: 'minuteur-analogique',
    sku: 'EQU003',
    price: 120,
    originalPrice: null,
    category: 'EQUIPEMENTS DE LABORATOIRE',
    categoryId: 116,
    brand: 'Labware',
    image: 'https://www.teclab.ma/storage/products/divers/gemini-generated-image-v1km8lv1km8lv1km-300x300.jpg',
    description: 'Minuteur analogique mécanique, simple et fiable.',
    stock: 35,
    rating: 4.2,
    reviews: 6
  },
  {
    id: 69,
    name: 'Bec Benzène',
    slug: 'bec-benzene',
    sku: 'EQU004',
    price: 280,
    originalPrice: null,
    category: 'EQUIPEMENTS DE LABORATOIRE',
    categoryId: 116,
    brand: 'Labware',
    image: 'https://www.teclab.ma/storage/products/anses/gemini-generated-image-xblqx7xblqx7xblq-300x300.jpg',
    description: 'Bec Benzène pour travaux de stérilisation.',
    stock: 18,
    rating: 4.5,
    reviews: 5
  }
];

const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@teclab.ma',
    password: 'admin123',
    role: 'admin',
    phone: '+212612345678',
    address: 'Fès, Maroc'
  },
  {
    id: 2,
    name: 'Client Test',
    email: 'client@test.com',
    password: 'client123',
    role: 'user',
    phone: '+212612345679',
    address: 'Casablanca, Maroc'
  }
];

const orders = [
  {
    id: 'ORD-001',
    userId: 2,
    date: '2026-02-15',
    status: 'livré',
    total: 635,
    items: [
      { productId: 1, name: 'Tube PRP GEL+NC1:9', quantity: 2, price: 140 },
      { productId: 10, name: 'Tampon Alcoolisé', quantity: 5, price: 45 },
      { productId: 18, name: 'Sparadrap CURE-AID', quantity: 1, price: 150 }
    ],
    shipping: 'Fès, Maroc',
    payment: 'carte'
  },
  {
    id: 'ORD-002',
    userId: 2,
    date: '2026-02-20',
    status: 'en cours',
    total: 380,
    items: [
      { productId: 3, name: 'Tube Sous Vide Fluoré', quantity: 1, price: 130 },
      { productId: 11, name: 'Garrot avec crochet', quantity: 2, price: 65 },
      { productId: 66, name: 'Thermomètre', quantity: 1, price: 120 }
    ],
    shipping: 'Fès, Maroc',
    payment: 'espèces'
  }
];

const partners = [
  { id: 1, name: 'Bioelab', image: 'https://www.teclab.ma/storage/products/partenaires/bioelab.png' },
  { id: 2, name: 'Carestainer', image: 'https://www.teclab.ma/storage/products/partenaires/carestainer.png' },
  { id: 3, name: 'Succeeder', image: 'https://www.teclab.ma/storage/products/partenaires/succeeder.png' },
  { id: 4, name: 'Medconn', image: 'https://www.teclab.ma/storage/products/partenaires/medconn.png' },
  { id: 5, name: 'Rapid Lab', image: 'https://www.teclab.ma/storage/products/partenaires/rapid-lab.png' },
  { id: 6, name: 'Healgen', image: 'https://www.teclab.ma/storage/products/partenaires/healgen.png' },
];

// ==================== CONTEXTS ====================

// Auth Context
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

// Cart Context
const CartContext = createContext();
const useCart = () => useContext(CartContext);

// Product Context
const ProductContext = createContext();
const useProducts = () => useContext(ProductContext);

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          setLoading(false);
          resolve(userWithoutPassword);
        } else {
          setError('Email ou mot de passe incorrect');
          setLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = (userData) => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
          setError('Cet email est déjà utilisé');
          setLoading(false);
          reject(new Error('Email already exists'));
        } else {
          const newUser = {
            id: users.length + 1,
            ...userData,
            role: 'user'
          };
          const { password, ...userWithoutPassword } = newUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          users.push(newUser);
          setLoading(false);
          resolve(userWithoutPassword);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Cart Provider
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setCartCount(count);
    setCartTotal(total);
  }, [cartItems]);

  const addToCart = (product, quantity = 1, attributes = {}) => {
    setLoading(true);
    
    setTimeout(() => {
      setCartItems(prev => {
        const existingIndex = prev.findIndex(
          item => item.id === product.id && JSON.stringify(item.attributes) === JSON.stringify(attributes)
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          return updated;
        } else {
          return [...prev, {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            slug: product.slug,
            quantity,
            attributes,
            stock: product.stock
          }];
        }
      });
      setLoading(false);
    }, 300);
  };

  const updateQuantity = (itemId, newQuantity, attributes = {}) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    
    setTimeout(() => {
      setCartItems(prev => 
        prev.map(item => 
          (item.id === itemId && JSON.stringify(item.attributes) === JSON.stringify(attributes))
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      setLoading(false);
    }, 300);
  };

  const removeFromCart = (itemId, attributes = {}) => {
    setLoading(true);
    
    setTimeout(() => {
      setCartItems(prev => 
        prev.filter(item => 
          !(item.id === itemId && JSON.stringify(item.attributes) === JSON.stringify(attributes))
        )
      );
      setLoading(false);
    }, 300);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Product Provider
const ProductProvider = ({ children }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const priceLimits = {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price))
  };

  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrands, priceRange, sortBy]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const availableBrands = [...new Set(filteredProducts.map(p => p.brand))];

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedBrands([]);
    setPriceRange({ min: priceLimits.min, max: priceLimits.max });
    setSortBy('featured');
  };

  const value = {
    filteredProducts,
    paginatedProducts,
    totalProducts: filteredProducts.length,
    totalPages,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrands,
    toggleBrand,
    priceRange,
    setPriceRange,
    priceLimits,
    sortBy,
    setSortBy,
    clearFilters,
    availableBrands,
    categories
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

// ==================== COMPONENTS ====================

// Carousel Component
const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselOffers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselOffers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselOffers.length) % carouselOffers.length);
  };

  return (
    <div className="carousel-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="carousel-slide"
          style={{ backgroundColor: carouselOffers[currentIndex].bgColor }}
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
              style={{ color: carouselOffers[currentIndex].textColor }}
            >
              {carouselOffers[currentIndex].title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ color: carouselOffers[currentIndex].textColor }}
            >
              {carouselOffers[currentIndex].subtitle}
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
            <img src={carouselOffers[currentIndex].image} alt={carouselOffers[currentIndex].title} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      
      <button className="carousel-nav carousel-prev" onClick={handlePrev}>
        <Icons.ChevronLeft />
      </button>
      <button className="carousel-nav carousel-next" onClick={handleNext}>
        <Icons.ChevronRight />
      </button>

      <div className="carousel-dots">
        {carouselOffers.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Product Card Component with optimized animations
const ProductCard = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleAddToCart = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

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
    >
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        
        {product.badge && (
          <motion.span 
            className="product-badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {product.badge}
          </motion.span>
        )}
        
        {product.discount && (
          <motion.span 
            className="product-discount"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {product.discount}
          </motion.span>
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
          >
            <Icons.ShoppingBag />
          </motion.button>
          <motion.button 
            className="action-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icons.Eye />
          </motion.button>
          <motion.button 
            className="action-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icons.Heart />
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
            <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
          ))}
          <span className="rating-count">({product.reviews})</span>
        </div>

        <div className="product-price">
          <span className="current-price">{product.price} MAD</span>
          {product.originalPrice && (
            <span className="original-price">{product.originalPrice} MAD</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Header Component with blue navbar
const Header = ({ currentPath, navigate }) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { setSearchQuery } = useProducts();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate('/products');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="announcement-bar">
        <div className="marquee">
          <span><Icons.Truck /> LIVRAISON GRATUITE À PARTIR DE 1000DH</span>
          <span><Icons.Truck /> LIVRAISON GRATUITE À PARTIR DE 1000DH</span>
          <span><Icons.Truck /> LIVRAISON GRATUITE À PARTIR DE 1000DH</span>
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
              <motion.a 
                href="/compare" 
                className="header-icon" 
                onClick={(e) => { e.preventDefault(); navigate('/compare'); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icons.Ticket />
                <span className="count">0</span>
              </motion.a>
              
              <motion.a 
                href="/wishlist" 
                className="header-icon" 
                onClick={(e) => { e.preventDefault(); navigate('/wishlist'); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icons.Heart />
                <span className="count">0</span>
              </motion.a>
              
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
                    className="count"
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
                      {user?.role === 'admin' && <a href="/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>Admin</a>}
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

        <nav className="navigation">
          <div className="container">
            <ul className="nav-menu">
              {[
                { href: '/', icon: <Icons.Home />, text: 'Accueil', active: currentPath === '/' },
                { href: '/products', icon: <Icons.RProject />, text: 'Produits', active: currentPath === '/products' },
                { href: '/about', icon: <Icons.Users />, text: 'À propos', active: currentPath === '/about' },
                { href: '/contact', icon: <Icons.Phone />, text: 'Contact', active: currentPath === '/contact' },
                { href: '/products?promo=1', icon: <Icons.Gift />, text: 'Promotions', active: false, promo: true },
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className={item.active ? 'active' : item.promo ? 'promo' : ''}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href={item.href} onClick={(e) => { e.preventDefault(); navigate(item.href); }}>
                    {item.icon} {item.text}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </nav>

        <AnimatePresence>
          {showCategoryMenu && (
            <motion.div 
              className="category-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container">
                {categories.map(cat => (
                  <motion.a 
                    key={cat.id} 
                    href={`/products?category=${cat.id}`} 
                    className="category-link"
                    onClick={(e) => { e.preventDefault(); navigate(`/products?category=${cat.id}`); setShowCategoryMenu(false); }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="category-color" style={{ backgroundColor: cat.color }}></span>
                    <span className="category-icon">{cat.icon}</span>
                    {cat.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMobileMenu && (
            <motion.div 
              className="mobile-menu"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-menu-header">
                <h3>Menu</h3>
                <motion.button 
                  onClick={() => setShowMobileMenu(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icons.X />
                </motion.button>
              </div>
              <ul className="mobile-nav">
                <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); setShowMobileMenu(false); }}>Accueil</a></li>
                <li><a href="/products" onClick={(e) => { e.preventDefault(); navigate('/products'); setShowMobileMenu(false); }}>Produits</a></li>
                <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); setShowMobileMenu(false); }}>À propos</a></li>
                <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); setShowMobileMenu(false); }}>Contact</a></li>
                <li><a href="/products?promo=1" onClick={(e) => { e.preventDefault(); navigate('/products?promo=1'); setShowMobileMenu(false); }}>Promotions</a></li>
                <li><a href="/compare" onClick={(e) => { e.preventDefault(); navigate('/compare'); setShowMobileMenu(false); }}>Comparer</a></li>
                <li><a href="/wishlist" onClick={(e) => { e.preventDefault(); navigate('/wishlist'); setShowMobileMenu(false); }}>Favoris</a></li>
                {isAuthenticated ? (
                  <>
                    <li><a href="/dashboard" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); setShowMobileMenu(false); }}>Mon Compte</a></li>
                    <li><a href="/orders" onClick={(e) => { e.preventDefault(); navigate('/orders'); setShowMobileMenu(false); }}>Mes Commandes</a></li>
                    <li><button onClick={() => { handleLogout(); setShowMobileMenu(false); }}>Déconnexion</button></li>
                  </>
                ) : (
                  <>
                    <li><a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); setShowMobileMenu(false); }}>Connexion</a></li>
                    <li><a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); setShowMobileMenu(false); }}>Inscription</a></li>
                  </>
                )}
              </ul>
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
        <div className="footer-widgets">
          <div className="widget contact-widget">
            <h4>Nous contacter</h4>
            <p className="phone">+212 8086 26102</p>
            <p><Icons.MapPin /> Rue 7 N° 184/Q4, Fès, Maroc</p>
            <p><Icons.Mail /> info@teclab.ma</p>
            <div className="social-links">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icons.Facebook />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icons.Twitter />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icons.Youtube />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icons.Linkedin />
              </motion.a>
            </div>
          </div>

          <div className="widget">
            <h4>Liens rapides</h4>
            <ul>
              <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Accueil</a></li>
              <li><a href="/products" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>Produits</a></li>
              <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>À propos</a></li>
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact</a></li>
            </ul>
          </div>

          <div className="widget">
            <h4>Informations</h4>
            <ul>
              <li><a href="/livraison" onClick={(e) => { e.preventDefault(); navigate('/livraison'); }}>Livraison</a></li>
              <li><a href="/paiement" onClick={(e) => { e.preventDefault(); navigate('/paiement'); }}>Paiement</a></li>
              <li><a href="/retours" onClick={(e) => { e.preventDefault(); navigate('/retours'); }}>Retours</a></li>
              <li><a href="/cgv" onClick={(e) => { e.preventDefault(); navigate('/cgv'); }}>CGV</a></li>
            </ul>
          </div>

          <div className="widget">
            <h4>Mon compte</h4>
            <ul>
              <li><a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Connexion</a></li>
              <li><a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Inscription</a></li>
              <li><a href="/orders" onClick={(e) => { e.preventDefault(); navigate('/orders'); }}>Commandes</a></li>
              <li><a href="/wishlist" onClick={(e) => { e.preventDefault(); navigate('/wishlist'); }}>Favoris</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 TECLAB. Tous droits réservés.</p>
          <div className="payments">
            <img src="/assets/payment-mastercard.png" alt="Mastercard" />
            <img src="/assets/payment-visa.png" alt="Visa" />
            <img src="/assets/payment-cmi.png" alt="CMI" />
          </div>
        </div>
      </div>

      <motion.a 
        href="https://wa.me/212666868091" 
        className="whatsapp-btn" 
        target="_blank"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Icons.WhatsApp />
        <span className="tooltip">Contactez-nous !</span>
      </motion.a>
    </footer>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({ onClose }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedBrands,
    toggleBrand,
    priceRange,
    setPriceRange,
    priceLimits,
    availableBrands,
    clearFilters,
    categories
  } = useProducts();

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filtres</h3>
        {onClose && <button className="close-btn" onClick={onClose}><Icons.X /></button>}
      </div>

      <div className="filter-body">
        <div className="filter-section">
          <h4>Catégories</h4>
          <div className="category-list">
            {categories.map(cat => (
              <label key={cat.id} className="category-item">
                <input 
                  type="radio" 
                  name="category"
                  checked={selectedCategory === cat.id}
                  onChange={() => setSelectedCategory(cat.id)}
                />
                <span className="category-name">{cat.name}</span>
                <span className="category-count">({cat.count})</span>
              </label>
            ))}
            <label className="category-item">
              <input 
                type="radio" 
                name="category"
                checked={selectedCategory === null}
                onChange={() => setSelectedCategory(null)}
              />
              <span className="category-name">Toutes les catégories</span>
            </label>
          </div>
        </div>

        <div className="filter-section">
          <h4>Prix</h4>
          <div className="price-range">
            <div className="price-inputs">
              <input 
                type="number" 
                value={priceRange.min}
                onChange={e => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                min={priceLimits.min}
                max={priceRange.max}
              />
              <span>-</span>
              <input 
                type="number" 
                value={priceRange.max}
                onChange={e => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                min={priceRange.min}
                max={priceLimits.max}
              />
            </div>
            <input 
              type="range"
              min={priceLimits.min}
              max={priceLimits.max}
              value={priceRange.max}
              onChange={e => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="price-slider"
            />
          </div>
        </div>

        <div className="filter-section">
          <h4>Marques</h4>
          <div className="brand-list">
            {availableBrands.map(brand => (
              <label key={brand} className="brand-item">
                <input 
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                <span className="brand-name">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-footer">
        <button className="clear-btn" onClick={clearFilters}>
          Effacer les filtres
        </button>
        {onClose && (
          <button className="apply-btn" onClick={onClose}>
            Appliquer
          </button>
        )}
      </div>
    </div>
  );
};

// ==================== PAGES ====================

// Home Page
const HomePage = ({ navigate }) => {
  const { addToCart } = useCart();
  const featured = products.filter(p => p.featured).slice(0, 6);

  const features = [
    { icon: <Icons.Truck />, title: 'Livraison gratuite', subtitle: 'Dès 1000DH d\'achat' },
    { icon: <Icons.RefreshCw />, title: 'Retour 90 jours', subtitle: 'Si produit défectueux' },
    { icon: <Icons.CreditCard />, title: 'Paiement sécurisé', subtitle: '100% sécurisé' },
    { icon: <Icons.Headphones />, title: 'Support 24/7', subtitle: 'Service dédié' },
  ];

  return (
    <div className="home-page">
      <Carousel />

      <motion.section 
        className="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <div className="container">
          <div className="features-grid">
            {features.map((feat, i) => (
              <motion.div 
                key={i}
                className="feature"
                variants={slideUp}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon">{feat.icon}</div>
                <h4>{feat.title}</h4>
                <p>{feat.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      // In the HomePage component, replace the categories-section with this:

<motion.section 
  className="categories-section"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={fadeIn}
>
  <div className="container">
    <h2 className="section-title">Catégories populaires</h2>
    <div className="categories-grid">
      {categories.map(cat => (
        <motion.div 
          key={cat.id}
          className="category-card"
          variants={slideUp}
          whileHover={{ y: -8 }}
          onClick={() => navigate(`/products?category=${cat.id}`)}
        >
          <div className="category-image-wrapper">
            <img src={cat.image} alt={cat.name} className="category-product-image" />
          </div>
          <h3 className="category-name">{cat.name}</h3>
          <span className="category-count">{cat.count} produits</span>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>

      <motion.section 
        className="featured-products"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        <div className="container">
          <h2 className="section-title">Produits en vedette</h2>
          <div className="products-grid">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="partners-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <div className="container">
          <h2 className="section-title">Nos Partenaires</h2>
          <div className="partners-marquee">
            <motion.div 
              className="partners-track"
              animate={{ x: [0, -1000] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...partners, ...partners].map((partner, index) => (
                <motion.div 
                  key={`${partner.id}-${index}`} 
                  className="partner"
                  whileHover={{ scale: 1.1 }}
                >
                  <img src={partner.image} alt={partner.name} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

// Products Page
const ProductsPage = ({ navigate }) => {
  const {
    paginatedProducts,
    totalProducts,
    totalPages,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    clearFilters
  } = useProducts();
  const { addToCart } = useCart();
  const [showFilter, setShowFilter] = useState(false);

  return (
    <motion.div 
      className="products-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="page-header">
        <div className="container">
          <h1>Nos Produits</h1>
          <p>{totalProducts} produits trouvés</p>
        </div>
      </div>

      <div className="container">
        <div className="products-layout">
          <aside className="sidebar">
            <FilterSidebar />
          </aside>

          <main className="products-main">
            <div className="products-toolbar">
              <div className="search-box">
                <input 
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Icons.Search />
              </div>

              <div className="sort-box">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Trier par: En vedette</option>
                  <option value="price-asc">Prix: croissant</option>
                  <option value="price-desc">Prix: décroissant</option>
                  <option value="name-asc">Nom: A-Z</option>
                  <option value="name-desc">Nom: Z-A</option>
                  <option value="rating">Meilleures notes</option>
                </select>
              </div>

              <motion.button 
                className="mobile-filter-btn" 
                onClick={() => setShowFilter(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icons.Filter /> Filtrer
              </motion.button>
            </div>

            {paginatedProducts.length > 0 ? (
              <>
                <div className="products-grid">
                  {paginatedProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <motion.button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icons.ChevronLeft />
                    </motion.button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <motion.button 
                        key={i}
                        className={currentPage === i + 1 ? 'active' : ''}
                        onClick={() => setCurrentPage(i + 1)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {i + 1}
                      </motion.button>
                    ))}
                    
                    <motion.button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icons.ChevronRight />
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-products">
                <Icons.Package size={48} />
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos filtres</p>
                <motion.button 
                  onClick={clearFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Effacer les filtres
                </motion.button>
              </div>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showFilter && (
          <motion.div 
            className="mobile-filter-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilter(false)}
          >
            <motion.div 
              className="mobile-filter-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
            >
              <FilterSidebar onClose={() => setShowFilter(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Product Detail Page
const ProductDetailPage = ({ navigate }) => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  useEffect(() => {
    const path = window.location.pathname;
    const slug = path.split('/').pop();
    const found = products.find(p => p.slug === slug || p.id === parseInt(slug));
    setProduct(found);
    
    if (found?.attributes) {
      const initial = {};
      Object.keys(found.attributes).forEach(key => {
        initial[key] = found.attributes[key][0];
      });
      setSelectedAttributes(initial);
    }
  }, []);

  if (!product) {
    return <div className="loading">Chargement...</div>;
  }

  const related = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <motion.div 
      className="product-detail-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <div className="breadcrumb">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Accueil</a> / 
          <a href="/products" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>Produits</a> / 
          <a href={`/products?category=${product.categoryId}`} onClick={(e) => { e.preventDefault(); navigate(`/products?category=${product.categoryId}`); }}>
            {product.category}
          </a> / 
          <span>{product.name}</span>
        </div>

        <div className="product-detail">
          <motion.div 
            className="product-gallery"
            variants={slideInLeft}
          >
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
          </motion.div>

          <motion.div 
            className="product-info"
            variants={slideInRight}
          >
            <h1>{product.name}</h1>
            
            <div className="product-meta">
              <span className="sku">SKU: {product.sku}</span>
              <span className="brand">Marque: {product.brand}</span>
            </div>

            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
              ))}
              <span>({product.reviews} avis)</span>
            </div>

            <div className="product-price">
              <span className="current">{product.price} MAD</span>
              {product.originalPrice && (
                <span className="original">{product.originalPrice} MAD</span>
              )}
            </div>

            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">En stock ({product.stock} disponibles)</span>
              ) : (
                <span className="out-of-stock">Rupture de stock</span>
              )}
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="product-attributes">
                {Object.entries(product.attributes).map(([key, values]) => (
                  <div key={key} className="attribute-group">
                    <label>{key}:</label>
                    <div className="attribute-values">
                      {values.map(value => (
                        <button
                          key={value}
                          className={`attribute-btn ${selectedAttributes[key] === value ? 'active' : ''}`}
                          onClick={() => setSelectedAttributes({ ...selectedAttributes, [key]: value })}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="product-actions">
              <div className="quantity-selector">
                <motion.button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icons.Minus />
                </motion.button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                />
                <motion.button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icons.Plus />
                </motion.button>
              </div>

              <motion.button 
                className="add-to-cart-btn"
                onClick={() => addToCart(product, quantity, selectedAttributes)}
                disabled={product.stock === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icons.ShoppingBag /> Ajouter au panier
              </motion.button>

              <motion.button 
                className="buy-now-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Acheter maintenant
              </motion.button>
            </div>

            <div className="product-extra">
              <motion.button 
                className="wishlist-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icons.Heart /> Ajouter aux favoris
              </motion.button>
              <motion.button 
                className="compare-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icons.Ticket /> Comparer
              </motion.button>
            </div>

            {product.features && (
              <div className="product-features">
                <h4>Caractéristiques:</h4>
                <ul>
                  {product.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
          </motion.div>
        </div>

        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={activeTab === 'description' ? 'active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={activeTab === 'specs' ? 'active' : ''}
              onClick={() => setActiveTab('specs')}
            >
              Spécifications
            </button>
            <button 
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Avis ({product.reviews})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="tab-pane">
                <table className="specs-table">
                  <tbody>
                    <tr><th>SKU</th><td>{product.sku}</td></tr>
                    <tr><th>Marque</th><td>{product.brand}</td></tr>
                    <tr><th>Catégorie</th><td>{product.category}</td></tr>
                    <tr><th>Stock</th><td>{product.stock}</td></tr>
                    {product.attributes && Object.entries(product.attributes).map(([key, values]) => (
                      <tr key={key}><th>{key}</th><td>{values.join(', ')}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <p>Aucun avis pour le moment.</p>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="related-products">
            <h3>Produits similaires</h3>
            <div className="products-grid">
              {related.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Cart Page
const CartPage = ({ navigate }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const shipping = cartTotal > 1000 ? 0 : 50;
  const tax = cartTotal * 0.2;
  const grandTotal = cartTotal + shipping + tax;

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
          <motion.button 
            className="btn-primary" 
            onClick={() => navigate('/products')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Voir les produits
          </motion.button>
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
            {cartItems.map((item, index) => (
              <motion.div 
                key={`${item.id}-${index}`}
                className="cart-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <img src={item.image} alt={item.name} />
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  {Object.entries(item.attributes).length > 0 && (
                    <div className="item-attributes">
                      {Object.entries(item.attributes).map(([key, value]) => (
                        <span key={key}>{key}: {value}</span>
                      ))}
                    </div>
                  )}
                  <span className="item-price">{item.price} MAD</span>
                </div>

                <div className="item-quantity">
                  <motion.button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.attributes)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icons.Minus />
                  </motion.button>
                  <span>{item.quantity}</span>
                  <motion.button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.attributes)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icons.Plus />
                  </motion.button>
                </div>

                <div className="item-total">
                  {item.price * item.quantity} MAD
                </div>

                <motion.button 
                  className="remove-item"
                  onClick={() => removeFromCart(item.id, item.attributes)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icons.Trash />
                </motion.button>
              </motion.div>
            ))}

            <div className="cart-actions">
              <motion.button 
                onClick={clearCart} 
                className="clear-cart"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icons.Trash /> Vider le panier
              </motion.button>
            </div>
          </div>

          <div className="cart-summary">
            <h3>Récapitulatif</h3>
            
            <div className="summary-row">
              <span>Sous-total</span>
              <span>{cartTotal} MAD</span>
            </div>
            
            <div className="summary-row">
              <span>Livraison</span>
              <span>{shipping === 0 ? 'Gratuite' : `${shipping} MAD`}</span>
            </div>
            
            <div className="summary-row">
              <span>TVA (20%)</span>
              <span>{tax} MAD</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>{grandTotal} MAD</span>
            </div>

            {cartTotal < 1000 && (
              <div className="free-shipping-progress">
                <p>Plus que {1000 - cartTotal} MAD pour la livraison gratuite</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${(cartTotal / 1000) * 100}%` }}></div>
                </div>
              </div>
            )}

            {isAuthenticated ? (
              <motion.button 
                className="checkout-btn" 
                onClick={() => navigate('/checkout')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Passer la commande
              </motion.button>
            ) : (
              <div className="checkout-login">
                <p>Connectez-vous pour finaliser votre commande</p>
                <motion.button 
                  className="login-btn" 
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Se connecter
                </motion.button>
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
      setError('Email ou mot de passe incorrect');
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
        <motion.div 
          className="auth-box"
          variants={slideUp}
        >
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

            <motion.button 
              type="submit" 
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </motion.button>
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
const RegisterPage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError('Erreur lors de l\'inscription');
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
        <motion.div 
          className="auth-box"
          variants={slideUp}
        >
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
                required
              />
            </div>

            <div className="form-group">
              <label>Adresse</label>
              <input 
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
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
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <motion.button 
              type="submit" 
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </motion.button>
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
const DashboardPage = ({ navigate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const userOrders = orders.filter(o => o.userId === user?.id);

  const handleUpdate = (e) => {
    e.preventDefault();
    setEditMode(false);
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
              <li className={activeTab === 'address' ? 'active' : ''}>
                <button onClick={() => setActiveTab('address')}>Adresses</button>
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
                    <motion.button 
                      className="edit-btn" 
                      onClick={() => setEditMode(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Modifier
                    </motion.button>
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
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Téléphone</label>
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-actions">
                      <motion.button 
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Enregistrer
                      </motion.button>
                      <motion.button 
                        type="button" 
                        onClick={() => setEditMode(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Annuler
                      </motion.button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info">
                    <p><strong>Nom:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Téléphone:</strong> {user?.phone || 'Non renseigné'}</p>
                    <p><strong>Adresse:</strong> {user?.address || 'Non renseignée'}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-tab">
                <h2>Mes Commandes</h2>
                
                {userOrders.length === 0 ? (
                  <p>Aucune commande pour le moment</p>
                ) : (
                  <div className="orders-list">
                    {userOrders.map(order => (
                      <motion.div 
                        key={order.id} 
                        className="order-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="order-header">
                          <span className="order-id">Commande #{order.id}</span>
                          <span className={`order-status status-${order.status}`}>
                            {order.status}
                          </span>
                          <span className="order-date">{order.date}</span>
                        </div>

                        <div className="order-items">
                          {order.items.map((item, i) => (
                            <div key={i} className="order-item">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{item.price * item.quantity} MAD</span>
                            </div>
                          ))}
                        </div>

                        <div className="order-footer">
                          <span className="order-total">Total: {order.total} MAD</span>
                          <motion.button 
                            className="track-order"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Suivre
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'address' && (
              <div className="address-tab">
                <h2>Mes Adresses</h2>
                <div className="address-card">
                  <h3>Adresse par défaut</h3>
                  <p>{user?.address || 'Aucune adresse enregistrée'}</p>
                  <motion.button 
                    className="edit-address"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Modifier
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Admin Page
const AdminPage = ({ navigate }) => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [allOrders, setAllOrders] = useState(orders);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const updateOrderStatus = (orderId, newStatus) => {
    setAllOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <motion.div 
      className="admin-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <h1>Administration</h1>

        <div className="admin-layout">
          <div className="admin-sidebar">
            <ul className="admin-menu">
              <li className={activeTab === 'orders' ? 'active' : ''}>
                <button onClick={() => setActiveTab('orders')}>Commandes</button>
              </li>
              <li className={activeTab === 'products' ? 'active' : ''}>
                <button onClick={() => setActiveTab('products')}>Produits</button>
              </li>
              <li className={activeTab === 'users' ? 'active' : ''}>
                <button onClick={() => setActiveTab('users')}>Utilisateurs</button>
              </li>
              <li className={activeTab === 'stats' ? 'active' : ''}>
                <button onClick={() => setActiveTab('stats')}>Statistiques</button>
              </li>
            </ul>
          </div>

          <div className="admin-content">
            {activeTab === 'orders' && (
              <div className="orders-management">
                <h2>Gestion des commandes</h2>
                
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{users.find(u => u.id === order.userId)?.name}</td>
                        <td>{order.date}</td>
                        <td>{order.total} MAD</td>
                        <td>
                          <span className={`status-badge status-${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          >
                            <option value="en cours">En cours</option>
                            <option value="expédiée">Expédiée</option>
                            <option value="livré">Livré</option>
                            <option value="annulée">Annulée</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="products-management">
                <h2>Gestion des produits</h2>
                <motion.button 
                  className="add-product-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Ajouter un produit
                </motion.button>
                
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Nom</th>
                      <th>Prix</th>
                      <th>Stock</th>
                      <th>Catégorie</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td><img src={product.image} alt="" width="50" /></td>
                        <td>{product.name}</td>
                        <td>{product.price} MAD</td>
                        <td>{product.stock}</td>
                        <td>{product.category}</td>
                        <td>
                          <motion.button 
                            className="edit-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Modifier
                          </motion.button>
                          <motion.button 
                            className="delete-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Supprimer
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-management">
                <h2>Gestion des utilisateurs</h2>
                
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Rôle</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.role}</td>
                        <td>
                          <motion.button 
                            className="edit-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Modifier
                          </motion.button>
                          <motion.button 
                            className="delete-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Supprimer
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="stats-management">
                <h2>Statistiques</h2>
                
                <div className="stats-grid">
                  <motion.div 
                    className="stat-card"
                    whileHover={{ y: -5 }}
                  >
                    <h3>Commandes totales</h3>
                    <p className="stat-value">{orders.length}</p>
                  </motion.div>
                  <motion.div 
                    className="stat-card"
                    whileHover={{ y: -5 }}
                  >
                    <h3>Chiffre d'affaires</h3>
                    <p className="stat-value">
                      {orders.reduce((sum, o) => sum + o.total, 0)} MAD
                    </p>
                  </motion.div>
                  <motion.div 
                    className="stat-card"
                    whileHover={{ y: -5 }}
                  >
                    <h3>Produits</h3>
                    <p className="stat-value">{products.length}</p>
                  </motion.div>
                  <motion.div 
                    className="stat-card"
                    whileHover={{ y: -5 }}
                  >
                    <h3>Clients</h3>
                    <p className="stat-value">{users.length}</p>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// About Page
const AboutPage = ({ navigate }) => {
  return (
    <motion.div 
      className="about-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="page-header">
        <div className="container">
          <h1>Qui sommes-nous</h1>
        </div>
      </div>

      <div className="container">
        <motion.div 
          className="about-content"
          variants={slideUp}
        >
          <div className="about-section">
            <h2>Notre histoire</h2>
            <p>
              TECLAB est une entreprise marocaine spécialisée dans la fourniture d'équipements 
              et consommables de laboratoire. Depuis notre création, nous nous engageons à 
              fournir des produits de haute qualité aux professionnels de la santé et de la 
              recherche au Maroc.
            </p>
          </div>

          <div className="about-section">
            <h2>Notre mission</h2>
            <p>
              Notre mission est de faciliter l'accès aux équipements de laboratoire de qualité 
              pour tous les professionnels du secteur médical et scientifique au Maroc. Nous 
              travaillons avec les meilleurs fabricants internationaux pour vous offrir des 
              produits fiables et performants.
            </p>
          </div>

          <div className="about-section">
            <h2>Nos valeurs</h2>
            <ul>
              <li>Qualité irréprochable</li>
              <li>Service client exceptionnel</li>
              <li>Innovation constante</li>
              <li>Intégrité et transparence</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Contact Page
const ContactPage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <motion.div 
      className="contact-page"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="page-header">
        <div className="container">
          <h1>Contactez-nous</h1>
        </div>
      </div>

      <div className="container">
        <div className="contact-layout">
          <div className="contact-info">
            <motion.div 
              className="info-card"
              variants={slideUp}
              whileHover={{ y: -5 }}
            >
              <Icons.MapPin />
              <h3>Adresse</h3>
              <p>Rue 7 N° 184/Q4, Lotis Hadika Tghat<br />30090 Fès, Maroc</p>
            </motion.div>

            <motion.div 
              className="info-card"
              variants={slideUp}
              whileHover={{ y: -5 }}
            >
              <Icons.Phone />
              <h3>Téléphone</h3>
              <p>+212 8086 26102</p>
              <p>+212 6668 68091</p>
            </motion.div>

            <motion.div 
              className="info-card"
              variants={slideUp}
              whileHover={{ y: -5 }}
            >
              <Icons.Mail />
              <h3>Email</h3>
              <p>info@teclab.ma</p>
              <p>support@teclab.ma</p>
            </motion.div>

            <motion.div 
              className="info-card"
              variants={slideUp}
              whileHover={{ y: -5 }}
            >
              <Icons.Headphones />
              <h3>Horaires</h3>
              <p>Lun-Ven: 9h - 18h</p>
              <p>Sam: 9h - 13h</p>
            </motion.div>
          </div>

          <motion.div 
            className="contact-form"
            variants={slideInRight}
          >
            <h2>Envoyez-nous un message</h2>
            
            {sent && (
              <div className="success-message">
                Message envoyé avec succès !
              </div>
            )}

            <form onSubmit={handleSubmit}>
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
                <label>Sujet</label>
                <input 
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea 
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <motion.button 
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Envoyer
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
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

    window.addEventListener('popstate', handlePathChange);
    document.addEventListener('click', handleClick);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
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
    if (currentPath === '/') return <HomePage navigate={navigate} />;
    if (currentPath === '/products') return <ProductsPage navigate={navigate} />;
    if (currentPath.startsWith('/product/')) return <ProductDetailPage navigate={navigate} />;
    if (currentPath === '/cart') return <CartPage navigate={navigate} />;
    if (currentPath === '/checkout') return <div className="coming-soon">Page de paiement en cours de développement</div>;
    if (currentPath === '/login') return <LoginPage navigate={navigate} />;
    if (currentPath === '/register') return <RegisterPage navigate={navigate} />;
    if (currentPath === '/dashboard') return <DashboardPage navigate={navigate} />;
    if (currentPath === '/admin') return <AdminPage navigate={navigate} />;
    if (currentPath === '/about') return <AboutPage navigate={navigate} />;
    if (currentPath === '/contact') return <ContactPage navigate={navigate} />;
    if (currentPath === '/orders') return <div className="coming-soon">Mes commandes</div>;
    if (currentPath === '/compare') return <div className="coming-soon">Comparateur de produits</div>;
    if (currentPath === '/wishlist') return <div className="coming-soon">Liste de souhaits</div>;
    
    return (
      <div className="not-found">
        <h1>404</h1>
        <p>Page non trouvée</p>
        <motion.button 
          className="btn-primary" 
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retour à l'accueil
        </motion.button>
      </div>
    );
  };

  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
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
                  transition={{ duration: 0.2 }}
                >
                  <Icons.ArrowUp />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;