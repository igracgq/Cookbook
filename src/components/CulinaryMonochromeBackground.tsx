import React from 'react';

export const CulinaryMonochromeBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.035]"
      style={{
        backgroundImage: `radial-gradient(#4A3B2C 0.75px, transparent 0.75px), radial-gradient(#4A3B2C 0.75px, #F4EEE5 0.75px)`,
        backgroundSize: `30px 30px`,
        backgroundPosition: `0 0, 15px 15px`
      }}
    />
  );
};
