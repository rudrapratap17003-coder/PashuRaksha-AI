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
  Microscope,
  Users,
  Shield,
  Sliders,
  ShieldAlert,
  Calendar,
  Activity,
  Layers,
  BookOpen,
  Wheat,
  Dna,
  Truck,
  Building2
} from 'lucide-react'
import { USER_ROLES } from '../../utils/constants'

export default function Sidebar({ role = USER_ROLES.FARMER, isOpen, onClose }) {
  const getNavLinks = () => {
    switch (role) {
      case USER_ROLES.FARMER:
        return [
          { to: '/farmer/dashboard', label: 'My Shed Dashboard', icon: LayoutDashboard },
          { to: '/farmer/animals', label: 'Digital Livestock Tags', icon: PawPrint },
          { to: '/farmer/herd', label: 'Herd Management', icon: Layers },
          { to: '/farmer/breeds', label: 'Indigenous Breeds', icon: Dna },
          { to: '/farmer/nutrition', label: 'AI Feed & Nutrition', icon: Wheat },
          { to: '/farmer/knowledge', label: 'Disease Biosecurity Guide', icon: BookOpen },
          { to: '/farmer/report', label: 'Report Symptoms', icon: FilePlus2 },
          { to: '/farmer/vaccinations', label: 'Vaccination History', icon: Syringe },
          { to: '/farmer/alerts', label: 'Village Biosecurity', icon: Bell },
        ]
      case USER_ROLES.FIELD_WORKER:
        return [
          { to: '/field-worker/dashboard', label: 'Field Outreach Hub', icon: Activity },
          { to: '/farmer/report', label: 'On-Behalf Report', icon: FilePlus2 },
          { to: '/analytics', label: 'Village Telemetry', icon: BarChart3 },
          { to: '/farmer/alerts', label: 'Hotspot Advisories', icon: Bell },
        ]
      case USER_ROLES.VETERINARIAN:
        return [
          { to: '/vet/dashboard', label: 'Clinical Triage Queue', icon: Stethoscope },
          { to: '/vet/amr', label: 'AMR & Drug Residues', icon: ShieldAlert },
          { to: '/lab/dashboard', label: 'Lab Sample Referrals', icon: Microscope },
          { to: '/authority/dashboard', label: 'GIS Cluster Hotspots', icon: Radio },
          { to: '/analytics', label: 'Epidemic Trends', icon: BarChart3 },
        ]
      case USER_ROLES.LABORATORY:
        return [
          { to: '/lab/dashboard', label: 'Diagnostic Laboratory', icon: Microscope },
          { to: '/vet/dashboard', label: 'Clinical Case Linkage', icon: Stethoscope },
          { to: '/analytics', label: 'Pathogen Analytics', icon: BarChart3 },
        ]
      case USER_ROLES.AUTHORITY:
        return [
          { to: '/authority/dashboard', label: 'District Command Map', icon: LayoutDashboard },
          { to: '/authority/mvu-fleet', label: '1962 MVU GPS Fleet', icon: Truck },
          { to: '/authority/cold-chain', label: 'Ring Vaccine Logistics', icon: Syringe },
          { to: '/authority/market-biosecurity', label: 'APMC Market Gatekeeper', icon: Building2 },
          { to: '/analytics', label: 'Epidemic Analytics', icon: BarChart3 },
          { to: '/lab/dashboard', label: 'Diagnostic Testing', icon: Microscope },
          { to: '/admin/dashboard', label: 'System Governance', icon: Shield },
        ]
      case USER_ROLES.ADMIN:
        return [
          { to: '/admin/dashboard', label: 'Administration Console', icon: Shield },
          { to: '/authority/dashboard', label: 'State Overview', icon: LayoutDashboard },
          { to: '/analytics', label: 'Epidemiological Stats', icon: BarChart3 },
        ]
      default:
        return [
          { to: '/farmer/dashboard', label: 'Farmer Portal', icon: PawPrint },
          { to: '/vet/dashboard', label: 'Vet Desk', icon: Stethoscope },
          { to: '/lab/dashboard', label: 'Lab Desk', icon: Microscope },
          { to: '/authority/dashboard', label: 'Authority Portal', icon: BarChart3 },
          { to: '/analytics', label: 'Analytics', icon: BarChart3 },
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
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Header on mobile */}
          <div className="md:hidden flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Navigation Menu
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
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom Maharashtra Government Seal / Disclaimer */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/20 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-400">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Govt. of Maharashtra</span>
            </div>
            <p className="leading-snug text-[10px] text-slate-400">
              State Innovation Society Livestock Health Intelligence Grid
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
