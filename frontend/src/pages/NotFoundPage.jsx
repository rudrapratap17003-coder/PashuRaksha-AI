import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Home } from 'lucide-react'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="text-center max-w-md space-y-4 p-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Page Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested route does not exist or is scheduled for a future development phase.
        </p>
        <Link to="/">
          <Button icon={Home} className="font-bold">
            Back to Home
          </Button>
        </Link>
      </Card>
    </div>
  )
}
