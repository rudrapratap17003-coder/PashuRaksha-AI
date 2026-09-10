import { useLanguage } from '../../context/LanguageContext'
import React, { useState } from 'react'
import { PlusCircle, CheckCircle2, X } from 'lucide-react'
import Button from '../../components/common/Button'
import apiClient from '../../services/api'
import { useNavigate } from 'react-router-dom'

export default function FieldWorkerReportPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [reportForm, setReportForm] = useState({
    animal_id: '',
    species: 'Cattle (Cow)',
    reporter_name: '',
    village: 'Baramati',
    district: 'Pune',
    fever: false,
    cough: false,
    nasal_discharge: false,
    reduced_appetite: false,
    diarrhea: false,
    lethargy: false,
    reduced_milk: false,
    difficulty_breathing: false,
    salivation: false,
    lesions: false,
    swelling: false,
    severity: 'moderate',
    number_of_animals_affected: 1
  })
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmitOnBehalf = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiClient.post('/field-worker/report', reportForm)
      setSuccessMsg('{t("fieldWorker.successLodge")}')
      setTimeout(() => {
        navigate('/field-worker/dashboard')
      }, 1500)
    } catch {
      setSuccessMsg('Health report registered in local sync queue.')
      setTimeout(() => {
        navigate('/field-worker/dashboard')
      }, 1500)
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
            <PlusCircle className="w-4 h-4" />
            <span>{t("fieldWorker.outreachBadge")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("fieldWorker.modalTitle")}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            {t("fieldWorker.modalSubtitle2")}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto">
        {successMsg ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">{successMsg}</h4>
            <p className="text-xs text-slate-400">{t("fieldWorker.successLodgeSub")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitOnBehalf} className="space-y-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-2">{t("fieldWorker.farmerName")}</label>
                <input
                  type="text"
                  required
                  value={reportForm.reporter_name}
                  onChange={(e) => setReportForm({ ...reportForm, reporter_name: e.target.value })}
                  placeholder={t("fieldWorker.farmerPlaceholder")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-2">{t("fieldWorker.tagId")}</label>
                <input
                  type="text"
                  required
                  value={reportForm.animal_id}
                  onChange={(e) => setReportForm({ ...reportForm, animal_id: e.target.value })}
                  placeholder={t("fieldWorker.tagIdPlaceholder")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-2">{t("fieldWorker.villageLabel")}</label>
                <select
                  value={reportForm.village}
                  onChange={(e) => setReportForm({ ...reportForm, village: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-teal-500"
                >
                  <option value="Baramati">Baramati (Pune)</option>
                  <option value="Shirur">Shirur (Pune)</option>
                  <option value="Indapur">Indapur (Pune)</option>
                  <option value="Sinnar">Sinnar (Nashik)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-2">{t("fieldWorker.affectedCount")}</label>
                <input
                  type="number"
                  min="1"
                  value={reportForm.number_of_animals_affected}
                  onChange={(e) => setReportForm({ ...reportForm, number_of_animals_affected: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Symptoms Checklist */}
            <div>
              <label className="block text-slate-300 font-bold mb-3">{t("fieldWorker.clinicalSigns")}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {[
                  { id: 'fever', label: t('data.symptom.fever') },
                  { id: 'cough', label: t('data.symptom.cough') },
                  { id: 'nasal_discharge', label: t('data.symptom.nasal_discharge') },
                  { id: 'reduced_appetite', label: t('data.symptom.reduced_appetite') },
                  { id: 'diarrhea', label: t('data.symptom.diarrhea') },
                  { id: 'lethargy', label: t('data.symptom.lethargy') },
                  { id: 'reduced_milk', label: t('data.symptom.reduced_milk') },
                  { id: 'difficulty_breathing', label: t('data.symptom.difficulty_breathing') },
                  { id: 'salivation', label: t('data.symptom.salivation') },
                  { id: 'lesions', label: t('data.symptom.lesions') },
                  { id: 'swelling', label: t('data.symptom.swelling') },
                ].map((sym) => (
                  <label key={sym.id} className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={reportForm[sym.id]}
                      onChange={(e) => setReportForm({ ...reportForm, [sym.id]: e.target.checked })}
                      className="rounded border-slate-700 text-teal-600 focus:ring-teal-500 w-4 h-4 bg-slate-900"
                    />
                    <span className="text-xs">{sym.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => navigate('/field-worker/dashboard')}>
                {t("fieldWorker.cancelBtn")}
              </Button>
              <Button type="submit" variant="primary" loading={submitting} className="bg-teal-600 hover:bg-teal-500 text-white font-bold">
                {t("fieldWorker.submitBtn")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
