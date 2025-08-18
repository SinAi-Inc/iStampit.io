"use client";
import React, { useState } from 'react';

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
  showCopy?: boolean;
}

export default function CodeBlock({
  children,
  language = '',
  className = '',
  showCopy = true
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative group">
      <pre className={`
        bg-gray-100 dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        border border-gray-200 dark:border-gray-700
        p-4 rounded-xl
        text-sm overflow-x-auto
        font-mono leading-6
        ${className}
      `}>
        <code>{children}</code>
      </pre>

      {showCopy && (
        <button
          onClick={handleCopy}
          className={`
            absolute top-3 right-3
            px-2 py-1 text-xs font-medium
            rounded-md transition-all duration-200
            ${copied
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }
            opacity-0 group-hover:opacity-100
            focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? '✓' : '📋'}
        </button>
      )}
    </div>
  );
}
