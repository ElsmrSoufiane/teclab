import React, { useState, useRef, useEffect } from 'react';

const TeclabAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Product Database for Arij Parfums
  const products = [
    { id: 1, name: "Arij Royal Oud", price: 890.00, category: "Parfums de Luxe", brand: "Arij", stock: 15, description: "Parfum oriental luxueux aux notes d'Oud rare et d'Ambre", details: "Oud, Ambre, Safran, 100ml" },
    { id: 2, name: "Rose de Damas", price: 750.00, category: "Parfums Femme", brand: "Arij", stock: 22, description: "Fragrance florale intense à la rose de Damas", details: "Rose, Jasmin, Musc, 100ml" },
    { id: 3, name: "Boisé Intense", price: 680.00, category: "Parfums Homme", brand: "Arij", stock: 18, description: "Parfum boisé et épicé pour l'homme moderne", details: "Santal, Cèdre, Poivre, 100ml" },
    { id: 4, name: "Ambre Nuit", price: 920.00, category: "Parfums Unisex", brand: "Arij", stock: 12, description: "Fragrance envoûtante à l'ambre et à la vanille", details: "Ambre, Vanille, Benjoin, 100ml" },
    { id: 5, name: "Fleur d'Oranger", price: 590.00, category: "Parfums Femme", brand: "Arij", stock: 30, description: "Parfum frais et floral à la fleur d'oranger", details: "Fleur d'oranger, Néroli, Musc, 100ml" },
    { id: 6, name: "Cèdre Noir", price: 720.00, category: "Parfums Homme", brand: "Arij", stock: 20, description: "Fragrance boisée intense au cèdre et au cuir", details: "Cèdre, Cuir, Vétiver, 100ml" },
    { id: 7, name: "Vanille Exotique", price: 650.00, category: "Parfums Femme", brand: "Arij", stock: 25, description: "Parfum gourmand à la vanille de Madagascar", details: "Vanille, Coco, Caramel, 100ml" },
    { id: 8, name: "Musk Blanc", price: 550.00, category: "Parfums Unisex", brand: "Arij", stock: 35, description: "Fragrance douce et sensuelle au musc blanc", details: "Musc, Fleurs blanches, Bois, 100ml" },
    { id: 9, name: "Coffret Découverte", price: 350.00, category: "Coffrets", brand: "Arij", stock: 50, description: "Coffret de 5 miniatures (5x10ml)", details: "5 parfums signature, Format voyage" },
    { id: 10, name: "Arij Noir", price: 1200.00, category: "Parfums de Luxe", brand: "Arij", stock: 8, description: "Parfum exclusif aux notes de cuir et de tabac", details: "Cuir, Tabac, Patchouli, 100ml" },
    { id: 11, name: "Gardenia", price: 620.00, category: "Parfums Femme", brand: "Arij", stock: 28, description: "Fragrance florale élégante au gardénia", details: "Gardénia, Tubéreuse, Musc, 100ml" },
    { id: 12, name: "Santal Royal", price: 850.00, category: "Parfums Homme", brand: "Arij", stock: 16, description: "Parfum boisé et crémeux au santal", details: "Santal, Ambre, Vanille, 100ml" },
    { id: 13, name: "Yuzu Frais", price: 580.00, category: "Parfums Unisex", brand: "Arij", stock: 32, description: "Fragrance fraîche et acidulée au yuzu", details: "Yuzu, Citron, Gingembre, 100ml" },
    { id: 14, name: "Patchouli Noir", price: 780.00, category: "Parfums Homme", brand: "Arij", stock: 14, description: "Parfum mystérieux au patchouli et à la fève tonka", details: "Patchouli, Fève tonka, Cacao, 100ml" },
    { id: 15, name: "Fleur de Lys", price: 640.00, category: "Parfums Femme", brand: "Arij", stock: 24, description: "Fragrance royale à la fleur de lys", details: "Lys, Iris, Vanille, 100ml" },
  ];

  // Close chat window
  const closeChat = () => {
    setIsOpen(false);
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target) && 
          event.target !== document.querySelector('.float-button')) {
        if (!event.target.closest('.float-button')) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Category searches
    if (lowerQuery.includes('femme') || lowerQuery.includes('woman') || lowerQuery.includes('féminin')) {
      return products.filter(p => p.category === 'Parfums Femme');
    }
    if (lowerQuery.includes('homme') || lowerQuery.includes('man') || lowerQuery.includes('masculin')) {
      return products.filter(p => p.category === 'Parfums Homme');
    }
    if (lowerQuery.includes('unisex') || lowerQuery.includes('mixte')) {
      return products.filter(p => p.category === 'Parfums Unisex');
    }
    if (lowerQuery.includes('luxe') || lowerQuery.includes('premium')) {
      return products.filter(p => p.category === 'Parfums de Luxe');
    }
    if (lowerQuery.includes('coffret') || lowerQuery.includes('cadeau') || lowerQuery.includes('gift')) {
      return products.filter(p => p.category === 'Coffrets');
    }
    
    // Note searches
    if (lowerQuery.includes('oud') || lowerQuery.includes('oriental')) {
      return products.filter(p => p.name.toLowerCase().includes('oud') || p.details.toLowerCase().includes('oud'));
    }
    if (lowerQuery.includes('rose')) {
      return products.filter(p => p.name.toLowerCase().includes('rose') || p.details.toLowerCase().includes('rose'));
    }
    if (lowerQuery.includes('boisé') || lowerQuery.includes('wood')) {
      return products.filter(p => p.category === 'Parfums Homme' && (p.name.toLowerCase().includes('boisé') || p.name.toLowerCase().includes('cèdre') || p.name.toLowerCase().includes('santal')));
    }
    if (lowerQuery.includes('vanille')) {
      return products.filter(p => p.name.toLowerCase().includes('vanille') || p.details.toLowerCase().includes('vanille'));
    }
    if (lowerQuery.includes('ambre')) {
      return products.filter(p => p.name.toLowerCase().includes('ambre') || p.details.toLowerCase().includes('ambre'));
    }
    if (lowerQuery.includes('floral')) {
      return products.filter(p => p.category === 'Parfums Femme' || p.details.toLowerCase().includes('fleur'));
    }
    
    // Price range search
    if (lowerQuery.match(/\d+/)) {
      const priceMatch = lowerQuery.match(/(\d+)/);
      if (priceMatch && (lowerQuery.includes('sous') || lowerQuery.includes('moins de') || lowerQuery.includes('under'))) {
        const maxPrice = parseInt(priceMatch[1]);
        return products.filter(p => p.price <= maxPrice);
      }
      if (priceMatch && (lowerQuery.includes('plus de') || lowerQuery.includes('above') || lowerQuery.includes('supérieur'))) {
        const minPrice = parseInt(priceMatch[1]);
        return products.filter(p => p.price >= minPrice);
      }
    }
    
    // General search
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.details.toLowerCase().includes(lowerQuery)
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(price);
  };

  const formatProductList = (productsList) => {
    if (productsList.length === 0) {
      return "❌ Désolé, aucun parfum trouvé.\n\n💡 Suggestions:\n• \"Montre-moi les parfums femme\"\n• \"Parfums boisés pour homme\"\n• \"Parfums Arij de luxe\"\n• \"Coffrets cadeaux\"\n• \"Parfums sous 600 MAD\"";
    }
    
    let response = `🔍 ${productsList.length} parfum(s) trouvé(s):\n\n`;
    productsList.slice(0, 4).forEach(product => {
      response += `🌸 ${product.name}\n`;
      response += `   💰 Prix: ${formatPrice(product.price)}\n`;
      response += `   📊 Stock: ${product.stock > 0 ? `✅ ${product.stock} disponibles` : '❌ Rupture'}\n`;
      response += `   🏷️ Catégorie: ${product.category}\n`;
      response += `   📝 ${product.description}\n`;
      response += `   🔧 Notes: ${product.details}\n`;
      response += `\n`;
    });
    
    if (productsList.length > 4) {
      response += `📌 ... et ${productsList.length - 4} autre(s) parfum(s).\n`;
      response += `💡 Demandez \"plus de détails sur [nom]\" pour en savoir plus.`;
    } else {
      response += `💡 Besoin d'aide? Demandez-moi les détails d'un parfum spécifique.`;
    }
    return response;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString('fr-MA')
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const userQuery = userMessage.content.toLowerCase();
      let responseText = "";
      
      if (userQuery.match(/^(bonjour|salut|hello|hi|coucou|hey)/)) {
        responseText = "🌸 Bonjour! Je suis l'assistant Arij Parfums.\n\nJe peux vous aider avec:\n✅ Découvrir nos collections de parfums\n✅ Vérifier les prix et disponibilités\n✅ Rechercher par notes (Oud, Rose, Vanille...)\n✅ Trouver le parfum idéal selon vos goûts\n✅ Coffrets cadeaux et promotions\n\nComment puis-je vous aider à trouver votre fragrance parfaite aujourd'hui?";
      }
      else if (userQuery.includes('aide') || userQuery.includes('help') || userQuery.includes('peux-tu') || userQuery.includes('que faire')) {
        responseText = "🌸 Voici ce que je peux faire pour vous:\n\n📦 **Rechercher des parfums**\n\"Montre-moi les parfums femme\"\n\n💰 **Vérifier les prix**\n\"Prix de Arij Royal Oud\"\n\n🏷️ **Filtrer par catégorie**\n\"Parfums de luxe\"\n\n📊 **Voir disponibilité**\n\"Le parfum Rose de Damas est-il en stock?\"\n\n💵 **Recherche par prix**\n\"Parfums sous 600 MAD\"\n\n🌸 **Recherche par notes**\n\"Parfums à l'oud\"\n\"Parfums floraux\"\n\"Parfums boisés\"\n\n🎁 **Coffrets cadeaux**\n\"Coffrets disponibles\"\n\nQue souhaitez-vous découvrir?";
      }
      else if (userQuery.includes('prix') || userQuery.includes('price') || userQuery.includes('coût') || userQuery.includes('combien')) {
        const productMatch = products.find(p => 
          userQuery.includes(p.name.toLowerCase().split(' ')[0]) ||
          userQuery.includes(p.name.toLowerCase().split(' ')[1]) ||
          userQuery.includes(p.name.toLowerCase().substring(0, 15))
        );
        if (productMatch) {
          responseText = `🌸 **${productMatch.name}**\n\n💰 **Prix:** ${formatPrice(productMatch.price)}\n🏷️ **Catégorie:** ${productMatch.category}\n📦 **Stock:** ${productMatch.stock > 0 ? `${productMatch.stock} disponibles` : 'Rupture de stock'}\n📝 **Description:** ${productMatch.description}\n🔧 **Notes olfactives:** ${productMatch.details}\n\n💡 **Vous aimerez aussi:**\n• Parfums similaires dans la même collection\n• Coffrets découverte disponibles`;
        } else {
          responseText = "🔍 Quel parfum vous intéresse?\n\nExemples:\n• \"Prix de Arij Royal Oud\"\n• \"Combien coûte Rose de Damas?\"\n• \"Tarif du coffret découverte\"\n\nDonnez-moi le nom exact du parfum pour une réponse précise.";
        }
      }
      else if (userQuery.includes('stock') || userQuery.includes('disponible') || userQuery.includes('available') || userQuery.includes('en stock')) {
        const productMatch = products.find(p => 
          userQuery.includes(p.name.toLowerCase().split(' ')[0]) ||
          userQuery.includes(p.name.toLowerCase().substring(0, 15))
        );
        if (productMatch) {
          const stockStatus = productMatch.stock > 0 
            ? `✅ **EN STOCK** - ${productMatch.stock} flacons disponibles` 
            : "❌ **RUPTURE DE STOCK** - Réapprovisionnement dans 2 semaines";
          responseText = `🌸 **${productMatch.name}**\n${stockStatus}\n\n🏷️ **Catégorie:** ${productMatch.category}\n💰 **Prix:** ${formatPrice(productMatch.price)}\n\n⏱️ **Livraison:** 24-48h\n📞 **Contact:** +212 808 626 102 pour une commande urgente`;
        } else {
          responseText = "🔍 Vérifions la disponibilité ensemble!\n\nQuel parfum vous intéresse?\nExemples:\n• \"Arij Royal Oud en stock?\"\n• \"Rose de Damas disponible\"\n• \"Coffret découverte stock\"";
        }
      }
      else if (userQuery.includes('montre') || userQuery.includes('affiche') || userQuery.includes('cherche') || 
               userQuery.includes('trouve') || userQuery.includes('liste') || userQuery.includes('catalogue') ||
               userQuery.includes('collection') || userQuery.includes('parfum')) {
        const results = searchProducts(userQuery);
        responseText = formatProductList(results);
      }
      else if (userQuery.includes('note') || userQuery.includes('olfactive') || userQuery.includes('sent')) {
        if (userQuery.includes('oud')) {
          responseText = "🌸 **Parfums à l'Oud**\n\nL'oud est une note précieuse et boisée.\n\nNos parfums contenant de l'oud:\n• Arij Royal Oud (Parfum de Luxe) - 890 MAD\n• Ambre Nuit (Unisex) - 920 MAD\n\nCes fragrances sont riches, chaleureuses et envoûtantes.";
        } else if (userQuery.includes('rose')) {
          responseText = "🌸 **Parfums à la Rose**\n\nLa rose est la reine des fleurs en parfumerie.\n\nNos parfums contenant de la rose:\n• Rose de Damas (Femme) - 750 MAD\n• Fleur de Lys (Femme) - 640 MAD\n\nDes fragrances élégantes et romantiques.";
        } else if (userQuery.includes('vanille')) {
          responseText = "🌸 **Parfums à la Vanille**\n\nLa vanille apporte douceur et gourmandise.\n\nNos parfums contenant de la vanille:\n• Vanille Exotique (Femme) - 650 MAD\n• Ambre Nuit (Unisex) - 920 MAD\n• Santal Royal (Homme) - 850 MAD\n\nDes fragrances réconfortantes et sensuelles.";
        } else if (userQuery.includes('boisé') || userQuery.includes('bois')) {
          responseText = "🌸 **Parfums Boisés**\n\nLes notes boisées apportent caractère et élégance.\n\nNotre collection boisée:\n• Bois Intense (Homme) - 680 MAD\n• Cèdre Noir (Homme) - 720 MAD\n• Santal Royal (Homme) - 850 MAD\n• Patchouli Noir (Homme) - 780 MAD\n\nParfaits pour les amateurs de fragrances viriles.";
        } else {
          responseText = "🌸 **Notes Olfactives**\n\nDécouvrez nos parfums par notes:\n\n🌹 **Florales:** Rose, Jasmin, Fleur d'Oranger\n🪵 **Boisées:** Oud, Santal, Cèdre, Patchouli\n🍦 **Gourmandes:** Vanille, Caramel, Cacao\n✨ **Orientales:** Ambre, Musc, Encens\n🍊 **Fraîches:** Yuzu, Citron, Gingembre\n\nQuelle note vous attire? Dites-moi \"Parfums à l'oud\" ou \"Parfums floraux\"!";
        }
      }
      else {
        const specificProduct = products.find(p => 
          userQuery.includes(p.name.toLowerCase().substring(0, 20))
        );
        if (specificProduct) {
          responseText = "🌸 **FICHE PARFUM**\n\n" +
            `✨ **Nom:** ${specificProduct.name}\n` +
            `💰 **Prix:** ${formatPrice(specificProduct.price)}\n` +
            `🏷️ **Catégorie:** ${specificProduct.category}\n` +
            `📦 **Stock:** ${specificProduct.stock > 0 ? `${specificProduct.stock} flacons` : 'Rupture'}\n` +
            `📝 **Description:** ${specificProduct.description}\n` +
            `🔧 **Notes olfactives:** ${specificProduct.details}\n\n` +
            `💡 **Suggestions:**\n` +
            `• Découvrez notre collection ${specificProduct.category.toLowerCase()}\n` +
            `• Offrez-le en coffret cadeau\n` +
            `• Demandez un échantillon gratuit avec votre commande`;
        } else {
          responseText = "🌸 Je n'ai pas compris votre demande.\n\nVoici comment m'utiliser:\n\n📌 **Exemples:**\n• \"Montre-moi les parfums femme\"\n• \"Prix de Arij Royal Oud\"\n• \"Parfums en stock\"\n• \"Parfums sous 700 MAD\"\n• \"Parfums à l'oud\"\n• \"Coffrets cadeaux disponibles\"\n\n🌸 **Catégories disponibles:**\n- Parfums Femme\n- Parfums Homme\n- Parfums Unisex\n- Parfums de Luxe\n- Coffrets Cadeaux\n\nPosez votre question en français ou anglais!";
        }
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString('fr-MA')
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const quickQuestions = [
    "🌸 Parfums Femme",
    "🪵 Parfums Homme",
    "💰 Prix Arij Royal Oud",
    "📦 Stock Rose de Damas",
    "💵 Parfums sous 600 MAD",
    "🎁 Coffrets cadeaux",
    "🪵 Parfums à l'oud",
    "🌹 Parfums floraux"
  ];

  const styles = {
    floatBtn: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '65px',
      height: '65px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)',
      color: '#1A1A1A',
      border: '2px solid #FFE066',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      transition: 'all 0.3s ease',
      zIndex: 999,
      animation: 'pulse 2s infinite',
    },
    chatWindow: {
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      width: '400px',
      height: '600px',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 1000,
      animation: 'slideUp 0.3s ease-out',
    },
    header: {
      background: 'linear-gradient(135deg, #2A1A0A 0%, #3A2A1A 100%)',
      color: '#D4AF37',
      padding: '14px 18px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    perfumeIcon: {
      fontSize: '28px',
      background: 'rgba(212, 175, 55, 0.2)',
      borderRadius: '50%',
      padding: '4px',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      margin: 0,
      color: '#D4AF37',
    },
    headerSub: {
      fontSize: '0.7rem',
      opacity: 0.9,
      margin: 0,
      color: 'rgba(255,255,255,0.8)',
    },
    closeBtn: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      color: 'white',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    clearBtn: {
      background: 'rgba(212, 175, 55, 0.2)',
      border: 'none',
      color: '#D4AF37',
      padding: '4px 10px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.7rem',
      marginLeft: '10px',
    },
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      background: '#FDFBF7',
    },
    welcomeBox: {
      textAlign: 'center',
      padding: '20px 15px',
      background: 'white',
      borderRadius: '12px',
      margin: '5px',
      border: '1px solid rgba(212, 175, 55, 0.15)',
    },
    welcomeIcon: {
      fontSize: '48px',
      marginBottom: '10px',
      background: 'rgba(212, 175, 55, 0.1)',
      borderRadius: '50%',
      padding: '10px',
      display: 'inline-block',
    },
    welcomeTitle: {
      fontSize: '1.2rem',
      marginBottom: '8px',
      color: '#2A1A0A',
    },
    welcomeText: {
      color: '#666',
      fontSize: '0.85rem',
      marginBottom: '15px',
      lineHeight: '1.5',
    },
    categories: {
      display: 'flex',
      gap: '6px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '15px',
    },
    categoryTag: {
      background: 'rgba(212, 175, 55, 0.1)',
      color: '#B8960F',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.7rem',
      fontWeight: '500',
    },
    suggestions: {
      marginTop: '15px',
    },
    suggestionTitle: {
      fontSize: '0.75rem',
      color: '#888',
      marginBottom: '10px',
      fontWeight: '500',
    },
    suggestionBtns: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    suggestionBtn: {
      background: 'white',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      padding: '6px 12px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '0.7rem',
      color: '#B8960F',
      transition: 'all 0.2s',
    },
    message: {
      display: 'flex',
      gap: '10px',
      marginBottom: '14px',
      animation: 'slideIn 0.2s ease-out',
    },
    userMessage: {
      justifyContent: 'flex-end',
    },
    avatar: {
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      flexShrink: 0,
    },
    userAvatar: {
      background: 'linear-gradient(135deg, #2A1A0A 0%, #3A2A1A 100%)',
    },
    assistantAvatar: {
      background: 'white',
      border: '2px solid #D4AF37',
    },
    messageContent: {
      maxWidth: '75%',
    },
    userContent: {
      background: 'linear-gradient(135deg, #2A1A0A 0%, #3A2A1A 100%)',
      color: '#D4AF37',
      padding: '8px 12px',
      borderRadius: '12px',
      fontSize: '0.85rem',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap',
    },
    assistantContent: {
      background: 'white',
      color: '#333',
      padding: '8px 12px',
      borderRadius: '12px',
      fontSize: '0.85rem',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid rgba(212, 175, 55, 0.2)',
    },
    time: {
      fontSize: '0.6rem',
      color: '#999',
      marginTop: '4px',
      textAlign: 'right',
    },
    loading: {
      background: 'white',
      padding: '8px 12px',
      borderRadius: '12px',
      fontSize: '0.85rem',
      color: '#D4AF37',
      display: 'inline-block',
      border: '1px solid rgba(212, 175, 55, 0.2)',
    },
    inputArea: {
      background: 'white',
      borderTop: '1px solid rgba(212, 175, 55, 0.15)',
      padding: '12px 16px',
    },
    inputContainer: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-end',
    },
    textarea: {
      flex: 1,
      padding: '10px',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '10px',
      fontFamily: 'inherit',
      fontSize: '0.85rem',
      resize: 'vertical',
      transition: 'all 0.2s',
    },
    sendBtn: {
      padding: '10px 20px',
      background: 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)',
      color: '#1A1A1A',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    hint: {
      marginTop: '8px',
      fontSize: '0.65rem',
      color: '#999',
      textAlign: 'center',
    },
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <button
        className="float-button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...styles.floatBtn,
          ...(isHovered ? { transform: 'scale(1.1)', boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)' } : {}),
        }}
      >
        🌸
      </button>

      {isOpen && (
        <div ref={chatWindowRef} style={styles.chatWindow}>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.perfumeIcon}>
                🌸
              </div>
              <div>
                <h2 style={styles.headerTitle}>Arij Assistant</h2>
                <p style={styles.headerSub}>Votre conseiller parfumerie</p>
              </div>
              <button onClick={clearChat} style={styles.clearBtn}>
                🗑️ Nouveau
              </button>
            </div>
            <button onClick={closeChat} style={styles.closeBtn}>
              ✕
            </button>
          </div>

          <div style={styles.messagesArea}>
            {messages.length === 0 ? (
              <div style={styles.welcomeBox}>
                <div style={styles.welcomeIcon}>
                  🌸
                </div>
                <h3 style={styles.welcomeTitle}>Bienvenue chez Arij Parfums</h3>
                <p style={styles.welcomeText}>Je suis votre conseiller personnel. Je vous aide à trouver le parfum parfait selon vos goûts et votre budget.</p>
                <div style={styles.categories}>
                  <span style={styles.categoryTag}>🌸 Femme</span>
                  <span style={styles.categoryTag}>🪵 Homme</span>
                  <span style={styles.categoryTag}>✨ Unisex</span>
                  <span style={styles.categoryTag}>💎 Luxe</span>
                  <span style={styles.categoryTag}>🎁 Coffrets</span>
                </div>
                <div style={styles.suggestions}>
                  <div style={styles.suggestionTitle}>Suggestions rapides:</div>
                  <div style={styles.suggestionBtns}>
                    {quickQuestions.map((q, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setInput(q.replace(/^[^a-zA-Z]+/, ''))} 
                        style={styles.suggestionBtn}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(212, 175, 55, 0.1)'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} style={{...styles.message, ...(msg.role === 'user' ? styles.userMessage : {})}}>
                  <div style={{
                    ...styles.avatar,
                    ...(msg.role === 'user' ? styles.userAvatar : styles.assistantAvatar)
                  }}>
                    {msg.role === 'user' ? '👤' : '🌸'}
                  </div>
                  <div style={styles.messageContent}>
                    <div style={msg.role === 'user' ? styles.userContent : styles.assistantContent}>
                      {msg.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < msg.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={styles.time}>{msg.timestamp}</div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div style={styles.message}>
                <div style={{...styles.avatar, ...styles.assistantAvatar}}>🌸</div>
                <div style={styles.loading}>
                  🌸 Recherche du parfum idéal...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            <div style={styles.inputContainer}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Cherchez un parfum, une note, une catégorie..."
                rows="2"
                disabled={isLoading}
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'}
              />
              <button 
                onClick={sendMessage} 
                disabled={isLoading || !input.trim()}
                style={styles.sendBtn}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {isLoading ? '...' : 'Envoyer'}
              </button>
            </div>
            <div style={styles.hint}>
              ⏎ Entrée pour envoyer • ⇧ Shift+Entrée pour nouvelle ligne
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
          }
        }
        
        textarea:focus {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }
        
        button:hover {
          opacity: 0.9;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #B8960F;
        }
      `}</style>
    </>
  );
};


export default TeclabAgent;
