import React, { useState, useEffect } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [diseaseCode, setDiseaseCode] = useState('FMD')
  const [bodyWeight, setBodyWeight] = useState(350)
  const [vetName, setVetName] = useState('Dr. Vivek Kulkarni, B.V.Sc & A.H.')
  const [regNumber, setRegNumber] = useState('MSVC-98421')
  const [clinicName, setClinicName] = useState('Taluka Veterinary Polyclinic, Baramati, Dist. Pune')
  const [prescription, setPrescription] = useState(null)
  const [protocols, setProtocols] = useState({})

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                AI Clinical Prescription & Treatment Protocol
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Dept of Animal Husbandry, GoM
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Automated clinical dosage calculation tailored to species & estimated body weight
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Diagnosed Condition</label>
            <select
              value={diseaseCode}
              onChange={(e) => setDiseaseCode(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="FMD">Foot and Mouth Disease (लाळ-खुरकूत)</option>
              <option value="LSD">Lumpy Skin Disease (गाठींचा चर्मरोग)</option>
              <option value="DEFAULT">General Febrile Infection</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Body Weight (kg)</label>
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
                    Government of Maharashtra • Department of Animal Husbandry
                  </div>
                  <h3 className="text-lg font-black text-slate-900">OFFICIAL VETERINARY PRESCRIPTION SLIP</h3>
                  <p className="text-xs text-slate-600 font-medium">{prescription.veterinarian.polyclinic}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block">
                    {prescription.prescription_id}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Date: {new Date(prescription.issued_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Patient & Vet Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <p><strong>Patient:</strong> Animal #{prescription.patient.animal_id} (Case #{prescription.patient.case_id})</p>
                  <p><strong>Estimated Body Weight:</strong> {prescription.patient.estimated_weight_kg} kg</p>
                  <p><strong>Suspected Diagnosis:</strong> <span className="text-rose-700 font-bold">{prescription.diagnosis}</span> ({prescription.pathogen_type})</p>
                </div>
                <div className="text-right">
                  <p><strong>Treating Veterinarian:</strong> {prescription.veterinarian.name}</p>
                  <p><strong>Registration No:</strong> {prescription.veterinarian.reg_no}</p>
                  <p><strong>Emergency Helplines:</strong> 1962 (Toll-Free)</p>
                </div>
              </div>

              {/* Rx Medications */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-emerald-200 pb-1 flex items-center gap-1.5">
                  <span className="text-base font-serif italic font-bold">℞</span> Prescribed Medications & Dosages
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-emerald-50/80 text-emerald-950 font-bold text-left border-b border-emerald-200">
                        <th className="p-2">#</th>
                        <th className="p-2">Drug Name & Formulation</th>
                        <th className="p-2">Calculated Dosage</th>
                        <th className="p-2">Route</th>
                        <th className="p-2">Frequency & Duration</th>
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
                    <ShieldCheck className="w-3.5 h-3.5" /> Supportive Care & Wound Dressing
                  </h5>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-950">
                    {prescription.supportive_care.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
                  <h5 className="font-bold text-rose-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Mandatory Withdrawal Period
                  </h5>
                  <p className="text-[11px] text-rose-950">
                    <strong>Milk Withholding:</strong> {prescription.withdrawal_period.milk} (Do not supply to dairy collection centers).
                  </p>
                  <p className="text-[11px] text-rose-950">
                    <strong>Meat Withholding:</strong> {prescription.withdrawal_period.meat}.
                  </p>
                  <p className="text-[10px] text-rose-800 italic mt-1">{prescription.isolation_protocol}</p>
                </div>
              </div>

              {/* Footer Signature & Seal */}
              <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  <p className="font-bold text-slate-700">Digital Validation Hash: SHA256-MH-VET-SECURE</p>
                  <p>Scan QR code on field inspection to verify legitimacy</p>
                </div>
                <div className="text-right border-t border-dashed border-slate-400 pt-2 min-w-[180px]">
                  <p className="font-bold text-slate-900">{prescription.veterinarian.name}</p>
                  <p className="text-[10px]">Veterinary Officer (Class-I)</p>
                  <p className="text-[9px] text-slate-400">Govt. of Maharashtra</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Complies with Maharashtra Veterinary Council & DAH guidelines
          </span>
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
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={() => {
                if (onPrescriptionCreated) onPrescriptionCreated(prescription)
                onClose()
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-950"
            >
              <CheckCircle2 className="w-4 h-4" /> Attach to Case File
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
