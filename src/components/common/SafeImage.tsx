import React, { useState } from 'react';
import { Scissors, Sparkles, User, Image as ImageIcon } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'hair' | 'barber' | 'spa' | 'color' | 'interior' | 'stylist' | 'general';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackType = 'general',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If error occurs, render an elegant, luxury branded salon placeholder
  if (hasError || !src) {
    return (
      <div 
        className={`bg-gradient-to-br from-[#EFECE5] to-[#DFD7C7] flex flex-col items-center justify-center text-[#1E3527] p-4 text-center select-none ${className}`}
        aria-label={alt || 'Demo Salon Image'}
      >
        <div className="w-10 h-10 rounded-full bg-[#1E3527]/10 flex items-center justify-center mb-2">
          {fallbackType === 'barber' || fallbackType === 'hair' ? (
            <Scissors className="w-5 h-5 text-[#1E3527]" />
          ) : fallbackType === 'stylist' ? (
            <User className="w-5 h-5 text-[#1E3527]" />
          ) : fallbackType === 'spa' || fallbackType === 'color' ? (
            <Sparkles className="w-5 h-5 text-[#C6A364]" />
          ) : (
            <ImageIcon className="w-5 h-5 text-[#1E3527]" />
          )}
        </div>
        <span className="font-serif text-xs font-semibold text-[#16281E] line-clamp-1 max-w-[90%]">
          {alt || 'Demo Parlor'}
        </span>
        <span className="text-[9px] uppercase tracking-widest text-[#788C71] mt-0.5 font-medium">
          Haute Coiffure
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Demo Salon'}
      loading="lazy"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onLoad={() => setIsLoaded(true)}
      onError={() => {
        setHasError(true);
      }}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-90'} transition-opacity duration-300`}
      {...props}
    />
  );
};
