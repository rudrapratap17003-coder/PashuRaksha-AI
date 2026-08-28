import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PawPrint, Plus, Eye, FilePlus2, Search, Filter, RefreshCw } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import RiskBadge from '../../components/common/RiskBadge'
import AnimalDetailModal from '../../components/farmer/AnimalDetailModal'
import apiClient from '../../services/api'

export default function FarmerAnimalsPage() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAnimal, setSelectedAnimal] = useState(null)

  const fetchAnimals = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/animals')
      setAnimals(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimals()
  }, [])

  const filteredAnimals = animals.filter(a => 
    a.animal_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.breed?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Digital Livestock Passports
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Registered Animals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive digital records of all registered cattle, buffaloes, and goats
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchAnimals}
            title="Refresh"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/farmer/animals/add">
            <Button icon={Plus} className="font-bold">
              Register Animal
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Ear-tag ID, species, or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Animal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredAnimals.map((animal) => (
          <Card key={animal.id} hover className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {animal.animal_id}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    {animal.species}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {animal.breed} • {animal.age} yrs
                  </p>
                </div>
                <RiskBadge
                  level={animal.current_risk_level || 'LOW'}
                  score={animal.current_risk_score}
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Vaccination:</span>
                  <span className="font-semibold text-slate-700">{animal.vaccination_status || 'Up to date'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Weight:</span>
                  <span className="font-semibold text-slate-700">{animal.weight ? `${animal.weight} kg` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Milk Production:</span>
                  <span className="font-semibold text-slate-700">{animal.milk_production ? `${animal.milk_production} L/day` : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <Link
                to={`/farmer/report?animalId=${animal.animal_id}`}
                className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
              >
                <FilePlus2 className="w-3.5 h-3.5" />
                <span>Report Symptom</span>
              </Link>
              <button
                onClick={() => setSelectedAnimal(animal)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-semibold flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Passport</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {selectedAnimal && (
        <AnimalDetailModal
          animal={selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
        />
      )}
    </div>
  )
}
