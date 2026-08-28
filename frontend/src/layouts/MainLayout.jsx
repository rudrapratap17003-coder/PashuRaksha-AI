import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Activity, ShieldCheck, Heart, LogIn, UserPlus, Sparkles, Presentation } from 'lucide-react'
import Button from '../components/common/Button'
import DemoScenarioBar from '../components/common/DemoScenarioBar'

export default function MainLayout({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#061B17] text-white flex flex-col font-sans">
      {/* Floating Jury Scenario Bar */}
      <DemoScenarioBar />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#061B17]/90 backdrop-blur-md border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white leading-none">
                PASHURAKSHA <span className="text-emerald-400">AI</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400">
                SIH 2026 • PS ID: SIH26128
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <Link to="/presentation" className="hidden sm:flex">
              <Button size="sm" icon={Sparkles} className="font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900">
                Jury Mode
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to={`/${user.role}/dashboard`}>
                  <Button size="sm" className="font-bold bg-emerald-500 text-slate-950">
                    Go to Portal ({user.role.toUpperCase()})
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={onLogout} className="border-slate-700 text-slate-300">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" icon={LogIn} className="font-bold border-emerald-500/40 text-emerald-300 hover:bg-emerald-950">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" icon={UserPlus} className="font-bold bg-emerald-500 text-slate-950">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#051512] border-t border-emerald-500/20 py-8 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center space-x-2 font-semibold text-slate-300">
          <span>PASHURAKSHA AI (पशुरक्षा AI)</span>
          <span>•</span>
          <span>Smart India Hackathon 2026</span>
          <span>•</span>
          <span>Problem Statement #128</span>
        </div>
        <p className="max-w-2xl mx-auto text-[11px] text-slate-400 italic px-4">
          Non-Diagnostic Notice: PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning decision support. It does not replace professional veterinary diagnosis or treatment.
        </p>
      </footer>
    </div>
  )
}
