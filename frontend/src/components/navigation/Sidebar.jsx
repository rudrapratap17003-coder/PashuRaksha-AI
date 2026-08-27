import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  PawPrint, 
  FilePlus2, 
  Syringe, 
  Stethoscope, 
  AlertTriangle, 
  Radio, 
  BarChart3, 
  Map, 
  Bell, 
  Settings,
  ShieldAlert
} from 'lucide-react'
import { USER_ROLES } from '../../utils/constants'

export default function Sidebar({ role = USER_ROLES.FARMER, isOpen, onClose }) {
  const getNavLinks = () => {
    switch (role) {
      case USER_ROLES.FARMER:
        return [
          { to: '/farmer/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
          { to: '/farmer/animals', label: 'My Livestock', icon: PawPrint },
          { to: '/farmer/report', label: 'Report Symptoms', icon: FilePlus2 },
          { to: '/farmer/vaccinations', label: 'Vaccinations', icon: Syringe },
          { to: '/farmer/alerts', label: 'Nearby Alerts', icon: Bell },
        ]
      case USER_ROLES.VETERINARIAN:
        return [
          { to: '/vet/dashboard', label: 'Clinical Triage', icon: LayoutDashboard },
          { to: '/vet/cases', label: 'Priority Cases', icon: Stethoscope },
          { to: '/vet/clusters', label: 'Cluster Alerts', icon: Radio },
          { to: '/vet/map', label: 'Surveillance Map', icon: Map },
          { to: '/vet/history', label: 'Investigated Logs', icon: BarChart3 },
        ]
      case USER_ROLES.AUTHORITY:
        return [
          { to: '/authority/dashboard', label: 'District Overview', icon: LayoutDashboard },
          { to: '/authority/surveillance', label: 'Disease Clusters', icon: Radio },
          { to: '/authority/heatmap', label: 'Outbreak Heatmap', icon: Map },
          { to: '/authority/trends', label: 'Epidemic Trends', icon: BarChart3 },
          { to: '/authority/alerts', label: 'Broadcast Alerts', icon: Bell },
        ]
      default:
        return [
          { to: '/farmer/dashboard', label: 'Farmer Portal', icon: PawPrint },
          { to: '/vet/dashboard', label: 'Vet Desk', icon: Stethoscope },
          { to: '/authority/dashboard', label: 'Authority Portal', icon: BarChart3 },
        ]
    }
  }

  const links = getNavLinks()

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Header on mobile */}
          <div className="md:hidden flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </span>
          </div>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom Disclaimer Pill */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-slate-700">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Decision Support</span>
            </div>
            <p className="leading-snug">
              Surveillance intelligence for proactive early response.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
