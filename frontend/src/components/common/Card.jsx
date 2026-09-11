import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'p-5',
  ...props
}) {
  const { t } = useLanguage()
  const hasBg = className.includes('bg-')
  const hasBorderClass = className.includes('border-')
  const hasShadow = className.includes('shadow-')
  const hasRounded = className.includes('rounded-')

  const baseClasses = `
    ${hasBg ? '' : 'bg-white'} 
    ${hasRounded ? '' : 'rounded-2xl'} 
    ${hasBorderClass ? 'border' : 'border border-slate-200'} 
    ${hasShadow ? '' : 'shadow-sm'} 
    ${hover ? 'card-hover' : ''} 
    ${padding} 
    ${className}
  `.replace(/\s+/g, ' ').trim()

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  )
}
