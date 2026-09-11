import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export default function SurveillanceBackground() {
  const { t } = useLanguage()
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-sky-50 to-white" />
  )
}
