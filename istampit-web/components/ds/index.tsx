/**
 * iStampit.io Enterprise Component Library
 * Type-safe, accessible components built on the design system
 * Version: 2.0.0
 */

import React, { forwardRef, ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

// === UTILITY TYPES ===
type ComponentSize = 'sm' | 'md' | 'lg';
type ComponentVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type StatusType = 'success' | 'warning' | 'error' | 'info';

// === BUTTON COMPONENT ===
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ComponentVariant;
  size?: ComponentSize;
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    children,
    className,
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = 'ds-btn ds-focus-ring ds-transition';
    const variantClasses = {
      primary: 'ds-btn--primary',
      secondary: 'ds-btn--secondary',
      ghost: 'ds-btn--ghost',
      outline: 'ds-btn--secondary' // Using secondary styling for outline
    };
    const sizeClasses = {
      sm: 'ds-btn--sm',
      md: '',
      lg: 'ds-btn--lg'
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          isLoading ? 'opacity-50 cursor-not-allowed' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin">⏳</span>
        ) : leftIcon && (
          <span className="ds-btn__icon">{leftIcon}</span>
        )}
        {children}
        {rightIcon && !isLoading && (
          <span className="ds-btn__icon">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// === INPUT COMPONENT ===
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helpText,
    className,
    leftIcon,
    rightIcon,
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="ds-input-group">
        {label && (
          <label
            htmlFor={inputId}
            className="ds-body--small font-medium text-gray-700 dark:text-gray-300 mb-2 block"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'ds-input ds-focus-ring',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              error ? 'ds-input--error' : '',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="ds-body--small text-red-600 dark:text-red-400 mt-1">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="ds-body--small text-gray-500 dark:text-gray-400 mt-1">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// === CARD COMPONENT ===
interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'hoverable';
  padding?: ComponentSize;
}

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md'
}: CardProps) {
  const baseClasses = 'ds-card';
  const variantClasses = {
    default: '',
    elevated: 'ds-card--elevated',
    hoverable: 'ds-card--hoverable'
  };
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}

// === BADGE COMPONENT ===
interface BadgeProps {
  children: ReactNode;
  variant: StatusType;
  size?: ComponentSize;
  className?: string;
  icon?: ReactNode;
}

export function Badge({
  children,
  variant,
  size = 'md',
  className,
  icon
}: BadgeProps) {
  const baseClasses = 'ds-badge';
  const variantClasses = {
    success: 'ds-badge--success',
    warning: 'ds-badge--warning',
    error: 'ds-badge--error',
    info: 'ds-badge--info'
  };
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  return (
    <span className={cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {icon && <span className="ds-badge__icon">{icon}</span>}
      {children}
    </span>
  );
}

// === STATUS COMPONENT ===
interface StatusProps {
  variant: StatusType;
  title: string;
  description?: string;
  className?: string;
  icon?: ReactNode;
}

export function Status({
  variant,
  title,
  description,
  className,
  icon
}: StatusProps) {
  const baseClasses = 'ds-status';
  const variantClasses = {
    success: 'ds-status--success',
    warning: 'ds-status--warning',
    error: 'ds-status--error',
    info: 'ds-status--info'
  };

  const defaultIcons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      <span className="text-lg">{icon || defaultIcons[variant]}</span>
      <div>
        <div className="font-medium">{title}</div>
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
    </div>
  );
}

// === CODE BLOCK COMPONENT ===
interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
  showCopy?: boolean;
  inline?: boolean;
}

export function CodeBlock({
  children,
  language = '',
  className,
  showCopy = true,
  inline = false
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (inline) {
    return (
      <code className={cn('ds-code ds-code--inline', className)}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group">
      <pre className={cn('ds-code', className)}>
        <code>{children}</code>
      </pre>
      {showCopy && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className={cn(
            'absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity',
            copied ? 'opacity-100' : ''
          )}
        >
          {copied ? '✓' : '📋'}
        </Button>
      )}
    </div>
  );
}

// === NAVIGATION LINK COMPONENT ===
interface NavLinkProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function NavLink({
  href,
  children,
  isActive = false,
  className,
  icon
}: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'ds-nav-link ds-focus-ring',
        isActive ? 'ds-nav-link--active' : '',
        className
      )}
    >
      {icon && <span className="ds-nav-link__icon">{icon}</span>}
      {children}
    </a>
  );
}

// === TYPOGRAPHY COMPONENTS ===
interface HeadingProps {
  children: ReactNode;
  level: 1 | 2 | 3 | 4;
  className?: string;
  as?: React.ElementType;
}

export function Heading({ children, level, className, as }: HeadingProps) {
  const Component = as || (`h${level}` as React.ElementType);
  const levelClasses = {
    1: 'ds-heading-1',
    2: 'ds-heading-2',
    3: 'ds-heading-3',
    4: 'ds-heading-4'
  };

  return React.createElement(
    Component,
    { className: cn(levelClasses[level], className) },
    children
  );
}

interface TextProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'base' | 'lg';
  className?: string;
  as?: React.ElementType;
}

export function Text({
  children,
  variant = 'primary',
  size = 'base',
  className,
  as = 'p'
}: TextProps) {
  const baseClasses = 'ds-body';
  const variantClasses = {
    primary: '',
    secondary: 'ds-body--secondary'
  };
  const sizeClasses = {
    sm: 'ds-body--small',
    base: '',
    lg: 'text-lg'
  };

  return React.createElement(
    as,
    {
      className: cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )
    },
    children
  );
}

// === LAYOUT COMPONENTS ===
interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl'
  };

  return (
    <div className={cn('ds-container', sizeClasses[size], className)}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: ComponentSize;
}

export function Section({ children, className, spacing = 'lg' }: SectionProps) {
  const spacingClasses = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20'
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}

interface GridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  gap?: ComponentSize;
}

export function Grid({ children, columns = 1, className, gap = 'md' }: GridProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'ds-grid--2',
    3: 'ds-grid--3',
    4: 'ds-grid--4'
  };
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  return (
    <div className={cn(
      'ds-grid',
      columnClasses[columns],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

// === SURFACE COMPONENT ===
interface SurfaceProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'elevated';
  className?: string;
  padding?: ComponentSize;
}

export function Surface({
  children,
  variant = 'primary',
  className,
  padding = 'md'
}: SurfaceProps) {
  const baseClasses = 'ds-surface';
  const variantClasses = {
    primary: '',
    secondary: 'ds-surface--secondary',
    elevated: 'ds-surface--elevated'
  };
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}

// === LOADING COMPONENTS ===
export function LoadingSpinner({ size = 'md' }: { size?: ComponentSize }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('animate-spin text-current', sizeClasses[size])}>
      ⏳
    </div>
  );
}

export function LoadingSkeleton({
  lines = 3,
  className
}: {
  lines?: number;
  className?: string
}) {
  return (
    <div className={cn('animate-pulse space-y-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

// === GLASS MORPHISM COMPONENT ===
interface GlassProps {
  children: ReactNode;
  className?: string;
}

export function Glass({ children, className }: GlassProps) {
  return (
    <div className={cn('ds-glass', className)}>
      {children}
    </div>
  );
}
