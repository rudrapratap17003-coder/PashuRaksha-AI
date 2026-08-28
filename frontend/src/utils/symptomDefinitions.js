/**
 * 11 Core Clinical Symptoms Definition & Metadata
 */

export const CORE_SYMPTOMS = [
  {
    key: 'fever',
    label: 'Fever / High Temperature',
    description: 'Hot ears/horns, shivering, dry muzzle, elevated body temp',
    icon: 'Thermometer',
    category: 'Vitals',
    severityWeight: 'high'
  },
  {
    key: 'cough',
    label: 'Coughing',
    description: 'Persistent dry or wet cough, throat irritation',
    icon: 'Wind',
    category: 'Respiratory',
    severityWeight: 'medium'
  },
  {
    key: 'nasal_discharge',
    label: 'Nasal Discharge',
    description: 'Mucus, watery, or thick discharge from nostrils',
    icon: 'Droplets',
    category: 'Respiratory',
    severityWeight: 'medium'
  },
  {
    key: 'reduced_appetite',
    label: 'Reduced Appetite',
    description: 'Refusing fodder, diminished feed intake, chewing less',
    icon: 'UtensilsCrossed',
    category: 'Digestive',
    severityWeight: 'medium'
  },
  {
    key: 'diarrhea',
    label: 'Diarrhea / Loose Dung',
    description: 'Watery, foul-smelling, or bloody stool',
    icon: 'AlertCircle',
    category: 'Digestive',
    severityWeight: 'medium'
  },
  {
    key: 'lethargy',
    label: 'Lethargy / Weakness',
    description: 'Lying down excessively, slow movement, dull demeanor',
    icon: 'Moon',
    category: 'General',
    severityWeight: 'medium'
  },
  {
    key: 'reduced_milk',
    label: 'Sudden Milk Drop',
    description: 'Sharp decline in daily milk production volume',
    icon: 'Milk',
    category: 'Production',
    severityWeight: 'medium'
  },
  {
    key: 'difficulty_breathing',
    label: 'Difficulty Breathing',
    description: 'Rapid open-mouth panting, flared nostrils, wheezing',
    icon: 'HeartPulse',
    category: 'Critical Vitals',
    severityWeight: 'critical'
  },
  {
    key: 'salivation',
    label: 'Excessive Salivation / Drooling',
    description: 'Frothing at mouth, continuous stringy drool',
    icon: 'Waves',
    category: 'Critical Signs',
    severityWeight: 'critical'
  },
  {
    key: 'lesions',
    label: 'Blisters / Lesions / Sores',
    description: 'Vesicles or ulcers in mouth, on tongue, hooves, or teats',
    icon: 'AlertTriangle',
    category: 'Critical Signs',
    severityWeight: 'critical'
  },
  {
    key: 'swelling',
    label: 'Swelling / Edema / Lameness',
    description: 'Swollen throat/neck, swollen legs, limping when walking',
    icon: 'ActivitySquare',
    category: 'Physical Signs',
    severityWeight: 'medium'
  }
]
