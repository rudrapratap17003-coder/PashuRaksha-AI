import React, { useState } from 'react'
import {
  Award,
  ShieldCheck,
  Search,
  Sparkles,
  Dna,
  MapPin,
  Heart,
  Layers,
  ChevronRight,
  Printer,
  Info
} from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

const MAHARASHTRA_INDIGENOUS_BREEDS = [
  {
    id: 'khillar',
    name: 'Khillar Cattle (खिलार गाय/बैल)',
    nativeTract: 'Satara, Solapur, Sangli (Southern Maharashtra)',
    type: 'Draught Breed (अतिशय चपळ व काटक जात)',
    diseaseResistanceIndex: 94,
    heatTolerance: 'Exceptional (46°C pasture tolerance)',
    fmdVulnerability: 'Moderate to Low (Thick dermal defense)',
    characteristics: [
      'Long, sweeping horns curving backwards with pointed tips',
      'Grey-white coat color with dark markings on head & neck',
      'Extremely agile, high endurance under arid tropical conditions',
      'Low incidence of reproductive disorders'
    ],
    semenCenters: 'Central Semen Station, Uruli Kanchan (Pune) & Karad (Satara)',
    conservationStatus: 'State Priority Conservation (NBAGR Accredited)'
  },
  {
    id: 'dangi',
    name: 'Dangi Cattle (डांगी जात)',
    nativeTract: 'Ahmednagar (Akole), Nashik (Igatpuri), Western Ghats',
    type: 'High Rainfall & Hilly Terrain Specialist',
    diseaseResistanceIndex: 96,
    heatTolerance: 'High humidity & extreme monsoon rainfall resistance',
    fmdVulnerability: 'Very Low (Hard black hooves resist foot rot & pododermatitis)',
    characteristics: [
      'Distinctive black and white or red and white spotted patchy coat',
      'Special oily skin secretion that repels torrential monsoon rain',
      'Hard flint-like black hooves impervious to gravel and waterlogging',
      'High resistance to tick-borne hemoprotozoan diseases'
    ],
    semenCenters: 'Govt. Bull Mother Farm, Igatpuri, Dist. Nashik',
    conservationStatus: 'Heritage Hilly Breed Conservation'
  },
  {
    id: 'deoni',
    name: 'Deoni Cattle (देवणी जात)',
    nativeTract: 'Latur, Nanded, Osmanabad (Marathwada)',
    type: 'Dual Purpose (Milk + Medium Draught)',
    diseaseResistanceIndex: 88,
    heatTolerance: 'Very High (Semi-arid drought tract)',
    fmdVulnerability: 'Moderate',
    characteristics: [
      'Prominent drooping ears and convex forehead with white-black spots',
      'Docile temperament, average lactation yield of 1,200–1,800 kg',
      'High milk A2 beta-casein purity',
      'Thrives on agricultural dry residues (Kadba, Tur straw)'
    ],
    semenCenters: 'Cattle Breeding Farm, Someshwar & Latur AI Hub',
    conservationStatus: 'Marathwada Native Dairy Heritage'
  },
  {
    id: 'pandharpuri',
    name: 'Pandharpuri Buffalo (पंढरपुरी म्हैस)',
    nativeTract: 'Solapur, Kolhapur, Sangli, Satara',
    type: 'High Fat Dairy Buffalo (लांब तलवारीसारखी शिंगे)',
    diseaseResistanceIndex: 92,
    heatTolerance: 'High (Adapted to dry drought conditions of Bhima river basin)',
    fmdVulnerability: 'Low to Moderate',
    characteristics: [
      'Characteristic sword-shaped flat horns reaching up to shoulder blade (45–50 cm)',
      'High reproductive efficiency (Short calving interval of 13 months)',
      'High milk fat percentage (7.5% – 8.5%) and high solid-not-fat (SNF)',
      'Extremely hardy during summer fodder scarcity'
    ],
    semenCenters: 'Semen Production Station, Kolhapur & Pune',
    conservationStatus: 'State Accredited Elite Dairy Breed'
  }
]

export default function BreedRegistryPage() {
  const [search, setSearch] = useState('')
  const [selectedBreed, setSelectedBreed] = useState(MAHARASHTRA_INDIGENOUS_BREEDS[0])

  const filtered = MAHARASHTRA_INDIGENOUS_BREEDS.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.nativeTract.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12 text-slate-100 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Dna className="w-4 h-4 text-emerald-400" />
            <span>NBAGR &amp; Maharashtra DAH Genetic Mission • देशी गोवंश संवर्धन</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Maharashtra Indigenous Cattle &amp; Buffalo Breed Registry
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Genetic lineage preservation, disease-resistance profiling, and artificial insemination (AI) semen bank locator for native Maharashtra livestock.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search indigenous breed (e.g. Khillar, Dangi, Deoni, Pandharpuri)..."
          className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* 2-Column Split: Breed Grid + Genetic Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-5 space-y-3">
          {filtered.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBreed(b)}
              className={`w-full p-4 rounded-2xl text-left border transition flex items-center justify-between ${
                selectedBreed.id === b.id
                  ? 'bg-slate-900 border-emerald-400 shadow-lg shadow-emerald-950'
                  : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-emerald-400 block">{b.conservationStatus}</span>
                <h4 className="text-sm font-bold text-white leading-snug">{b.name}</h4>
                <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {b.nativeTract}
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 ${selectedBreed.id === b.id ? 'text-emerald-400' : 'text-slate-600'}`} />
            </button>
          ))}
        </div>

        <div className="md:col-span-7">
          {selectedBreed && (
            <Card className="p-6 rounded-3xl border border-emerald-500/30 space-y-5 bg-slate-900/90 shadow-2xl">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                  {selectedBreed.type}
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">{selectedBreed.name}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  <strong>Native Breeding Tract:</strong> {selectedBreed.nativeTract}
                </p>
              </div>

              {/* Disease Resistance Radar */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Disease Resistance</span>
                  <strong className="text-xl font-black text-emerald-400">{selectedBreed.diseaseResistanceIndex}</strong>
                  <span className="text-[9px] text-slate-500 block">/ 100 Index</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Heat Tolerance</span>
                  <strong className="text-xs font-bold text-amber-300 block mt-1">{selectedBreed.heatTolerance}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">FMD Vulnerability</span>
                  <strong className="text-xs font-bold text-sky-300 block mt-1">{selectedBreed.fmdVulnerability}</strong>
                </div>
              </div>

              {/* Phenotypic Characteristics */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Breed Characteristics &amp; Adaptability Traits
                </h4>
                <ul className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 text-xs">
                  {selectedBreed.characteristics.map((char, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-200">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Semen Station Linkages */}
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs space-y-1">
                <strong className="text-emerald-300 block text-[11px] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Certified Semen Stations &amp; AI Straw Availability:
                </strong>
                <p className="text-slate-300 text-[11px]">{selectedBreed.semenCenters}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
