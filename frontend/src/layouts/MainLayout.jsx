import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Heart, LogIn, UserPlus, Sparkles, Presentation } from 'lucide-react'
import Button from '../components/common/Button'
import PashuLogo from '../components/common/PashuLogo'
import DemoScenarioBar from '../components/common/DemoScenarioBar'
import EmergencyAlarmBanner from '../components/common/EmergencyAlarmBanner'
import MaharashtraHeader from '../components/common/MaharashtraHeader'
import AIAssistant from '../components/common/AIAssistant'

export default function MainLayout({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Official Government of Maharashtra Header */}
      <MaharashtraHeader />

      {/* Floating Jury Scenario Bar */}
      <DemoScenarioBar />

      {/* Real-time Emergency Audio-Visual Alarm Banner */}
      <EmergencyAlarmBanner />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <PashuLogo size="md" />
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                PASHURAKSHA <span className="text-sky-600">AI</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-500">
                Government of Maharashtra • SIH26128
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <Link to="/presentation" className="hidden sm:flex">
              <Button size="sm" icon={Sparkles} className="font-bold bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100">
                Jury Console
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/farmer/dashboard">
                  <Button size="sm" className="font-bold bg-sky-600 hover:bg-sky-500 text-white">
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={onLogout}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" icon={LogIn} className="font-bold bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:inline">
                  <Button size="sm" icon={UserPlus} className="font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Dynamic View */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Modern Clean Light Footer */}
      <footer className="bg-white border-t border-sky-100 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-900">PASHURAKSHA AI</span> • Maharashtra Livestock Early-Warning Network
            <p className="text-[11px] text-slate-400 mt-0.5">
              Developed under Department of Animal Husbandry &amp; Maharashtra State Innovation Society (MSInS)
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-bold text-sky-700">
            <Link to="/presentation" className="hover:underline">SIH Jury Stage</Link>
            <Link to="/farmer/dashboard" className="hover:underline">Farmer Shed</Link>
            <Link to="/vet/dashboard" className="hover:underline">Vet Clinic</Link>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Copilot */}
      <AIAssistant />
    </div>
  )
}
