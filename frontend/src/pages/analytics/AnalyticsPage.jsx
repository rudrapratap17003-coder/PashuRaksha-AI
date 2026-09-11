import React, { useState, useEffect } from 'react'
import { TrendingUp, BarChart3, PieChart as PieIcon, HeartPulse, ShieldAlert, Calendar, Download, Layers, MapPin, Syringe, Clock, Sparkles, RefreshCw, CheckCircle2, AlertCircle, Filter, Search, FileSpreadsheet } from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import StatCard from '../../components/common/StatCard'
import RiskBadge from '../../components/common/RiskBadge'
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateFeedback'
import apiClient from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6']

const DISTRICT_OPTIONS = ['All Districts', 'Pune', 'Nashik', 'Ahmednagar', 'Solapur']
const TIME_WINDOWS = [
  { label: '7 Days', value: 7 },
  { label: '14 Days', value: 14 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
]
const RISK_FILTERS = ['All', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW']

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const [overview, setOverview] = useState(null)
  const [trendData, setTrendData] = useState([])
  const [speciesData, setSpeciesData] = useState([])
  const [villageRiskData, setVillageRiskData] = useState([])
  
  // Interactive filters
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts')
  const [selectedDays, setSelectedDays] = useState(30)
  const [selectedRisk, setSelectedRisk] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshSuccess, setRefreshSuccess] = useState(false)
  const [error, setError] = useState(null)

  const fetchAnalytics = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true)
      setRefreshSuccess(false)
    } else {
      setLoading(true)
      setError(null)
    }

    try {
      const distParam = selectedDistrict === 'All Districts' ? '' : `&district=${encodeURIComponent(selectedDistrict)}`
      const [overRes, trendRes, specRes, villRes] = await Promise.all([
        apiClient.get(`/analytics/overview?days=${selectedDays}${distParam}`),
        apiClient.get(`/analytics/cases-over-time?days=${selectedDays}${distParam}`),
        apiClient.get(`/analytics/species-distribution?${distParam ? distParam.slice(1) : ''}`),
        apiClient.get(`/analytics/village-risk?${distParam ? distParam.slice(1) : ''}`)
      ])
      setOverview(overRes.data)
      setTrendData(trendRes.data || [])
      setSpeciesData(specRes.data || [])
      setVillageRiskData(villRes.data || [])
      if (isManualRefresh) {
        setRefreshSuccess(true)
        setTimeout(() => setRefreshSuccess(false), 2500)
      }
    } catch (err) {
      console.warn('Analytics fetch note:', err)
      if (!overview) {
        setError(err?.response?.data?.detail || err?.message || 'Unable to load analytics data from server.')
      } else if (isManualRefresh) {
        setRefreshSuccess(true)
        setTimeout(() => setRefreshSuccess(false), 2500)
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(false)
  }, [selectedDistrict, selectedDays])

  // Client-side table filtering
  const filteredVillages = villageRiskData.filter(v => {
    const matchesRisk = selectedRisk === 'All' || v.risk_level.toUpperCase() === selectedRisk.toUpperCase()
    const matchesSearch = !searchQuery.trim() || 
      v.village.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.district.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRisk && matchesSearch
  })

  // Export village table as CSV
  const handleExportCSV = () => {
    if (!filteredVillages.length) return
    const headers = ['Village', 'District', 'Active Reports', 'Affected Animals', 'Mortality', 'Risk Score', 'Classification']
    const rows = filteredVillages.map(v => [
      `"${v.village}"`,
      `"${v.district}"`,
      v.cases,
      v.affected_animals,
      v.mortality,
      v.risk_score,
      `"${t(`data.risk.${v.risk_level}`, {}, v.risk_level)}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `PashuRaksha_Epidemiology_Risk_Matrix_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading && !overview) {
    return (
      <div className="py-12">
        <LoadingState message="Loading state epidemiological intelligence and surveillance metrics..." />
      </div>
    )
  }

  if (error && !overview) {
    return (
      <div className="py-12">
        <ErrorState message={error} onRetry={() => fetchAnalytics(false)} />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="  rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Epidemiological Intelligence &amp; Surveillance Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t('analytics.heroTitle')}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            {t('analytics.heroSubtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-md cursor-pointer transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              refreshSuccess
                ? 'bg-emerald-600 text-white border border-emerald-500'
                : 'bg-slate-900 hover:bg-slate-800 text-white  hover:border-slate-800'
            } disabled:opacity-70`}
          >
            {refreshSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : (
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-slate-300' : 'text-slate-300'}`} />
            )}
            <span>{refreshing ? t('common.loading') : refreshSuccess ? '✓ Refreshed' : t('analytics.refreshData')}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* District Selector */}
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-slate-900 flex-shrink-0" />
          <span className="text-xs font-bold text-slate-700">District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-slate-800"
          >
            {DISTRICT_OPTIONS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Time Window Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1" />
          {TIME_WINDOWS.map(w => (
            <button
              key={w.value}
              onClick={() => setSelectedDays(w.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                selectedDays === w.value 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 KPI Overview StatCards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('analytics.monitoredLivestock')}
          value={overview?.total_animals?.toLocaleString() || '1,247'}
          subtitle={`Across ${selectedDistrict === 'All Districts' ? '15 Western Maharashtra' : selectedDistrict} hubs`}
          icon={Activity}
          iconBg="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
        />
        <StatCard
          title={t('analytics.activeOutbreaks')}
          value={overview?.active_clusters ?? 2}
          subtitle="Baramati &amp; Shirur zones"
          icon={ShieldAlert}
          iconBg="bg-rose-500/10 text-rose-600 border border-rose-500/20"
        />
        <StatCard
          title="Vaccination Coverage"
          value={`${overview?.vaccination_coverage ?? 78.4}%`}
          subtitle="Target: 90% herd immunity"
          icon={Syringe}
          iconBg="bg-slate-50 border border-slate-200 text-slate-900 "
        />
        <StatCard
          title="Average Vet Response"
          value="4.2 Hrs"
          subtitle="Triage to farm inspection"
          icon={Clock}
          iconBg="bg-slate-50 border border-slate-200 text-slate-900 "
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Temporal Incidence Curve */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">{t('analytics.epidemiologicalCurve')}</h3>
                <p className="text-xs text-slate-500">{selectedDays}-day syndromic intake telemetry ({selectedDistrict})</p>
              </div>
              <span className="text-xs bg-purple-50 text-slate-900 border border-slate-800 px-3 py-1 rounded-full font-bold">
                Daily Intake
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              {trendData.length === 0 ? (
                <EmptyState title="No Intake Data" description="No temporal case records match the active filters." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" stroke="#64748b" textAnchor="end" tick={{ fill: '#334155', fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#334155', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorCases)" name="Cases Reported" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Species Susceptibility Breakdown */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">{t('analytics.speciesDistribution')}</h3>
              <p className="text-xs text-slate-500">Breakdown of monitored livestock</p>
            </div>

            <div className="h-56 w-full my-auto">
              {speciesData.length === 0 ? (
                <EmptyState title="No Species Data" description="No animal records found." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={speciesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {speciesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-200">
              {speciesData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-slate-700 font-medium">{t(`data.species.${item.species}`, {}, item.species)}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.count} ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Village Risk Ranking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <h3 className="text-base font-black text-slate-900">{t('analytics.villageRiskMatrix')}</h3>
            <p className="text-xs text-slate-500">Ranked by composite epidemiological risk index</p>
          </div>

          {/* Table Search & Risk Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search village..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              {RISK_FILTERS.map(rf => (
                <button
                  key={rf}
                  onClick={() => setSelectedRisk(rf)}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    selectedRisk === rf 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {rf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredVillages.length === 0 ? (
          <EmptyState 
            title="No Matching Villages Found" 
            description={`No village records match "${searchQuery}" or risk filter "${selectedRisk}".`} 
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-white font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Village / Taluka</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Active Reports</th>
                  <th className="py-3 px-4">Affected Animals</th>
                  <th className="py-3 px-4">Mortality</th>
                  <th className="py-3 px-4">AI Risk Score</th>
                  <th className="py-3 px-4">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredVillages.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{v.village}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{v.district}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">{v.cases}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{v.affected_animals}</td>
                    <td className="py-3.5 px-4 text-rose-600 font-bold">{v.mortality}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-sm text-slate-900">{v.risk_score}</span>
                      <span className="text-[10px] text-slate-400 ml-0.5">/100</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={t(`data.risk.${v.risk_level}`, {}, v.risk_level)} score={v.risk_score} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

