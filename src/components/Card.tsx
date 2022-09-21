import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={twMerge(
        `h-min shadow-lg border-solid border-2 rounded-md border-current p-5 w-full ${className ?? ''}`
      )}
    >
      {children}
    </div>
  );
};

export default Card;
