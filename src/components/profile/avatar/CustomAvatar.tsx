import React from 'react';
import type { AvatarConfig } from './avatarConfig';

interface CustomAvatarProps {
  config: AvatarConfig;
  className?: string;
  style?: React.CSSProperties;
  username?: string;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({ config, className, style, username = 'U' }) => {
  // Fallback component when we're still implementing the full avatar
  return (
    <div 
      className={`${className} flex items-center justify-center bg-primary text-primary-foreground font-semibold`}
      style={{
        width: style?.width || '100%',
        height: style?.height || '100%',
        borderRadius: '50%',
        fontSize: 'calc(min(100%, 100vh) * 0.4)',
        ...style
      }}
    >
      {username.charAt(0).toUpperCase()}
    </div>
  );
};

CustomAvatar.displayName = 'CustomAvatar'; 