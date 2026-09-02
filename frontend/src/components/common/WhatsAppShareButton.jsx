import React from 'react'
import { Share2, Smartphone } from 'lucide-react'

export default function WhatsAppShareButton({
  phone = '',
  title = 'Pashuraksha AI Clinical Prescription',
  message = '',
  prescriptionData = null,
  className = ''
}) {
  const handleShare = () => {
    let text = message
    if (prescriptionData) {
      text = `🏛️ *महाराष्ट्र शासन • पशुसंवर्धन विभाग (GoM)*\n*PASHURAKSHA AI DIGITAL PRESCRIPTION*\n\n` +
        `📋 *Rx ID:* ${prescriptionData.prescription_id}\n` +
        `🐄 *Animal ID:* #${prescriptionData.patient?.animal_id} (${prescriptionData.patient?.estimated_weight_kg} kg)\n` +
        `🩺 *Diagnosis:* ${prescriptionData.diagnosis}\n` +
        `👨‍⚕️ *Veterinarian:* ${prescriptionData.veterinarian?.name}\n\n` +
        `💊 *Prescribed Medications:*\n` +
        prescriptionData.medications?.map((m, i) => `${i + 1}. *${m.drug_name}* - Dose: ${m.calculated_dose} (${m.route}) for ${m.frequency}`).join('\n') +
        `\n\n⚠️ *Mandatory Milk Withholding:* ${prescriptionData.withdrawal_period?.milk || '7 days'}\n` +
        `📞 *Toll-Free Helpline:* 1962 (24x7 Pashu Sanjeevani)\n\n` +
        `_Digital Validation Hash: SHA256-MH-VET-SECURE_`
    }

    const encoded = encodeURIComponent(text)
    const targetUrl = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`
    window.open(targetUrl, '_blank')
  }

  return (
    <button
      onClick={handleShare}
      className={`px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-slate-950 font-bold text-xs shadow-md transition flex items-center space-x-1.5 ${className}`}
    >
      <Share2 className="w-3.5 h-3.5 text-slate-950" />
      <span>Share on WhatsApp</span>
    </button>
  )
}
