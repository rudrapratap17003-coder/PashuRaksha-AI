import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  PawPrint,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Syringe,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Milk,
  Calendar,
  MapPin,
  Tag,
  Layers,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import RiskBadge from '../../components/common/RiskBadge'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const SPECIES_OPTIONS = ['All', 'Cattle', 'Buffalo', 'Goat', 'Sheep', 'Poultry']
const STATUS_OPTIONS = ['All', 'Healthy', 'Under Observation', 'Sick', 'Quarantined']
const VACC_OPTIONS = ['All', 'Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated']

const SPECIES_COLORS = {
  Cattle: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Buffalo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  Goat: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Sheep: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Poultry: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
}

const HEALTH_COLORS = {
  Healthy: 'bg-emerald-500/20 text-emerald-300',
  'Under Observation': 'bg-amber-500/20 text-amber-300',
  Sick: 'bg-red-500/20 text-red-300',
  Quarantined: 'bg-purple-500/20 text-purple-300',
}

function getAge(dob) {
  if (!dob) return 'N/A'
  const birth = new Date(dob)
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (months < 12) return `${months}mo`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years}y ${rem}mo` : `${years}y`
}

function getVaccStatus(vaccinations) {
  if (!vaccinations || vaccinations.length === 0) return 'Not Vaccinated'
  if (vaccinations.length >= 3) return 'Fully Vaccinated'
  return 'Partially Vaccinated'
}

export default function HerdManagement() {
  const { user } = useAuth()
  const [animals, setAnimals] = useState([])
  const [vaccinations, setVaccinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [vaccFilter, setVaccFilter] = useState('All')
  const [sortField, setSortField] = useState('tag_number')
  const [sortDir, setSortDir] = useState('asc')
  const [view, setView] = useState('grid') // grid | table

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [animRes, vaccRes] = await Promise.allSettled([
        apiClient.get('/animals'),
        apiClient.get('/vaccinations'),
      ])
      if (animRes.status === 'fulfilled') setAnimals(animRes.value.data || [])
      if (vaccRes.status === 'fulfilled') setVaccinations(vaccRes.value.data || [])
    } catch (err) {
      console.error('Herd data fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  // Enrich animals with vaccination status
  const enrichedAnimals = useMemo(() => {
    return animals.map(a => {
      const animalVaccs = vaccinations.filter(v => v.animal_id === a.id)
      return {
        ...a,
        vacc_status: getVaccStatus(animalVaccs),
        vacc_count: animalVaccs.length,
        age_display: getAge(a.date_of_birth),
        species: a.species || 'Cattle',
        health_status: a.health_status || 'Healthy',
        lactation_yield: a.lactation_yield || (a.species === 'Cattle' || a.species === 'Buffalo' ? `${(Math.random() * 12 + 3).toFixed(1)} L/day` : '-'),
        village: a.village || a.location || 'Baramati',
      }
    })
  }, [animals, vaccinations])

  // Filter and sort
  const filteredAnimals = useMemo(() => {
    let result = [...enrichedAnimals]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(a =>
        (a.tag_number || '').toLowerCase().includes(q) ||
        (a.name || '').toLowerCase().includes(q) ||
        (a.breed || '').toLowerCase().includes(q) ||
        (a.village || '').toLowerCase().includes(q)
      )
    }

    if (speciesFilter !== 'All') result = result.filter(a => a.species === speciesFilter)
    if (statusFilter !== 'All') result = result.filter(a => a.health_status === statusFilter)
    if (vaccFilter !== 'All') result = result.filter(a => a.vacc_status === vaccFilter)

    result.sort((a, b) => {
      let aVal = a[sortField] || ''
      let bVal = b[sortField] || ''
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (sortDir === 'asc') return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })

    return result
  }, [enrichedAnimals, searchQuery, speciesFilter, statusFilter, vaccFilter, sortField, sortDir])

  // Stats
  const stats = useMemo(() => {
    const total = enrichedAnimals.length
    const healthy = enrichedAnimals.filter(a => a.health_status === 'Healthy').length
    const sick = enrichedAnimals.filter(a => a.health_status === 'Sick' || a.health_status === 'Quarantined').length
    const fullyVacc = enrichedAnimals.filter(a => a.vacc_status === 'Fully Vaccinated').length
    const speciesBreakdown = {}
    enrichedAnimals.forEach(a => {
      speciesBreakdown[a.species] = (speciesBreakdown[a.species] || 0) + 1
    })
    return { total, healthy, sick, fullyVacc, speciesBreakdown }
  }, [enrichedAnimals])

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
              <Layers className="w-6 h-6 text-emerald-400" />
            </div>
            Herd Management — Digital Passport Registry
          </h1>
          <p className="text-sm text-slate-400 mt-1 ml-14">
            Farm-level livestock inventory with species, vaccination status, lactation yield & age breakdown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/farmer/animals/add"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-900/30 transition"
          >
            <PawPrint className="w-4 h-4" /> Register Animal
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Livestock', value: stats.total, icon: PawPrint, color: 'emerald' },
          { label: 'Healthy', value: stats.healthy, icon: ShieldCheck, color: 'green' },
          { label: 'Sick / Quarantined', value: stats.sick, icon: AlertTriangle, color: 'red' },
          { label: 'Fully Vaccinated', value: stats.fullyVacc, icon: Syringe, color: 'sky' },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-2xl bg-slate-900/80 border border-${s.color}-500/20`}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 text-${s.color}-400`} />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
            </div>
            <p className={`text-3xl font-black text-${s.color}-400`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Species Breakdown Bar */}
      <Card className="p-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5" /> Species Distribution
        </h3>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(stats.speciesBreakdown).map(([species, count]) => (
            <button
              key={species}
              onClick={() => setSpeciesFilter(speciesFilter === species ? 'All' : species)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                speciesFilter === species
                  ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                  : SPECIES_COLORS[species] || 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {species}: {count}
            </button>
          ))}
        </div>
      </Card>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by tag number, name, breed, or village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {SPECIES_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Species' : s}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
        </select>
        <select
          value={vaccFilter}
          onChange={(e) => setVaccFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {VACC_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'Vaccination Status' : s}</option>)}
        </select>
        <div className="flex rounded-xl overflow-hidden border border-slate-700">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-2 text-xs font-bold ${view === 'grid' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-3 py-2 text-xs font-bold ${view === 'table' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-500">
        Showing <span className="text-emerald-400 font-bold">{filteredAnimals.length}</span> of {enrichedAnimals.length} registered livestock
      </p>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      )}

      {/* Grid View */}
      {!loading && view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAnimals.map(animal => (
            <Link
              key={animal.id}
              to={`/farmer/animals/${animal.id}`}
              className="group p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all hover:shadow-lg hover:shadow-emerald-950/20"
            >
              {/* Species & Tag */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${SPECIES_COLORS[animal.species] || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  {animal.species}
                </span>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {animal.tag_number || `#${animal.id}`}
                </span>
              </div>

              {/* Name & Breed */}
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                {animal.name || `Animal #${animal.id}`}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{animal.breed || 'Local Breed'}</p>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{animal.age_display}</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{animal.village}</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Milk className="w-3 h-3" />
                  <span>{animal.lactation_yield}</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Syringe className="w-3 h-3" />
                  <span>{animal.vacc_count} doses</span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${HEALTH_COLORS[animal.health_status] || 'bg-slate-800 text-slate-300'}`}>
                  {animal.health_status}
                </span>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  animal.vacc_status === 'Fully Vaccinated' ? 'bg-green-500/20 text-green-300'
                    : animal.vacc_status === 'Partially Vaccinated' ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {animal.vacc_status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Table View */}
      {!loading && view === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800">
                {[
                  { key: 'tag_number', label: 'Tag #' },
                  { key: 'name', label: 'Name' },
                  { key: 'species', label: 'Species' },
                  { key: 'breed', label: 'Breed' },
                  { key: 'age_display', label: 'Age' },
                  { key: 'village', label: 'Village' },
                  { key: 'health_status', label: 'Health' },
                  { key: 'vacc_status', label: 'Vaccination' },
                  { key: 'lactation_yield', label: 'Yield' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-emerald-400 transition select-none"
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortField === col.key && (sortDir === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAnimals.map(animal => (
                <tr key={animal.id} className="hover:bg-slate-900/60 transition">
                  <td className="px-4 py-3 text-xs font-mono text-slate-300">{animal.tag_number || `#${animal.id}`}</td>
                  <td className="px-4 py-3 text-xs font-bold text-white">{animal.name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${SPECIES_COLORS[animal.species] || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                      {animal.species}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{animal.breed || '-'}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{animal.age_display}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-600" />
                    {animal.village}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${HEALTH_COLORS[animal.health_status] || 'bg-slate-800 text-slate-300'}`}>
                      {animal.health_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      animal.vacc_status === 'Fully Vaccinated' ? 'bg-green-500/20 text-green-300'
                        : animal.vacc_status === 'Partially Vaccinated' ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {animal.vacc_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{animal.lactation_yield}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/farmer/animals/${animal.id}`}
                      className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-400 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAnimals.length === 0 && (
        <div className="text-center py-16">
          <PawPrint className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-400">No livestock found</h3>
          <p className="text-sm text-slate-500 mt-1">Adjust your filters or register new animals</p>
          <Link
            to="/farmer/animals/add"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition"
          >
            <PawPrint className="w-4 h-4" /> Register First Animal
          </Link>
        </div>
      )}
    </div>
  )
}
