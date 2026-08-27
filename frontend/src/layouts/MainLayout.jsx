import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'

export default function MainLayout({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PASHURAKSHA AI • Smart India Hackathon Prototype (SIH26128)</p>
          <div className="flex items-center space-x-4">
            <span>Theme: Agriculture &amp; FoodTech</span>
            <span>•</span>
            <span>Decision-Support System</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
