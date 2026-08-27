/**
 * PASHURAKSHA AI — Centralized Constants & Design System Tokens
 */

// Canonical Decision-Support Risk Levels
export const RISK_LEVELS = {
  LOW: {
    label: 'LOW',
    min: 0,
    max: 29,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dot: 'bg-emerald-500',
    description: 'Routine monitoring. Normal vitals reported.',
  },
  MODERATE: {
    label: 'MODERATE',
    min: 30,
    max: 59,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    dot: 'bg-amber-500',
    description: 'Elevated health risk. Close observation advised.',
  },
  HIGH: {
    label: 'HIGH',
    min: 60,
    max: 79,
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
    dot: 'bg-orange-500',
    description: 'High risk detected. Veterinary consultation strongly recommended.',
  },
  CRITICAL: {
    label: 'CRITICAL',
    min: 80,
    max: 100,
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    dot: 'bg-rose-500',
    description: 'Critical health anomaly. Urgent veterinary intervention required.',
  },
}

// User Roles
export const USER_ROLES = {
  FARMER: 'farmer',
  VETERINARIAN: 'veterinarian',
  AUTHORITY: 'authority',
  ADMIN: 'admin',
}

// Common Animal Species in India
export const ANIMAL_SPECIES = [
  'Cattle (Cow)',
  'Buffalo',
  'Goat',
  'Sheep',
  'Pig',
  'Poultry',
  'Other',
]

// Core Symptoms Monitored
export const SYMPTOM_LIST = [
  { id: 'fever', label: 'Fever / High Temperature', severityWeight: 15 },
  { id: 'cough', label: 'Coughing / Wheezing', severityWeight: 10 },
  { id: 'nasal_discharge', label: 'Nasal Discharge', severityWeight: 10 },
  { id: 'reduced_appetite', label: 'Loss of Appetite / Not Eating', severityWeight: 12 },
  { id: 'diarrhea', label: 'Diarrhea', severityWeight: 15 },
  { id: 'lethargy', label: 'Extreme Lethargy / Weakness', severityWeight: 12 },
  { id: 'reduced_milk', label: 'Sudden Drop in Milk Yield', severityWeight: 10 },
  { id: 'difficulty_breathing', label: 'Difficulty Breathing / Panting', severityWeight: 20 },
  { id: 'salivation', label: 'Excessive Salivation / Drooling', severityWeight: 15 },
  { id: 'lesions', label: 'Blisters / Mouth / Foot Lesions', severityWeight: 25 },
  { id: 'swelling', label: 'Swelling in Neck / Jaw / Limbs', severityWeight: 15 },
]

// Disclaimer Message
export const LEGAL_DISCLAIMER =
  'PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. It does not replace professional veterinary diagnosis or treatment.'
