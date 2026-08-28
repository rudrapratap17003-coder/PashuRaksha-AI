/**
 * 11 Core Clinical Symptoms Definition & Metadata
 */

export const CORE_SYMPTOMS = [
  {
    key: 'fever',
    id: 'fever',
    name: 'Fever / High Temp',
    hindiName: 'तेज बुखार',
    label: 'Fever / High Temperature',
    description: 'Hot ears/horns, shivering, dry muzzle, elevated body temp',
    icon: '🌡️',
    category: 'Vitals',
    severityWeight: 'high'
  },
  {
    key: 'cough',
    id: 'cough',
    name: 'Coughing',
    hindiName: 'खांसी / हांफना',
    label: 'Coughing',
    description: 'Persistent dry or wet cough, throat irritation',
    icon: '💨',
    category: 'Respiratory',
    severityWeight: 'medium'
  },
  {
    key: 'nasal_discharge',
    id: 'nasal_discharge',
    name: 'Nasal Discharge',
    hindiName: 'नाक से पानी / मवाद',
    label: 'Nasal Discharge',
    description: 'Mucus, watery, or thick discharge from nostrils',
    icon: '💧',
    category: 'Respiratory',
    severityWeight: 'medium'
  },
  {
    key: 'reduced_appetite',
    id: 'reduced_appetite',
    name: 'Reduced Appetite',
    hindiName: 'चारा न खाना (भूख कम)',
    label: 'Reduced Appetite',
    description: 'Refusing fodder, diminished feed intake, chewing less',
    icon: '🌾',
    category: 'Digestive',
    severityWeight: 'medium'
  },
  {
    key: 'diarrhea',
    id: 'diarrhea',
    name: 'Diarrhea / Loose Dung',
    hindiName: 'दस्त / पतला गोबर',
    label: 'Diarrhea / Loose Dung',
    description: 'Watery, foul-smelling, or bloody stool',
    icon: '⚠️',
    category: 'Digestive',
    severityWeight: 'medium'
  },
  {
    key: 'lethargy',
    id: 'lethargy',
    name: 'Lethargy / Weakness',
    hindiName: 'सुस्ती / कमजोरी',
    label: 'Lethargy / Weakness',
    description: 'Lying down excessively, slow movement, dull demeanor',
    icon: '💤',
    category: 'General',
    severityWeight: 'medium'
  },
  {
    key: 'reduced_milk',
    id: 'reduced_milk',
    name: 'Sudden Milk Drop',
    hindiName: 'दूध में भारी गिरावट',
    label: 'Sudden Milk Drop',
    description: 'Sharp decline in daily milk production volume',
    icon: '🥛',
    category: 'Production',
    severityWeight: 'medium'
  },
  {
    key: 'difficulty_breathing',
    id: 'difficulty_breathing',
    name: 'Difficulty Breathing',
    hindiName: 'सांस लेने में तकलीफ',
    label: 'Difficulty Breathing',
    description: 'Rapid open-mouth panting, flared nostrils, wheezing',
    icon: '🫁',
    category: 'Critical Vitals',
    severityWeight: 'critical'
  },
  {
    key: 'salivation',
    id: 'salivation',
    name: 'Excessive Salivation',
    hindiName: 'मुंह से लगातार लार गिरना',
    label: 'Excessive Salivation / Drooling',
    description: 'Frothing at mouth, continuous stringy drool',
    icon: '🌊',
    category: 'Critical Signs',
    severityWeight: 'critical'
  },
  {
    key: 'lesions',
    id: 'lesions',
    name: 'Blisters / Lesions',
    hindiName: 'मुंह / खुर में छाले व घाव',
    label: 'Blisters / Lesions / Sores',
    description: 'Vesicles or ulcers in mouth, on tongue, hooves, or teats',
    icon: '🩹',
    category: 'Critical Signs',
    severityWeight: 'critical'
  },
  {
    key: 'swelling',
    id: 'swelling',
    name: 'Swelling / Lameness',
    hindiName: 'गले / पैर में सूजन व लंगड़ाना',
    label: 'Swelling / Edema / Lameness',
    description: 'Swollen throat/neck, swollen legs, limping when walking',
    icon: '🦵',
    category: 'Physical Signs',
    severityWeight: 'medium'
  }
]

export const SYMPTOM_DEFINITIONS = CORE_SYMPTOMS
