import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import logoLight from '../../assets/workvista-logo-light.png';
import logoDark from '../../assets/workvista-logo-dark.png';

/**
 * Official WORKVISTA Logo Component
 * - Displays theme-specific transparent WORKVISTA brand artwork directly:
 *   - Light Mode: Clean light logo asset
 *   - Dark Mode: Clean de-matted dark-compatible logo asset (zero halo, zero glow, zero noise)
 * - Strictly bounded dimensions (36px in header, natural aspect ratio ~1.78:1)
 * - Vertically centered with consistent alignment
 */
export default function WorkVistaLogo({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  to = null,
  showText = true,
  subtitle = 'HR Intelligence',
  className = '',
  theme: forcedTheme = null
}) {
  let isDark = true;
  try {
    const themeContext = useTheme();
    isDark = forcedTheme ? forcedTheme === 'dark' : themeContext.isDark;
  } catch {
    if (forcedTheme) {
      isDark = forcedTheme === 'dark';
    } else if (typeof document !== 'undefined') {
      isDark = document.documentElement.classList.contains('dark');
    }
  }

  const logoSrc = isDark ? logoDark : logoLight;

  const sizeMap = {
    sm: {
      height: 28,
      title: 'text-xs',
      sub: 'text-[8px]'
    },
    md: {
      height: 36,
      title: 'text-sm xl:text-[15px]',
      sub: 'text-[8px] xl:text-[9px]'
    },
    lg: {
      height: 48,
      title: 'text-lg sm:text-xl',
      sub: 'text-[9px] sm:text-[10px]'
    },
    xl: {
      height: 60,
      title: 'text-xl sm:text-2xl',
      sub: 'text-xs'
    }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex items-center gap-2.5 select-none flex-shrink-0 ${className}`}>
      {/* Official WORKVISTA Logo Image — Strictly constrained dimensions (36px in header) */}
      <img
        src={logoSrc}
        alt="WORKVISTA Logo"
        style={{
          height: `${currentSize.height}px`,
          maxHeight: `${currentSize.height}px`,
          width: 'auto',
          maxWidth: `${Math.round(currentSize.height * 1.8)}px`,
          objectFit: 'contain'
        }}
        className="flex-shrink-0 transition-transform duration-200 ease-out"
        loading="eager"
      />

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col justify-center leading-none text-left">
          <span className={`font-extrabold tracking-wider text-[#08243D] dark:text-[#F0F9FF] leading-none uppercase font-sans ${currentSize.title}`}>
            WORKVISTA
          </span>
          {subtitle && (
            <span className={`font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase mt-0.5 leading-none ${currentSize.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg flex-shrink-0"
        aria-label="WORKVISTA Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}


