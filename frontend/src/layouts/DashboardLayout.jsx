import React, { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'
import Sidebar from '../components/navigation/Sidebar'
import MobileNav from '../components/navigation/MobileNav'
import AlertBanner from '../components/common/AlertBanner'
import { USER_ROLES } from '../utils/constants'

export default function DashboardLayout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isFarmer = user?.role === USER_ROLES.FARMER

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar
        user={user}
        onLogout={onLogout}
        isSidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar for Desktop / Tablet */}
        <Sidebar
          role={user?.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 space-y-6 ${isFarmer ? 'pb-24 md:pb-8' : 'pb-8'}`}>
          {/* Persistent Non-Diagnostic Principle Disclaimer */}
          <AlertBanner type="disclaimer" />

          {/* Render Active Dashboard Page */}
          <Outlet />
        </main>
      </div>

      {/* Bottom bar for farmers on mobile */}
      {isFarmer && <MobileNav />}
    </div>
  )
}
