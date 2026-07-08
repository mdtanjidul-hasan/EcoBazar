const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// 1. Add imports
code = code.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");

// 2. Add touch state and useEffects
const effectsCode = `
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchEndX - touchStartX < -60) {
        setIsMobileMenuOpen(false);
      }
    }
    setTouchStartX(null);
  };
`;

code = code.replace(
  "const handleSearchChange = (value: string) => {",
  effectsCode + "\n  const handleSearchChange = (value: string) => {"
);

// 3. Fix the menu toggle button
const menuToggleRegex = /{\/\* Hamburger Toggle \*\/}[\s\S]*?<\/button>/;
const newMenuToggle = `{/* Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ touchAction: 'manipulation' }}
                className="w-[44px] h-[44px] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#008D7F] rounded-full tap-target-44"
                title="Menu"
              >
                <Menu className="w-[24px] h-[24px]" />
              </button>`;
code = code.replace(menuToggleRegex, newMenuToggle);

fs.writeFileSync('src/components/Navbar.tsx', code);
