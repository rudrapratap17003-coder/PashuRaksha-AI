import React from 'react'
import { RefreshCw, AlertTriangle, Inbox, ArrowRight } from 'lucide-react'
import Button from './Button'

export function LoadingState({ message = 'Loading live surveillance data...' }) {
  return (
    <div className="py-12 px-4 text-center space-y-3 animate-in fade-in" role="status">
      <div className="w-10 h-10 rounded-full border-2 border-sky-500/20 border-t-sky-500 animate-spin mx-auto" />
      <p className="text-xs font-bold text-slate-500">{message}</p>
    </div>
  )
}

export function ErrorState({ error = 'Unable to connect to service.', onRetry = null }) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3 animate-in fade-in" role="alert">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-xs font-black block">Failed to Load Live Records</strong>
          <p className="text-xs text-rose-700">{error}</p>
        </div>
      </div>
      {onRetry && (
        <div className="flex justify-end pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            icon={RefreshCw}
            className="bg-white border-rose-300 text-rose-700 hover:bg-rose-100 text-xs font-bold"
          >
            Retry Request
          </Button>
        </div>
      )}
    </div>
  )
}

export function EmptyState({ 
  title = 'No Records Found', 
  message = 'There are no active records in this view currently.', 
  actionText = null, 
  onAction = null,
  icon: Icon = Inbox 
}) {
  return (
    <div className="py-12 px-4 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 animate-in fade-in">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{message}</p>
      </div>
      {actionText && onAction && (
        <div className="pt-2">
          <Button
            size="sm"
            variant="primary"
            onClick={onAction}
            icon={ArrowRight}
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
          >
            {actionText}
          </Button>
        </div>
      )}
    </div>
  )
}
