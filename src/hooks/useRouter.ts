import { useState, useEffect } from 'react';

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash;
    return hash ? hash.replace('#', '') : '/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentPath(hash ? hash.replace('#', '') : '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initialize standard hash if empty
    if (!window.location.hash) {
      window.location.hash = '#/';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = (path: string) => {
    window.location.hash = '#' + path;
  };

  // Extract ID parameters for dynamic routes, e.g. /product/123 -> returns 123
  const getParam = (routePattern: string): string | null => {
    const parts = currentPath.split('/');
    const patternParts = routePattern.split('/');
    if (parts.length !== patternParts.length) return null;
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        return parts[i];
      } else if (patternParts[i] !== parts[i]) {
        return null;
      }
    }
    return null;
  };

  const isMatched = (routePattern: string): boolean => {
    if (routePattern.includes(':')) {
      return getParam(routePattern) !== null;
    }
    return currentPath === routePattern || currentPath.startsWith(routePattern + '/');
  };

  return {
    currentPath,
    navigate,
    getParam,
    isMatched
  };
}
