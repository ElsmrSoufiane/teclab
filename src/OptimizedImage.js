import React, { useState, useEffect, useRef } from 'react';

export const OptimizedImage = ({ src, alt, className, width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const placeholderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px', threshold: 0.01 }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoaded(true);
      };
      img.onerror = () => {
        // If image fails to load, still show something
        setIsLoaded(true);
      };
    }
  }, [isInView, src]);

  return (
    <div 
      ref={placeholderRef} 
      className={`image-container ${className || ''}`} 
      style={{ 
        width: width || '100%', 
        height: height || '100%', 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {!isLoaded && (
        <div className="image-placeholder" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: 'inherit'
        }} />
      )}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt || 'Product image'}
          className={className}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'relative',
            zIndex: 1
          }}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            console.error('Image failed to load:', src);
            e.target.src = 'https://via.placeholder.com/300?text=Image+non+disponible';
            setIsLoaded(true);
          }}
        />
      )}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};
