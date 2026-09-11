import React from 'react'
import { ShieldAlert, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[PashuRaksha ErrorBoundary caught an error]:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      // If used as an inline copilot widget boundary
      if (this.props.variant === 'floating') {
        return (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-rose-500/30 rounded-2xl p-4 shadow-xl flex items-center space-x-3 w-[300px]">
            <ShieldAlert className="w-8 h-8 text-rose-500 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-bold text-white mb-1">Copilot is temporarily unavailable.</p>
              <p className="text-xs text-slate-400">Please refresh the page or try again later.</p>
            </div>
          </div>
        )
      }

      // Default full/section module boundary fallback
      const title = this.props.title || 'Veterinarian dashboard encountered an unexpected error.'
      const subtitle = this.props.subtitle || 'A client-side rendering issue occurred. Your data and session are safe.'

      return (
        <div className="min-h-[360px] w-full flex items-center justify-center p-6 bg-slate-900/80 rounded-3xl border border-rose-500/20 my-4 shadow-xl">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">{title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{subtitle}</p>
            </div>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center space-x-2 transition shadow-lg shadow-sky-900/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
