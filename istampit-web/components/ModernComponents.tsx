'use client'

import React from 'react'
import { QuickHelpButton } from './HelpSystem'

interface DashboardCardProps {
  title: string
  description: string
  icon?: string
  value?: string | number
  change?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
  }>
  className?: string
}

export function DashboardCard({
  title,
  description,
  icon,
  value,
  change,
  actions = [],
  className = ''
}: DashboardCardProps) {
  const changeColorClasses = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className={`card p-6 hover:shadow-medium transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-2xl">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </div>

      {value && (
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </div>
          {change && (
            <div className={`text-sm font-medium ${changeColorClasses[change.type]}`}>
              {change.type === 'increase' && '↗ '}
              {change.type === 'decrease' && '↘ '}
              {change.value}
            </div>
          )}
        </div>
      )}

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={
                action.variant === 'primary' ? 'btn-primary btn-sm' :
                action.variant === 'secondary' ? 'btn-secondary btn-sm' :
                'btn-ghost btn-sm'
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface StatsGridProps {
  stats: Array<{
    label: string
    value: string | number
    change?: {
      value: string
      type: 'increase' | 'decrease' | 'neutral'
    }
    icon?: string
  }>
  className?: string
}

export function StatsGrid({ stats, className = '' }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <DashboardCard
          key={index}
          title={stat.label}
          description=""
          icon={stat.icon}
          value={stat.value}
          change={stat.change}
        />
      ))}
    </div>
  )
}

interface FeatureShowcaseProps {
  features: Array<{
    title: string
    description: string
    icon: string
    status: 'active' | 'coming-soon' | 'beta'
    action?: {
      label: string
      href: string
    }
  }>
  className?: string
}

export function FeatureShowcase({ features, className = '' }: FeatureShowcaseProps) {
  const statusClasses = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    'coming-soon': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    beta: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {features.map((feature, index) => (
        <div key={index} className="card p-6 group hover:shadow-medium transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
              {feature.icon}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[feature.status]}`}>
              {feature.status === 'coming-soon' ? 'Coming Soon' : feature.status === 'beta' ? 'Beta' : 'Active'}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
            {feature.description}
          </p>

          {feature.action && (
            <a
              href={feature.action.href}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium inline-flex items-center"
            >
              {feature.action.label}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

// Modern loading states
export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-6 animate-pulse ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
  )
}

export function LoadingGrid({ count = 4, className = '' }: { count?: number, className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}

// Demo showcase component
export function ModernDesignShowcase() {
  const sampleStats = [
    {
      label: 'Total Timestamps',
      value: '12,458',
      change: { value: '+12.5%', type: 'increase' as const },
      icon: '📋'
    },
    {
      label: 'Verified Today',
      value: '342',
      change: { value: '+5.2%', type: 'increase' as const },
      icon: '✅'
    },
    {
      label: 'Storage Used',
      value: '2.4 GB',
      change: { value: 'Stable', type: 'neutral' as const },
      icon: '💾'
    },
    {
      label: 'Success Rate',
      value: '99.9%',
      change: { value: '+0.1%', type: 'increase' as const },
      icon: '🎯'
    }
  ]

  const sampleFeatures = [
    {
      title: 'Instant Verification',
      description: 'Verify timestamp proofs in real-time with cryptographic accuracy',
      icon: '⚡',
      status: 'active' as const,
      action: { label: 'Try Now', href: '/verify' }
    },
    {
      title: 'API Integration',
      description: 'Seamlessly integrate with your applications using our REST API',
      icon: '🔌',
      status: 'active' as const,
      action: { label: 'View Docs', href: '/docs/api' }
    },
    {
      title: 'Batch Processing',
      description: 'Process multiple files simultaneously for enterprise workflows',
      icon: '📦',
      status: 'beta' as const,
      action: { label: 'Learn More', href: '/docs/batch' }
    },
    {
      title: 'Advanced Analytics',
      description: 'Detailed insights and reporting for your timestamp activities',
      icon: '📊',
      status: 'coming-soon' as const
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Platform Statistics</h2>
        <StatsGrid stats={sampleStats} />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Platform Features</h2>
        <FeatureShowcase features={sampleFeatures} />
      </div>

      <QuickHelpButton />
    </div>
  )
}

export default DashboardCard
