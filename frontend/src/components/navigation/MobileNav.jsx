import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PawPrint, PlusCircle, Syringe, Bell } from 'lucide-react'

export default function MobileNav() {
  const items = [
    { to: '/farmer/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/farmer/animals', label: 'Animals', icon: PawPrint },
    { to: '/farmer/report', label: 'Report', icon: PlusCircle, highlight: true },
    { to: '/farmer/vaccinations', label: 'Vaccines', icon: Syringe },
    { to: '/farmer/alerts', label: 'Alerts', icon: Bell },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[10px] font-bold transition ${
                  item.highlight
                    ? 'text-emerald-600'
                    : isActive
                    ? 'text-emerald-600 font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              {item.highlight ? (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center -mt-3 shadow-md shadow-emerald-200">
                  <Icon className="w-5 h-5" />
                </div>
              ) : (
                <Icon className="w-5 h-5 mb-0.5" />
              )}
              <span className={item.highlight ? 'mt-0.5' : ''}>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
