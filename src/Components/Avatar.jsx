import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const Avatar = ({ 
  user, 
  size = 'md', 
  className = '', 
  showStatus = false, 
  status = 'online',
  onClick = null,
  showTooltip = false 
}) => {
  const { isDarkMode } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [userData, setUserData] = useState({
    name: 'User',
    email: '',
    avatar: null,
    initials: 'U'
  });

  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
    '3xl': 'w-24 h-24 text-3xl'
  };

  // Status colors
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  // Load user data
  useEffect(() => {
    const loadUserData = () => {
      if (user) {
        // If user object is provided, use it
        const name = user.name || user.username || user.email?.split('@')[0] || 'User';
        const email = user.email || '';
        const avatar = user.avatar || user.image || null;
        const initials = name.charAt(0).toUpperCase() + (name.split(' ')[1]?.charAt(0) || '');
        
        setUserData({ name, email, avatar, initials });
      } else {
        // Load from localStorage
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        
        if (email && token) {
          const name = email.split('@')[0];
          const initials = name.charAt(0).toUpperCase();
          
          setUserData({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            email: email,
            avatar: null,
            initials: initials
          });
        }
      }
    };

    loadUserData();
  }, [user]);

  // Generate avatar URL if no custom avatar
  const getAvatarUrl = () => {
    if (userData.avatar) return userData.avatar;
    
    // Generate a consistent color based on name
    const colors = [
      'A78BFA', 'F59E0B', '10B981', 'EF4444', '3B82F6', 
      '8B5CF6', 'EC4899', '06B6D4', '84CC16', 'F97316'
    ];
    const colorIndex = userData.name.charCodeAt(0) % colors.length;
    const color = colors[colorIndex];
    
    return `https://placehold.co/100x100/${color}/ffffff?text=${userData.initials}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const avatarContent = () => {
    if (userData.avatar && !imageError) {
      return (
        <img
          src={userData.avatar}
          alt={`${userData.name}'s avatar`}
          onError={handleImageError}
          className="w-full h-full object-cover rounded-full"
        />
      );
    }

    // Fallback to generated avatar or initials
    if (!imageError) {
      return (
        <img
          src={getAvatarUrl()}
          alt={`${userData.name}'s avatar`}
          onError={handleImageError}
          className="w-full h-full object-cover rounded-full"
        />
      );
    }

    // Final fallback to initials
    return (
      <div className={`w-full h-full rounded-full flex items-center justify-center font-semibold
        ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
        {userData.initials}
      </div>
    );
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 transition-all duration-300
          ${isDarkMode ? 'border-gray-600 hover:border-blue-400' : 'border-gray-200 hover:border-blue-500'}
          ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
          ${showTooltip ? 'group' : ''}`}
        onClick={onClick}
        title={showTooltip ? userData.name : undefined}
      >
        {avatarContent()}
        
        {/* Status indicator */}
        {showStatus && (
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 
            ${isDarkMode ? 'border-gray-900' : 'border-white'} ${statusColors[status]}`}>
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50
          ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-900 text-gray-100'}`}>
          {userData.name}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0
            ${isDarkMode ? 'border-t-gray-800' : 'border-t-gray-900'} border-l-transparent border-r-transparent border-t-4`}>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar; 
