import { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import { SCROLL_THRESHOLD } from '@/types/dashboard';

export const useScrollHeader = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < SCROLL_THRESHOLD);
      setLastScrollY(currentScrollY);
    }, 150);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [lastScrollY]);

  return isHeaderVisible;
};