import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PawPrint, FilePlus2, Syringe, Stethoscope, AlertTriangle, Radio, BarChart3, Map, Bell, FlaskConical, Users, Shield, Sliders, ShieldAlert, Calendar, HeartPulse, Layers, BookOpen, Wheat, Dna, Truck, Building2 } from 'lucide-react'
import { USER_ROLES } from '../../utils/constants'

export default function Sidebar({ role = USER_ROLES.FARMER, isOpen, onClose }) {
  const { t } = useLanguage()
  const getNavLinks = () => {
    switch (role) {
      case USER_ROLES.FARMER:
        return [
          { to: '/farmer/dashboard', label: t('nav.' + 'My Shed Dashboard'.replace(' ', '').replace('&', '').replace('1962', '')) || 'My Shed Dashboard', icon: LayoutDashboard },
          { to: '/farmer/animals', label: t('nav.' + 'Digital Livestock Tags'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Digital Livestock Tags', icon: PawPrint },
          { to: '/farmer/herd', label: t('nav.' + 'Herd Management'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Herd Management', icon: Layers },
          { to: '/farmer/breeds', label: t('nav.' + 'Indigenous Breeds'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Indigenous Breeds', icon: Dna },
          { to: '/farmer/nutrition', label: t('nav.' + 'AI Feed & Nutrition'.replace(' ', '').replace('&', '').replace('1962', '')) || 'AI Feed & Nutrition', icon: Wheat },
          { to: '/farmer/knowledge', label: t('nav.' + 'Disease Biosecurity Guide'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Disease Biosecurity Guide', icon: BookOpen },
          { to: '/farmer/report', label: t('nav.' + 'Report Symptoms'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Report Symptoms', icon: FilePlus2 },
          { to: '/farmer/vaccinations', label: t('nav.' + 'Vaccination History'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Vaccination History', icon: Syringe },
          { to: '/farmer/alerts', label: t('nav.' + 'Village Biosecurity'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Village Biosecurity', icon: Bell },
        ]
      case USER_ROLES.FIELD_WORKER:
        return [
          { to: '/field-worker/dashboard', label: t('nav.' + 'Field Outreach Hub'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Field Outreach Hub', icon: HeartPulse },
          { to: '/farmer/report', label: t('nav.' + 'On-Behalf Report'.replace(' ', '').replace('&', '').replace('1962', '')) || 'On-Behalf Report', icon: FilePlus2 },
          { to: '/analytics', label: t('nav.' + 'Village Telemetry'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Village Telemetry', icon: BarChart3 },
          { to: '/farmer/alerts', label: t('nav.' + 'Hotspot Advisories'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Hotspot Advisories', icon: Bell },
        ]
      case USER_ROLES.VETERINARIAN:
        return [
          { to: '/vet/dashboard', label: t('nav.' + 'Clinical Triage Queue'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Clinical Triage Queue', icon: Stethoscope },
          { to: '/vet/amr', label: t('nav.' + 'AMR & Drug Residues'.replace(' ', '').replace('&', '').replace('1962', '')) || 'AMR & Drug Residues', icon: ShieldAlert },
          { to: '/lab/dashboard', label: t('nav.' + 'Lab Sample Referrals'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Lab Sample Referrals', icon: FlaskConical },
          { to: '/authority/dashboard', label: t('nav.' + 'GIS Cluster Hotspots'.replace(' ', '').replace('&', '').replace('1962', '')) || 'GIS Cluster Hotspots', icon: Radio },
          { to: '/analytics', label: t('nav.' + 'Epidemic Trends'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Epidemic Trends', icon: BarChart3 },
        ]
      case USER_ROLES.LABORATORY:
        return [
          { to: '/lab/dashboard', label: t('nav.' + 'Diagnostic Laboratory'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Diagnostic Laboratory', icon: FlaskConical },
          { to: '/vet/dashboard', label: t('nav.' + 'Clinical Case Linkage'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Clinical Case Linkage', icon: Stethoscope },
          { to: '/analytics', label: t('nav.' + 'Pathogen Analytics'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Pathogen Analytics', icon: BarChart3 },
        ]
      case USER_ROLES.AUTHORITY:
        return [
          { to: '/authority/dashboard', label: t('nav.' + 'District Command Map'.replace(' ', '').replace('&', '').replace('1962', '')) || 'District Command Map', icon: LayoutDashboard },
          { to: '/authority/mvu-fleet', label: t('nav.' + '1962 MVU GPS Fleet'.replace(' ', '').replace('&', '').replace('1962', '')) || '1962 MVU GPS Fleet', icon: Truck },
          { to: '/authority/cold-chain', label: t('nav.' + 'Ring Vaccine Logistics'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Ring Vaccine Logistics', icon: Syringe },
          { to: '/authority/market-biosecurity', label: t('nav.' + 'APMC Market Gatekeeper'.replace(' ', '').replace('&', '').replace('1962', '')) || 'APMC Market Gatekeeper', icon: Building2 },
          { to: '/analytics', label: t('nav.' + 'Epidemic Analytics'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Epidemic Analytics', icon: BarChart3 },
          { to: '/lab/dashboard', label: t('nav.' + 'Diagnostic Testing'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Diagnostic Testing', icon: FlaskConical },
          { to: '/admin/dashboard', label: t('nav.' + 'System Governance'.replace(' ', '').replace('&', '').replace('1962', '')) || 'System Governance', icon: Shield },
        ]
      case USER_ROLES.ADMIN:
        return [
          { to: '/admin/dashboard', label: t('nav.' + 'Administration Console'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Administration Console', icon: Shield },
          { to: '/authority/dashboard', label: t('nav.' + 'State Overview'.replace(' ', '').replace('&', '').replace('1962', '')) || 'State Overview', icon: LayoutDashboard },
          { to: '/analytics', label: t('nav.' + 'Epidemiological Stats'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Epidemiological Stats', icon: BarChart3 },
        ]
      default:
        return [
          { to: '/farmer/dashboard', label: t('nav.' + 'Farmer Portal'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Farmer Portal', icon: PawPrint },
          { to: '/vet/dashboard', label: t('nav.' + 'Vet Desk'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Vet Desk', icon: Stethoscope },
          { to: '/lab/dashboard', label: t('nav.' + 'Lab Desk'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Lab Desk', icon: FlaskConical },
          { to: '/authority/dashboard', label: t('nav.' + 'Authority Portal'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Authority Portal', icon: BarChart3 },
          { to: '/analytics', label: t('nav.' + 'Analytics'.replace(' ', '').replace('&', '').replace('1962', '')) || 'Analytics', icon: BarChart3 },
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
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
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
