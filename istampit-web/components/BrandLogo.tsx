"use client";
import React from 'react';
import Image from 'next/image';

type Props = {
  /** Height in pixels (default 32px) */
  height?: number;
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
  height = 32,
  className,
  title = "iStampit.io",
}: Props) {
  const style: React.CSSProperties = { height, width: 'auto' };
  const classes = [
    'inline-flex items-center shrink-0 select-none pointer-events-none',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} aria-label={title}>
      <Image
        src="/logo/logo-light.svg"
        alt={title}
        width={height * 4}
        height={height}
        className="block dark:hidden align-middle w-auto h-auto"
        style={style}
        priority
      />
      <Image
        src="/logo/logo-dark.svg"
        alt={title}
        width={height * 4}
        height={height}
        className="hidden dark:block align-middle w-auto h-auto"
        style={style}
        priority
      />
    </span>
  );
}
