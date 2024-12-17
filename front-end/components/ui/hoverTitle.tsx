import React, { useState } from 'react';

type Props={
    text1: string,
    text2: string,
}

const HoverTitle = ({text1, text2}: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`text-2xl main-font text-text2 group relative cursor-pointer transition-all duration-300 ease-in-out ${isHovered ? 'text-opacity-50' : ''} `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 
        className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {text1}
      </h2>
      <h2 
        className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'} `}
      >
        {text2}
      </h2>
    </div>
  );
};

export default HoverTitle;
