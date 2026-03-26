import React, { useState, useRef, useEffect } from 'react';

const TeclabAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Product Database with better descriptions
  const products = [
    { id: 1, name: "Tube Sous Vide SEC (Sans Additifs) 4ml", price: 95.00, category: "TUBES DE PRELEVEMENT", brand: "VACULAB", stock: 25, description: "Tube sous vide SEC sans additifs 4ml en plastique pour prélèvement sanguin", details: "Volume: 4ml, Sans additifs, Stérile" },
    { id: 2, name: "Tube PRP GEL+NC1:9", price: 140.00, category: "TUBES DE PRELEVEMENT", brand: "VACULAB", stock: 18, description: "Tube PRP avec gel séparateur pour plasma riche en plaquettes", details: "Avec gel, Rapport 1:9, Pour PRP" },
    { id: 3, name: "Tube Sous Vide ESR 1,6ml Verre", price: 800.00, category: "TUBES DE PRELEVEMENT", brand: "VACULAB", stock: 12, description: "Tube sous vide pour vitesse de sédimentation (ESR) en verre", details: "Volume: 1.6ml, Matériel: Verre, Pour VS" },
    { id: 4, name: "Tube Sous Vide EDTA Plastique", price: 105.00, category: "TUBES DE PRELEVEMENT", brand: "VACULAB", stock: 35, description: "Tube sous vide avec EDTA pour hématologie", details: "EDTA, Pour hématologie, Plastique" },
    { id: 5, name: "VANCOMYCINE VA-30", price: 550.00, category: "AIGUILLES ET ACCESSOIRES", brand: "BIOKAR", stock: 28, description: "Vancomycine VA-30 pour tests de sensibilité", details: "Antibiotique, Tests de sensibilité, 30μg" },
    { id: 6, name: "PIPERACILLINE/TAZOBACTAM TPZ-36", price: 680.00, category: "AIGUILLES ET ACCESSOIRES", brand: "BIOKAR", stock: 18, description: "Piperacilline/Tazobactam TPZ-36", details: "Combinaison antibiotique, Spectre large" },
    { id: 7, name: "Support Mobile Détecteur Veines", price: 2500.00, category: "CONSOMMABLES", brand: "QUALMEDI", stock: 8, description: "Support mobile pour détecteur de veines", details: "Mobile, Hauteur réglable, Stable" },
    { id: 8, name: "Sparadrap adulte", price: 150.00, category: "CONSOMMABLES", brand: "CURE-AID", stock: 45, description: "Sparadrap adulte pour fixation de pansements", details: "Adhésif, Hypoallergénique, 10m" },
    { id: 9, name: "RF LATEX", price: 1200.00, category: "REACTIFS", brand: "HYCEL", stock: 15, description: "Réactif RF Latex pour facteur rhumatoïde", details: "Détection du facteur rhumatoïde, Résultats rapides" },
    { id: 10, name: "Analyseur biochimie BT-330", price: 45000.00, category: "ANALYSEURS", brand: "BIOELAB", stock: 3, description: "Analyseur de biochimie BT-330 pour tests cliniques", details: "300 tests/heure, Écran tactile, 80 paramètres" },
    { id: 11, name: "Détecteur veines QV-600", price: 12000.00, category: "ANALYSEURS", brand: "QUALMEDI", stock: 5, description: "Détecteur de veines QV-600 pour localisation facile", details: "Infrarouge, Portable, Batterie rechargeable" },
    { id: 12, name: "Analyseur biochimie AS-280", price: 38000.00, category: "ANALYSEURS", brand: "BIOELAB", stock: 4, description: "Analyseur de biochimie AS-280 compact et fiable", details: "200 tests/heure, Compact, Interface intuitive" },
    { id: 13, name: "Analyseur hématologie BH-5390", price: 65000.00, category: "ANALYSEURS", brand: "URIT", stock: 2, description: "Analyseur d'hématologie 5 différences", details: "5 différences, 80 échantillons/heure, 23 paramètres" },
    { id: 14, name: "Analyseur HbA1c MQ-3000", price: 32000.00, category: "ANALYSEURS", brand: "MEDCONN", stock: 3, description: "Analyseur d'hémoglobine glyquée", details: "Résultats en 5 min, Contrôle diabète, Précis" },
    { id: 15, name: "Analyseur gaz du sang EG-i", price: 68000.00, category: "ANALYSEURS", brand: "EAGLENOS", stock: 2, description: "Analyseur de gaz du sang", details: "pH, pCO2, pO2, Électrolytes, Rapide" },
  ];

  // Function to close chat window
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
    
    if (lowerQuery.includes('tube') || lowerQuery.includes('prélèvement') || lowerQuery.includes('edta') || lowerQuery.includes('citrate')) {
      return products.filter(p => p.category === 'TUBES DE PRELEVEMENT');
    }
    if (lowerQuery.includes('aiguille') || lowerQuery.includes('antibiotique') || lowerQuery.includes('vancomycine') || lowerQuery.includes('piperacilline')) {
      return products.filter(p => p.category === 'AIGUILLES ET ACCESSOIRES');
    }
    if (lowerQuery.includes('consommable') || lowerQuery.includes('support') || lowerQuery.includes('sparadrap')) {
      return products.filter(p => p.category === 'CONSOMMABLES');
    }
    if (lowerQuery.includes('réactif') || lowerQuery.includes('latex') || lowerQuery.includes('rf')) {
      return products.filter(p => p.category === 'REACTIFS');
    }
    if (lowerQuery.includes('analyseur') || lowerQuery.includes('détecteur') || lowerQuery.includes('machine') || lowerQuery.includes('biochimie') || lowerQuery.includes('hématologie')) {
      return products.filter(p => p.category === 'ANALYSEURS');
    }
    if (lowerQuery.includes('vaculab')) {
      return products.filter(p => p.brand === 'VACULAB');
    }
    if (lowerQuery.includes('biokar')) {
      return products.filter(p => p.brand === 'BIOKAR');
    }
    if (lowerQuery.includes('qualmedi')) {
      return products.filter(p => p.brand === 'QUALMEDI');
    }
    if (lowerQuery.includes('bioelab')) {
      return products.filter(p => p.brand === 'BIOELAB');
    }
    
    if (lowerQuery.match(/\d+/)) {
      const priceMatch = lowerQuery.match(/(\d+)/);
      if (priceMatch && (lowerQuery.includes('sous') || lowerQuery.includes('moins de') || lowerQuery.includes('under'))) {
        const maxPrice = parseInt(priceMatch[1]);
        return products.filter(p => p.price <= maxPrice);
      }
    }
    
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery)
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(price);
  };

  const formatProductList = (productsList) => {
    if (productsList.length === 0) {
      return "❌ Désolé, aucun produit trouvé.\n\n💡 Suggestions:\n• \"Montre-moi les tubes EDTA\"\n• \"Analyseurs biochimie\"\n• \"Produits VACULAB\"\n• \"Antibiotiques BIOKAR\"\n• \"Produits sous 5000 MAD\"";
    }
    
    let response = `🔍 ${productsList.length} produit(s) trouvé(s):\n\n`;
    productsList.slice(0, 4).forEach(product => {
      response += `📦 ${product.name}\n`;
      response += `   💰 Prix: ${formatPrice(product.price)}\n`;
      response += `   📊 Stock: ${product.stock > 0 ? `✅ ${product.stock} unités` : '❌ Rupture'}\n`;
      response += `   🏭 Marque: ${product.brand}\n`;
      response += `   📝 ${product.description}\n`;
      if (product.details) response += `   🔧 ${product.details}\n`;
      response += `\n`;
    });
    
    if (productsList.length > 4) {
      response += `📌 ... et ${productsList.length - 4} autre(s) produit(s).\n`;
      response += `💡 Demandez \"plus de détails sur [produit]\" pour en savoir plus.`;
    } else {
      response += `💡 Besoin d'aide? Demandez-moi les détails d'un produit spécifique.`;
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
        responseText = "🥼 Bonjour! Je suis l'assistant Teclab.\n\nJe peux vous aider avec:\n✅ Consulter nos produits (tubes, analyseurs, réactifs)\n✅ Vérifier les prix et disponibilités\n✅ Rechercher par marque (VACULAB, BIOKAR, etc.)\n✅ Trouver des produits selon votre budget\n\nComment puis-je vous aider aujourd'hui?";
      }
      else if (userQuery.includes('aide') || userQuery.includes('help') || userQuery.includes('peux-tu') || userQuery.includes('que faire')) {
        responseText = "🥼 Voici ce que je peux faire pour vous:\n\n📦 Rechercher des produits\n\"Montre-moi les tubes EDTA\"\n\n💰 Vérifier les prix\n\"Prix de l'analyseur AS-280\"\n\n🏷️ Filtrer par marque\n\"Produits VACULAB\"\n\n📊 Voir disponibilité\n\"Le détecteur QV-600 est-il en stock?\"\n\n💵 Recherche par prix\n\"Produits sous 5000 MAD\"\n\n🔬 Catégories disponibles:\n- Tubes de prélèvement (VACULAB)\n- Antibiotiques (BIOKAR)\n- Analyseurs (biochimie, hématologie)\n- Réactifs de laboratoire\n- Consommables\n\nQue voulez-vous explorer?";
      }
      else if (userQuery.includes('prix') || userQuery.includes('price') || userQuery.includes('coût') || userQuery.includes('combien')) {
        const productMatch = products.find(p => 
          userQuery.includes(p.name.toLowerCase().split(' ')[0]) ||
          userQuery.includes(p.name.toLowerCase().split(' ')[1]) ||
          userQuery.includes(p.name.toLowerCase().substring(0, 20))
        );
        if (productMatch) {
          responseText = `📊 **${productMatch.name}**\n\n💰 **Prix:** ${formatPrice(productMatch.price)}\n🏭 **Marque:** ${productMatch.brand}\n📦 **Stock:** ${productMatch.stock > 0 ? `${productMatch.stock} unités disponibles` : 'En rupture de stock'}\n📝 **Description:** ${productMatch.description}\n🔧 **Caractéristiques:** ${productMatch.details || 'Contactez-nous pour plus de détails'}\n\n💡 **Besoin d'aide?** Demandez-moi les produits similaires!`;
        } else {
          responseText = "🔍 Quel produit vous intéresse?\n\nExemples:\n• \"Prix du tube EDTA\"\n• \"Combien coûte l'analyseur AS-280?\"\n• \"Tarif vancomycine VA-30\"\n\nDonnez-moi le nom exact du produit pour une réponse précise.";
        }
      }
      else if (userQuery.includes('stock') || userQuery.includes('disponible') || userQuery.includes('available') || userQuery.includes('en stock')) {
        const productMatch = products.find(p => 
          userQuery.includes(p.name.toLowerCase().split(' ')[0]) ||
          userQuery.includes(p.name.toLowerCase().substring(0, 20))
        );
        if (productMatch) {
          const stockStatus = productMatch.stock > 0 
            ? `✅ **EN STOCK** - ${productMatch.stock} unités disponibles` 
            : "❌ **RUPTURE DE STOCK** - Réapprovisionnement en cours";
          responseText = `📦 **${productMatch.name}**\n${stockStatus}\n\n🏭 **Marque:** ${productMatch.brand}\n💰 **Prix:** ${formatPrice(productMatch.price)}\n\n⏱️ **Délai de livraison:** 2-3 jours ouvrables\n📞 **Contact:** 05 22 123 456 pour une commande urgente`;
        } else {
          responseText = "🔍 Vérifions la disponibilité ensemble!\n\nQuel produit vous intéresse?\nExemples:\n• \"Tube EDTA en stock?\"\n• \"Analyseur BH-5390 disponible\"\n• \"Vancomycine VA-30 stock\"";
        }
      }
      else if (userQuery.includes('montre') || userQuery.includes('affiche') || userQuery.includes('cherche') || 
               userQuery.includes('trouve') || userQuery.includes('liste') || userQuery.includes('catalogue')) {
        const results = searchProducts(userQuery);
        responseText = formatProductList(results);
      }
      else {
        const specificProduct = products.find(p => 
          userQuery.includes(p.name.toLowerCase().substring(0, 25))
        );
        if (specificProduct) {
          responseText = "📋 **FICHE PRODUIT**\n\n" +
            `🔬 **Nom:** ${specificProduct.name}\n` +
            `💰 **Prix:** ${formatPrice(specificProduct.price)}\n` +
            `🏷️ **Catégorie:** ${specificProduct.category}\n` +
            `🏭 **Marque:** ${specificProduct.brand}\n` +
            `📦 **Stock:** ${specificProduct.stock > 0 ? `${specificProduct.stock} unités` : 'Rupture'}\n` +
            `📝 **Description:** ${specificProduct.description}\n` +
            `🔧 **Caractéristiques:** ${specificProduct.details || 'Nous contacter pour plus dinformations'}\n\n` +
            `💡 **Suggestions:**\n` +
            `• Voulez-vous voir des produits similaires?\n` +
            `• Souhaitez-vous connaître les accessoires compatibles?`;
        } else {
          responseText = "🥼 Je n'ai pas compris votre demande.\n\nVoici comment m'utiliser:\n\n📌 **Exemples:**\n• \"Montre-moi les tubes de prélèvement\"\n• \"Prix de l'analyseur AS-280\"\n• \"Produits VACULAB disponibles\"\n• \"Quel est le stock du détecteur QV-600?\"\n• \"Produits sous 1000 MAD\"\n\n🔍 **Catégories:**\n- Tubes de prélèvement\n- Antibiotiques\n- Analyseurs\n- Réactifs\n- Consommables\n\nPosez votre question en français ou anglais!";
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
    "🔬 Tubes de prélèvement",
    "💰 Prix analyseur AS-280",
    "📦 Stock détecteur QV-600",
    "💵 Produits sous 5000 MAD",
    "🏭 Produits VACULAB",
    "💊 Antibiotiques BIOKAR"
  ];

  const styles = {
    floatBtn: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '65px',
      height: '65px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
      color: '#2c5f8a',
      border: '2px solid #2c5f8a',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
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
      background: 'linear-gradient(135deg, #2c5f8a 0%, #1e3a5f 100%)',
      color: 'white',
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
    doctorIcon: {
      fontSize: '28px',
      background: 'white',
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
    },
    headerSub: {
      fontSize: '0.7rem',
      opacity: 0.9,
      margin: 0,
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
      background: 'rgba(255, 255, 255, 0.15)',
      border: 'none',
      color: 'white',
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
      background: '#f8f9fc',
    },
    welcomeBox: {
      textAlign: 'center',
      padding: '20px 15px',
      background: 'white',
      borderRadius: '12px',
      margin: '5px',
    },
    welcomeIcon: {
      fontSize: '48px',
      marginBottom: '10px',
      background: '#f0f0f0',
      borderRadius: '50%',
      padding: '10px',
      display: 'inline-block',
    },
    welcomeTitle: {
      fontSize: '1.2rem',
      marginBottom: '8px',
      color: '#2c5f8a',
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
      background: '#e8f0f7',
      color: '#2c5f8a',
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
      background: '#f0f2f5',
      border: '1px solid #e0e4e8',
      padding: '6px 12px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '0.7rem',
      color: '#2c5f8a',
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
      background: 'linear-gradient(135deg, #2c5f8a 0%, #1e3a5f 100%)',
    },
    assistantAvatar: {
      background: 'white',
      border: '2px solid #2c5f8a',
    },
    messageContent: {
      maxWidth: '75%',
    },
    userContent: {
      background: 'linear-gradient(135deg, #2c5f8a 0%, #1e3a5f 100%)',
      color: 'white',
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
      border: '1px solid #e0e4e8',
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
      color: '#2c5f8a',
      display: 'inline-block',
      border: '1px solid #e0e4e8',
    },
    inputArea: {
      background: 'white',
      borderTop: '1px solid #e9ecef',
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
      border: '1px solid #dee2e6',
      borderRadius: '10px',
      fontFamily: 'inherit',
      fontSize: '0.85rem',
      resize: 'vertical',
      transition: 'all 0.2s',
    },
    sendBtn: {
      padding: '10px 20px',
      background: 'linear-gradient(135deg, #2c5f8a 0%, #1e3a5f 100%)',
      color: 'white',
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
          ...(isHovered ? { transform: 'scale(1.1)', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)' } : {}),
        }}
      >
        🥼
      </button>

      {isOpen && (
        <div ref={chatWindowRef} style={styles.chatWindow}>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.doctorIcon}>
                🥼
              </div>
              <div>
                <h2 style={styles.headerTitle}>Teclab Agent</h2>
                <p style={styles.headerSub}>Assistant produits laboratoire</p>
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
                  🥼
                </div>
                <h3 style={styles.welcomeTitle}>Bonjour!</h3>
                <p style={styles.welcomeText}>Je suis l'assistant Teclab. Je peux vous aider à trouver des produits de laboratoire, vérifier les prix et disponibilités.</p>
                <div style={styles.categories}>
                  <span style={styles.categoryTag}>🧪 Tubes</span>
                  <span style={styles.categoryTag}>💊 Antibiotiques</span>
                  <span style={styles.categoryTag}>🔬 Analyseurs</span>
                  <span style={styles.categoryTag}>🧴 Réactifs</span>
                  <span style={styles.categoryTag}>🛠️ Consommables</span>
                </div>
                <div style={styles.suggestions}>
                  <div style={styles.suggestionTitle}>Questions fréquentes:</div>
                  <div style={styles.suggestionBtns}>
                    {quickQuestions.map((q, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setInput(q.replace(/^[^a-zA-Z]+/, ''))} 
                        style={styles.suggestionBtn}
                        onMouseEnter={(e) => e.target.style.background = '#e8f0f7'}
                        onMouseLeave={(e) => e.target.style.background = '#f0f2f5'}
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
                    {msg.role === 'user' ? '👤' : '🥼'}
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
                <div style={{...styles.avatar, ...styles.assistantAvatar}}>🥼</div>
                <div style={styles.loading}>
                  🤔 Recherche en cours...
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
                placeholder="Posez votre question..."
                rows="2"
                disabled={isLoading}
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#2c5f8a'}
                onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
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
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(44, 95, 138, 0.3);
          }
        }
        
        textarea:focus {
          outline: none;
          border-color: #2c5f8a;
          box-shadow: 0 0 0 3px rgba(44, 95, 138, 0.1);
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
          background: #c1c9d2;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #2c5f8a;
        }
      `}</style>
    </>
  );
};

export default TeclabAgent;
