import React from 'react';

interface UserAvatarProps {
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  userId?: number;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-xl',
};

export function UserAvatar({ src, size = 'md', userId, className = '' }: UserAvatarProps) {
  const [error, setError] = React.useState(false);
  const initial = userId ? String(userId % 10) : 'U';

  if (!src || error) {
    return (
      <div
        className={`avatar placeholder ${className}`}
      >
        <div className={`${sizeClasses[size]} bg-neutral text-neutral-content rounded-full`}>
          <span>{initial}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`avatar ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full`}>
        <img
          src={src}
          alt="avatar"
          onError={() => setError(true)}
        />
      </div>
    </div>
  );
}
