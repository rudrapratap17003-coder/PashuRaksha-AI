import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Copilot ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-rose-500/30 rounded-2xl p-4 shadow-xl flex items-center space-x-3 w-[300px]">
          <ShieldAlert className="w-8 h-8 text-rose-500 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-bold text-white mb-1">Copilot is temporarily unavailable.</p>
            <p className="text-xs text-slate-400">Please refresh the page or try again later.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
