import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import {
  FileText,
  Printer,
  Download,
  X,
  ShieldCheck,
  Stethoscope,
  AlertTriangle,
  QrCode,
  Sparkles,
  RefreshCw,
  CheckCircle2
} from 'lucide-react'
import WhatsAppShareButton from '../common/WhatsAppShareButton'
import apiClient from '../../services/api'

export default function PrescriptionGeneratorModal({ isOpen, onClose, caseData, onPrescriptionCreated }) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [diseaseCode, setDiseaseCode] = useState('FMD')
  const [bodyWeight, setBodyWeight] = useState(350)
  const [vetName, setVetName] = useState('Dr. Vivek Kulkarni, B.V.Sc & A.H.')
  const [regNumber, setRegNumber] = useState('MSVC-98421')
  const [clinicName, setClinicName] = useState('Taluka Veterinary Polyclinic, Baramati, Dist. Pune')
  const [prescription, setPrescription] = useState(null)
  const [protocols, setProtocols] = useState({})
  const [vetConfirmed, setVetConfirmed] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchProtocols()
      generateRx()
    }
  }, [isOpen, diseaseCode, bodyWeight])

  const fetchProtocols = async () => {
    try {
      const res = await apiClient.get('/treatments/protocols')
      setProtocols(res.data || {})
    } catch (e) {
      console.error('Failed to load treatment protocols', e)
    }
  }

  const generateRx = async () => {
    setLoading(true)
    try {
      const res = await apiClient.post(
        `/treatments/generate-prescription?case_id=${caseData?.id || 1}&animal_id=${caseData?.animal_id || 1}&disease_code=${diseaseCode}&body_weight_kg=${bodyWeight}&vet_name=${encodeURIComponent(vetName)}&reg_number=${encodeURIComponent(regNumber)}&clinic_name=${encodeURIComponent(clinicName)}`
      )
      setPrescription(res.data)
    } catch (e) {
      console.error('Failed to generate prescription', e)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex-shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                Veterinary Clinical Decision Support
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Clinical Reference Only
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1 sm:line-clamp-none">
                Automated clinical reference & dosage advisory tailored to species & estimated body weight
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close prescription advisory modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">{t("vetModule.rxModal.diagnosedCond")}</label>
            <select
              value={diseaseCode}
              onChange={(e) => setDiseaseCode(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="FMD">{t("vetModule.rxModal.fmd")}</option>
              <option value="LSD">{t("vetModule.rxModal.lsd")}</option>
              <option value="DEFAULT">{t("vetModule.rxModal.general")}</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">{t("vetModule.rxModal.bodyWeight")}</label>
            <input
              type="number"
              value={bodyWeight}
              onChange={(e) => setBodyWeight(Number(e.target.value))}
              min="20"
              max="1000"
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={generateRx}
              className="w-full px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Recalculate Dosages
            </button>
          </div>
        </div>

        {/* Prescription Document Preview */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 print:bg-white print:text-black">
          {prescription && (
            <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-300 space-y-5 print:shadow-none print:border-none">
              {/* Official Header */}
              <div className="border-b-2 border-emerald-800 pb-3 flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-black uppercase text-emerald-800 tracking-wider">
                    Prototype developed for SIH Problem Statement SIH26128 • Clinical Decision Support
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{t("vetModule.rxModal.advisoryHeader")}</h3>
                  <p className="text-xs text-slate-600 font-medium">{prescription.veterinarian.polyclinic}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block">
                    {prescription.prescription_id}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {t("vetModule.rxModal.date")}: {new Date(prescription.issued_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Safety Disclaimer Banner */}
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2 print:border-slate-400">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{t("vetModule.rxModal.disclaimerTitle")}</p>
                  <p className="text-[11px] leading-relaxed">
                    AI-assisted clinical reference only. Final diagnosis, treatment, and dosage decisions must be made by a licensed veterinarian following clinical examination.
                  </p>
                </div>
              </div>

              {/* Patient & Vet Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <p><strong>{t("vetModule.rxModal.patient")}:</strong> Animal #{prescription.patient.animal_id} (Case #{prescription.patient.case_id})</p>
                  <p><strong>{t("vetModule.rxModal.estWeight")}:</strong> {prescription.patient.estimated_weight_kg} kg</p>
                  <p><strong>{t("vetModule.rxModal.suspectedDiag")}:</strong> <span className="text-rose-700 font-bold">{prescription.diagnosis}</span> ({prescription.pathogen_type})</p>
                </div>
                <div className="text-right">
                  <p><strong>{t("vetModule.rxModal.treatingVet")}:</strong> {prescription.veterinarian.name}</p>
                  <p><strong>{t("vetModule.rxModal.regNo")}:</strong> {prescription.veterinarian.reg_no}</p>
                  <p><strong>{t("vetModule.rxModal.helpline")}:</strong> 1962 (Toll-Free)</p>
                </div>
              </div>

              {/* Rx Medications */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-1 flex items-center gap-1.5">
                  <span className="text-base font-serif italic font-bold">℞</span> {t("vetModule.rxModal.medsAndDosage")}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-emerald-50/80 text-emerald-950 font-bold text-left border-b border-emerald-200">
                        <th className="p-2">{t("vetModule.rxModal.tableNum")}</th>
                        <th className="p-2">{t("vetModule.rxModal.tableDrug")}</th>
                        <th className="p-2">{t("vetModule.rxModal.tableDose")}</th>
                        <th className="p-2">{t("vetModule.rxModal.tableRoute")}</th>
                        <th className="p-2">{t("vetModule.rxModal.tableFreq")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {prescription.medications.map((med, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-bold">{idx + 1}</td>
                          <td className="p-2">
                            <strong className="text-slate-900">{med.drug_name}</strong>
                            <div className="text-[10px] text-slate-500">{med.category} — {med.purpose}</div>
                          </td>
                          <td className="p-2 font-bold text-emerald-800 bg-emerald-50/40">{med.calculated_dose}</td>
                          <td className="p-2">{med.route}</td>
                          <td className="p-2">{med.frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Supportive Care & Antiseptic Footbaths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <h5 className="font-bold text-amber-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {t("vetModule.rxModal.supportiveCare")}
                  </h5>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-950">
                    {prescription.supportive_care.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
                  <h5 className="font-bold text-rose-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {t("vetModule.rxModal.withdrawalPeriod")}
                  </h5>
                  <p className="text-[11px] text-rose-950">
                    <strong>{t("vetModule.rxModal.milkWithhold")}:</strong> {prescription.withdrawal_period.milk} ({t("vetModule.rxModal.doNotSupply")}).
                  </p>
                  <p className="text-[11px] text-rose-950">
                    <strong>{t("vetModule.rxModal.meatWithhold")}:</strong> {prescription.withdrawal_period.meat}.
                  </p>
                  <p className="text-[10px] text-rose-800 italic mt-1">{prescription.isolation_protocol}</p>
                </div>
              </div>

              {/* Footer Signature & Clinical Validation */}
              <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-600">
                <div className="max-w-xs">
                  <p className="font-bold text-slate-800">{t("vetModule.rxModal.clinicalVerif")}</p>
                  <p className="text-[10px] text-slate-500">
                    Dosage protocol generated via PashuRaksha Clinical Decision Support Engine.
                  </p>
                </div>
                <div className="text-right border-t border-dashed border-slate-400 pt-2 min-w-[200px]">
                  <p className="font-bold text-slate-900">{prescription.veterinarian.name}</p>
                  <p className="text-[10px] text-slate-600">Reg: {prescription.veterinarian.reg_no}</p>
                  <p className="text-[10px] text-slate-500">{prescription.veterinarian.polyclinic}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="flex items-center space-x-2 text-xs text-amber-300 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={vetConfirmed}
              onChange={(e) => setVetConfirmed(e.target.checked)}
              className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span>
              {t("vetModule.rxModal.confirmText")} #{caseData?.id || '101'}.
            </span>
          </label>
          <div className="flex items-center space-x-3">
            {prescription && (
              <WhatsAppShareButton
                prescriptionData={prescription}
                className="py-2"
              />
            )}
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700"
            >
              <Printer className="w-4 h-4" /> {t("vetModule.rxModal.printPdf")}
            </button>
            <button
              disabled={!vetConfirmed}
              onClick={() => {
                if (onPrescriptionCreated) onPrescriptionCreated(prescription)
                onClose()
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg ${
                vetConfirmed
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> {t("vetModule.rxModal.attachCase")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
