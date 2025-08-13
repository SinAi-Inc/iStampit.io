"use client";
import React from 'react';
import Image from 'next/image';

type Props = {
  /** Size (height & width since source SVG is square). Default 32px */
  size?: number;
  /** Additional wrapper classes */
  className?: string;
  /** Accessible label / tooltip */
  title?: string;
};

/**
 * Theme-aware logo that swaps SVGs based on dark mode.
 * Requires `.dark` class on <html> or `prefers-color-scheme: dark`.
 * SVGs contain a subtle "SinAI Inc" watermark embedded.
 *
 * Size is strictly controlled to prevent SVG from expanding to intrinsic dimensions.
 */
export default function BrandLogo({
  size = 32,
  className,
  title = "iStampit.io",
}: Props) {
  const classes = [
    'inline-flex items-center shrink-0 select-none pointer-events-none',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} aria-label={title}>
      <Image
        src="/logo/logo-light.svg"
        alt={title}
        width={size}
        height={size}
        className="block dark:hidden align-middle"
        priority
      />
      <Image
        src="/logo/logo-dark.svg"
        alt={title}
        width={size}
        height={size}
        className="hidden dark:block align-middle"
        priority
      />
    </span>
  );
}
