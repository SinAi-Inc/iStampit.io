'use client'

import React, { useState, useRef, useEffect } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ content, children, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-l-4 border-r-4 border-t-4 border-t-gray-900 dark:border-t-gray-100',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-l-4 border-r-4 border-b-4 border-b-gray-900 dark:border-b-gray-100',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-t-4 border-b-4 border-l-4 border-l-gray-900 dark:border-l-gray-100',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-t-4 border-b-4 border-r-4 border-r-gray-900 dark:border-r-gray-100'
  }

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg shadow-lg animate-fade-in ${positionClasses[position]}`}
          style={{ minWidth: '200px', maxWidth: '300px' }}
        >
          {content}
          <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  )
}

interface HelpButtonProps {
  title: string
  description: string
  steps?: string[]
  className?: string
}

export function HelpButton({ title, description, steps, className = '' }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors duration-200 flex items-center justify-center text-sm font-medium"
        aria-label="Help"
      >
        ?
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-medium border border-gray-200 dark:border-gray-700 p-4 z-50 animate-slide-up">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
            {description}
          </p>

          {steps && steps.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">Steps:</h4>
              <ol className="space-y-1">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs flex items-center justify-center font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface GuideCardProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  className?: string
}

export function GuideCard({ icon, title, description, action, className = '' }: GuideCardProps) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
            {description}
          </p>
          {action && (
            <a
              href={action.href}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium inline-flex items-center"
            >
              {action.label}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

interface OnboardingFlowProps {
  steps: Array<{
    title: string
    description: string
    component?: React.ReactNode
  }>
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: () => void
}

export function OnboardingFlow({ steps, currentStep, onStepChange, onComplete }: OnboardingFlowProps) {
  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-medium border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {currentStepData.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {currentStepData.description}
        </p>

        {currentStepData.component && (
          <div className="mb-6">
            {currentStepData.component}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => currentStep > 0 && onStepChange(currentStep - 1)}
            disabled={currentStep === 0}
            className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {isLastStep ? (
            <button onClick={onComplete} className="btn-primary">
              Complete Setup
            </button>
          ) : (
            <button onClick={() => onStepChange(currentStep + 1)} className="btn-primary">
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Quick Help Floating Button
export function QuickHelpButton() {
  const [isOpen, setIsOpen] = useState(false)

  const helpTopics = [
    {
      icon: '🔍',
      title: 'How to Verify',
      description: 'Learn how to verify timestamp proofs',
      href: '/docs/verify'
    },
    {
      icon: '📋',
      title: 'Innovation Ledger',
      description: 'Browse public timestamp records',
      href: '/ledger'
    },
    {
      icon: '🛠️',
      title: 'API Documentation',
      description: 'Integrate with your applications',
      href: '/docs/api'
    },
    {
      icon: '🔐',
      title: 'Security & Privacy',
      description: 'Understanding our security model',
      href: '/docs/security'
    }
  ]

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen && (
        <div className="mb-4 bg-white dark:bg-gray-800 rounded-2xl shadow-strong border border-gray-200 dark:border-gray-700 p-4 w-80 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Help</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            {helpTopics.map((topic, index) => (
              <a
                key={index}
                href={topic.href}
                className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <span className="text-lg mr-3">{topic.icon}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {topic.title}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {topic.description}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-medium hover:shadow-strong transition-all duration-200 flex items-center justify-center text-lg font-medium"
        aria-label="Quick help"
      >
        {isOpen ? '✕' : '?'}
      </button>
    </div>
  )
}
