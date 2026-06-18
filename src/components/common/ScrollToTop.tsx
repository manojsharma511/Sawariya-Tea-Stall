import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that resets window scroll position to the top on every route transition.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
