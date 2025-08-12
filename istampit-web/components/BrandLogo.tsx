import Image from "next/image";
import React from "react";
import clsx from "clsx";

type Props = {
  className?: string;
  title?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

/**
 * Theme-aware logo that swaps SVGs based on dark mode.
 * Requires `.dark` class on <html> or `prefers-color-scheme: dark`.
 * SVGs contain a subtle "SinAI Inc" watermark embedded.
 *
 * Size is strictly controlled to prevent SVG from expanding to intrinsic dimensions.
 */
export default function BrandLogo({
  className,
  title = "iStampit.io",
  priority = true,
  width = 128,
  height = 32
}: Props) {
  return (
    <span
      className={clsx("inline-block align-middle max-w-full", className)}
      aria-label={title}
      style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }}
    >
      <Image
        src="/logo/logo-light.svg"
        alt={title}
        width={width}
        height={height}
        priority={priority}
        className="block dark:hidden max-w-full max-h-full"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
      <Image
        src="/logo/logo-dark.svg"
        alt={title}
        width={width}
        height={height}
        priority={priority}
        className="hidden dark:block max-w-full max-h-full"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
    </span>
  );
}
