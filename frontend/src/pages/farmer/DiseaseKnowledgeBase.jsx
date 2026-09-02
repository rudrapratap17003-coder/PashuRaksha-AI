import React, { useState } from 'react'
import {
  BookOpen,
  Search,
  ShieldCheck,
  AlertTriangle,
  Syringe,
  Activity,
  Bug,
  Droplet,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

const MAHARASHTRA_DISEASES = [
  {
    id: 'fmd',
    name: 'Foot and Mouth Disease (FMD / लाळ-खुरकूत)',
    marathiName: 'लाळ-खुरकूत रोग',
    pathogen: 'Aphthovirus (Picornaviridae, Serotypes O, A, Asia-1)',
    susceptible: 'Cattle, Buffalo, Sheep, Goats, Pigs',
    transmission: 'Direct contact, airborne aerosols (up to 10km downwind), contaminated fodder & milk tankers.',
    cardinalSigns: [
      'High rise of temperature (104°F – 106°F)',
      'Profuse stringy ropy salivation (लाळ गळणे)',
      'Vesicles / blisters on dental pad, tongue, and interdigital hoof clefts',
      'Severe lameness (लंगडणे) and smacking of lips',
      'Sudden drop in daily milk production (80–90%)'
    ],
    containmentProtocol: 'Quarantine shed for 21 days. Disinfect with 4% Sodium Carbonate. Mandate milk withholding.',
    vaccineSchedule: 'Bi-annual vaccination (May–June before monsoon & Nov–Dec). Quadrivalent oil adjuvant vaccine.',
    color: 'border-rose-500/40 bg-rose-950/20'
  },
  {
    id: 'lsd',
    name: 'Lumpy Skin Disease (LSD / गाठींचा चर्मरोग)',
    marathiName: 'लम्पी स्किन डिसीज (त्वचेवरील गाठी)',
    pathogen: 'Capripoxvirus (Poxviridae family)',
    susceptible: 'Cattle (Bulls, Cows, Calves), rarely Buffaloes',
    transmission: 'Blood-sucking vectors (Stomoxys biting flies, mosquitoes, Rhipicephalus ticks).',
    cardinalSigns: [
      'Firm, round, circumscribed skin nodules (2–5 cm diameter) all over body',
      'Edema / swelling of dewlap, brisket, and limbs',
      'Enlarged superficial lymph nodes (prescapular/precrural)',
      'Nasal discharge and lacrimation',
      'Emaciation and secondary maggot wounds in burst nodules'
    ],
    containmentProtocol: 'Vector-proof netting in shed. Spray Deltamethrin 1.25% EC. Isolate for 28 days.',
    vaccineSchedule: 'Goat Pox vaccine (Uttarkashi strain) at 10x dose for cattle or homologous Neethling strain.',
    color: 'border-amber-500/40 bg-amber-950/20'
  },
  {
    id: 'hs',
    name: 'Hemorrhagic Septicemia (HS / घटसर्प)',
    marathiName: 'घटसर्प (गळ्याची सूज)',
    pathogen: 'Pasteurella multocida (Serotypes B:2 & E:2)',
    susceptible: 'Buffaloes (highest mortality), Cattle',
    transmission: 'Ingestion of contaminated feed/water, stress during monsoon changes, overcrowding.',
    cardinalSigns: [
      'Sudden hyperthermia (106°F – 107°F)',
      'Hot, painful swelling of throat, brisket, and submandibular area',
      'Severe respiratory distress with snoring sound (Dyspnea)',
      'Death within 24 to 36 hours if untreated (Peracute course)'
    ],
    containmentProtocol: 'Immediate antimicrobial therapy (Oxytetracycline / Sulfa). Deep burial of carcasses with lime powder.',
    vaccineSchedule: 'Annual pre-monsoon vaccination (May) with Alum precipitated or Oil adjuvant HS vaccine.',
    color: 'border-purple-500/40 bg-purple-950/20'
  },
  {
    id: 'bq',
    name: 'Black Quarter (BQ / फऱ्या रोग)',
    marathiName: 'फऱ्या / फऱ्या रोग',
    pathogen: 'Clostridium chauvoei (Spore-forming anaerobe)',
    susceptible: 'Young healthy cattle & buffaloes (6 months to 2 years)',
    transmission: 'Ingestion of bacterial spores dormant in pasture soil during rainy season.',
    cardinalSigns: [
      'Crepitating swelling (gas accumulation under skin) in thigh, shoulder, or rump',
      'Skin over swelling becomes dry, dark, and cold',
      'Severe acute lameness',
      'High fever followed by rapid prostration and hypothermia before death'
    ],
    containmentProtocol: 'Never open carcass in open pasture! Burn or deep bury with quicklime. Disinfect sheds.',
    vaccineSchedule: 'Annual combined HS + BQ vaccine before onset of monsoon rains.',
    color: 'border-indigo-500/40 bg-indigo-950/20'
  },
  {
    id: 'mastitis',
    name: 'Clinical Mastitis (कासदाह / सड रोग)',
    marathiName: 'कासदाह (सड रोग)',
    pathogen: 'Staphylococcus aureus, Streptococcus agalactiae, E. coli',
    susceptible: 'High yielding lactating dairy cows & buffaloes',
    transmission: 'Poor milking hygiene, contaminated teat cups, wet/dirty bedding.',
    cardinalSigns: [
      'Swollen, hard, hot, and painful udder quarters',
      'Abnormal milk: flakes, clots, watery, yellowish, or blood-tinged secretion',
      'Severe milk yield loss',
      'Systemic fever in acute toxemic forms'
    ],
    containmentProtocol: 'Post-milking teat dipping in 0.5% Povidone Iodine. Complete milking hygiene protocols.',
    vaccineSchedule: 'Management-based control; dry cow therapy (Intramammary infusions at drying off).',
    color: 'border-teal-500/40 bg-teal-950/20'
  },
  {
    id: 'ppr',
    name: 'Peste des Petits Ruminants (PPR / शेळ्या-मेंढ्यांची प्लेग)',
    marathiName: 'शेळ्या-मेंढ्यांमधील प्लेग रोग',
    pathogen: 'Morbillivirus (Paramyxoviridae)',
    susceptible: 'Goats, Sheep (Small Ruminants)',
    transmission: 'Direct inhalation of aerosols from ocular/nasal secretions of infected small ruminants.',
    cardinalSigns: [
      'High fever (104°F – 106°F)',
      'Severe necrotizing erosive stomatitis (mouth ulcers with foul breath)',
      'Catarrhal to purulent ocular & nasal discharge',
      'Profuse watery foul-smelling diarrhea with rapid dehydration'
    ],
    containmentProtocol: 'Strict quarantine. Restrict goat migration between talukas during outbreaks.',
    vaccineSchedule: 'Single dose live attenuated PPR vaccine gives immunity for up to 3 years.',
    color: 'border-emerald-500/40 bg-emerald-950/20'
  }
]

export default function DiseaseKnowledgeBase() {
  const [search, setSearch] = useState('')
  const [selectedDisease, setSelectedDisease] = useState(MAHARASHTRA_DISEASES[0])

  const filtered = MAHARASHTRA_DISEASES.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.marathiName.toLowerCase().includes(search.toLowerCase()) ||
    d.pathogen.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12 text-slate-100 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>State Epidemiological Manual • महाराष्ट्र पशु आरोग्य मार्गदर्शिका</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Livestock Disease Knowledge Base &amp; Biosecurity Guide
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Official guidelines, pathogen transmission vectors, cardinal signs, and containment protocols approved by the Department of Animal Husbandry, Govt. of Maharashtra.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by disease name (e.g. FMD, लाळ-खुरकूत, Lumpy Skin, घटसर्प)..."
          className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* 2-Column Split: Disease List + Detailed Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Disease Cards */}
        <div className="md:col-span-5 space-y-3">
          {filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDisease(d)}
              className={`w-full p-4 rounded-2xl text-left border transition flex items-center justify-between ${
                selectedDisease.id === d.id
                  ? 'bg-slate-900 border-emerald-400 shadow-lg shadow-emerald-950'
                  : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-emerald-400 block">{d.marathiName}</span>
                <h4 className="text-sm font-bold text-white leading-snug">{d.name}</h4>
                <span className="text-[10px] text-slate-400 block">{d.susceptible}</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${selectedDisease.id === d.id ? 'text-emerald-400' : 'text-slate-600'}`} />
            </button>
          ))}
        </div>

        {/* Right 7 Cols: Detailed Dossier */}
        <div className="md:col-span-7">
          {selectedDisease && (
            <Card className={`p-6 rounded-3xl border ${selectedDisease.color} space-y-5 bg-slate-900/90 shadow-2xl`}>
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400 font-bold uppercase mb-1">
                  <span>Pathogen Profile</span>
                  <span>•</span>
                  <span>{selectedDisease.pathogen}</span>
                </div>
                <h3 className="text-xl font-black text-white">{selectedDisease.name}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  <strong>Susceptible Species:</strong> {selectedDisease.susceptible}
                </p>
              </div>

              {/* Cardinal Signs */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span>Cardinal Clinical Signs (प्रमुख लक्षणे)</span>
                </h4>
                <ul className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 text-xs">
                  {selectedDisease.cardinalSigns.map((sign, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-200">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transmission Vectors */}
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5 text-amber-400" />
                  <span>Transmission &amp; Vector Ecology</span>
                </h4>
                <p className="text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {selectedDisease.transmission}
                </p>
              </div>

              {/* Containment Protocol */}
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Biosecurity &amp; Quarantine Protocol</span>
                </h4>
                <p className="text-amber-200 bg-amber-950/40 p-3 rounded-xl border border-amber-500/30 leading-relaxed">
                  {selectedDisease.containmentProtocol}
                </p>
              </div>

              {/* Vaccine Schedule */}
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-sky-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Syringe className="w-3.5 h-3.5" />
                  <span>Maharashtra State Vaccination Schedule</span>
                </h4>
                <p className="text-sky-200 bg-sky-950/40 p-3 rounded-xl border border-sky-500/30 leading-relaxed">
                  {selectedDisease.vaccineSchedule}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
