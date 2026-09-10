import { useLanguage } from '../../context/LanguageContext'
import React, { useState, useEffect } from 'react'
import { Home, Users, Search, MapPin, ClipboardList, Plus, X, CheckCircle2 } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateFeedback'
import apiClient from '../../services/api'

export default function FieldWorkerCensusPage() {
  const { t } = useLanguage()
  const [households, setHouseholds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modals state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [selectedHousehold, setSelectedHousehold] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchHouseholds = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/field-worker/households')
      setHouseholds(res.data || [])
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch households')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHouseholds()
  }, [])

  const filteredHouseholds = households.filter(h => 
    (h.owner_name || h.name).toLowerCase().includes(searchTerm.toLowerCase()) || 
    (h.village || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openDetails = (household) => {
    setSelectedHousehold(household)
    setDetailsModalOpen(true)
  }

  const openUpdate = (household) => {
    setSelectedHousehold(household)
    setFormData({
      name: household.name,
      owner_name: household.owner_name,
      village: household.village,
      total_animals: household.total_animals,
      cattle_count: household.cattle_count,
      buffalo_count: household.buffalo_count,
      goat_count: household.goat_count,
      sheep_count: household.sheep_count,
      poultry_count: household.poultry_count
    })
    setUpdateModalOpen(true)
  }

  const openRegister = () => {
    setFormData({
      name: '',
      owner_name: '',
      village: '',
      district: 'Pune',
      taluka: ''
    })
    setRegisterModalOpen(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiClient.put(`/field-worker/households/${selectedHousehold.id}`, formData)
      setSuccessMsg('Census updated successfully')
      setTimeout(() => {
        setUpdateModalOpen(false)
        setSuccessMsg('')
        fetchHouseholds()
      }, 1500)
    } catch (err) {
      alert('Failed to update census data')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiClient.post(`/field-worker/households`, formData)
      setSuccessMsg('Household registered successfully')
      setTimeout(() => {
        setRegisterModalOpen(false)
        setSuccessMsg('')
        fetchHouseholds()
      }, 1500)
    } catch (err) {
      alert('Failed to register household')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border border-teal-500/20 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Home className="w-4 h-4" />
            <span>{t("fieldWorker.fieldOutreachBadge")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("fieldWorker.censusTitle")}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            {t("fieldWorker.censusSubtitle")}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={openRegister}
            variant="primary"
            icon={Users}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            {t("fieldWorker.registerNew")}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-slate-900/80 border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t("fieldWorker.searchFarmerPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full font-bold self-start sm:self-auto">
            {t("fieldWorker.householdsFound", { count: filteredHouseholds.length })}
          </span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <LoadingState message={t("fieldWorker.loadingHouseholds")} />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchHouseholds} />
          ) : filteredHouseholds.length === 0 ? (
            <EmptyState
              title={t("fieldWorker.noHouseholds")}
              description={t("fieldWorker.noHouseholdsSub")}
            />
          ) : (
            filteredHouseholds.map(h => (
              <div 
                key={h.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-teal-500/30 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-base">{h.owner_name || h.name}</span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{h.village || h.district}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center space-x-2">
                    <span className="font-semibold text-teal-400">{h.total_animals} {t("fieldWorker.animalsRegistered")}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDetails(h)}
                    className="bg-slate-900 border-teal-500/40 text-teal-300 hover:bg-teal-950 text-xs font-bold"
                  >
                    {t("fieldWorker.viewDetails")}
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => openUpdate(h)}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center space-x-1"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>{t("fieldWorker.updateCensus")}</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Modals */}
      
      {/* Details Modal */}
      {detailsModalOpen && selectedHousehold && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">{t("fieldWorker.householdDetails")}</h3>
              <button onClick={() => setDetailsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500 text-xs font-bold">{t("fieldWorker.farmerOwner")}</p>
                  <p className="font-semibold text-white">{selectedHousehold.owner_name || selectedHousehold.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold">{t("fieldWorker.farmName")}</p>
                  <p className="font-semibold text-white">{selectedHousehold.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold">{t("fieldWorker.location")}</p>
                  <p className="font-semibold text-white">{selectedHousehold.village || 'N/A'}, {selectedHousehold.district}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold">{t("fieldWorker.registeredOn")}</p>
                  <p className="font-semibold text-white">{new Date(selectedHousehold.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mt-4">
                <p className="text-slate-400 text-xs font-bold mb-3 uppercase tracking-wider">{t("fieldWorker.livestockCensusLabel")}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>{t("fieldWorker.totalAnimalsLabel")}</span>
                    <span className="font-bold text-teal-400">{selectedHousehold.total_animals}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>{t("fieldWorker.cattleLabel")}</span>
                    <span className="font-bold text-white">{selectedHousehold.cattle_count}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>{t("fieldWorker.buffaloLabel")}</span>
                    <span className="font-bold text-white">{selectedHousehold.buffalo_count}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>{t("fieldWorker.goatsLabel")}</span>
                    <span className="font-bold text-white">{selectedHousehold.goat_count}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>{t("fieldWorker.sheepLabel")}</span>
                    <span className="font-bold text-white">{selectedHousehold.sheep_count}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span>{t("fieldWorker.poultryLabel")}</span>
                    <span className="font-bold text-white">{selectedHousehold.poultry_count}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setDetailsModalOpen(false)} variant="primary" className="bg-slate-800 hover:bg-slate-700">
                {t("fieldWorker.close")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* {t("fieldWorker.updateCensus")} Modal */}
      {updateModalOpen && selectedHousehold && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">{t("fieldWorker.updateCensus")} for {selectedHousehold.owner_name}</h3>
              <button onClick={() => setUpdateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {successMsg ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">{successMsg}</h4>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">{t("fieldWorker.totalAnimalsLabelNoColon")}</label>
                    <input type="number" value={formData.total_animals} onChange={e => setFormData({...formData, total_animals: parseInt(e.target.value)||0})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-teal-500" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">{t("fieldWorker.cattleCountLabel")}</label>
                    <input type="number" value={formData.cattle_count} onChange={e => setFormData({...formData, cattle_count: parseInt(e.target.value)||0})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-teal-500" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">{t("fieldWorker.buffaloCountLabel")}</label>
                    <input type="number" value={formData.buffalo_count} onChange={e => setFormData({...formData, buffalo_count: parseInt(e.target.value)||0})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-teal-500" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">{t("fieldWorker.goatCountLabel")}</label>
                    <input type="number" value={formData.goat_count} onChange={e => setFormData({...formData, goat_count: parseInt(e.target.value)||0})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-teal-500" />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button type="button" onClick={() => setUpdateModalOpen(false)} variant="outline">{t("fieldWorker.cancelBtn")}</Button>
                  <Button type="submit" loading={submitting} variant="primary" className="bg-teal-600 hover:bg-teal-500">{t("fieldWorker.saveUpdate")}</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Register Household Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">{t("fieldWorker.registerNew")}</h3>
              <button onClick={() => setRegisterModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {successMsg ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">{successMsg}</h4>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 text-sm">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t("fieldWorker.farmerName")}</label>
                  <input type="text" required value={formData.owner_name} onChange={e => setFormData({...formData, owner_name: e.target.value, name: `${e.target.value}'s Farm`})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-teal-500" placeholder={t("fieldWorker.farmerPlaceholder")} />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t("fieldWorker.villageLabel")}</label>
                  <input type="text" required value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-teal-500" placeholder={t("fieldWorker.villagePlaceholder")} />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">{t("fieldWorker.taluka")}</label>
                  <input type="text" value={formData.taluka} onChange={e => setFormData({...formData, taluka: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-teal-500" placeholder={t("fieldWorker.villagePlaceholder")} />
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button type="button" onClick={() => setRegisterModalOpen(false)} variant="outline">{t("fieldWorker.cancelBtn")}</Button>
                  <Button type="submit" loading={submitting} variant="primary" className="bg-emerald-600 hover:bg-emerald-500">{t("fieldWorker.registerBtn")}</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
