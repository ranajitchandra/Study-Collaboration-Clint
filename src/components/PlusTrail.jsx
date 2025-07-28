

import { useEffect } from 'react';

const PlusTrail = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const plus = document.createElement('div');
      plus.className = 'plus';
      plus.textContent = '+';
      plus.style.left = `${e.pageX}px`;
      plus.style.top = `${e.pageY}px`;
      document.body.appendChild(plus);

      setTimeout(() => {
        plus.remove();
      }, 1000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
};

export default PlusTrail;