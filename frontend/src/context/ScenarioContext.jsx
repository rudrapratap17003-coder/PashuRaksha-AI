import React, { createContext, useContext, useState } from 'react'
import { SCENARIOS, SCENARIO_DATA } from '../data/scenarios'

const ScenarioContext = createContext(null)

export function ScenarioProvider({ children }) {
  const [currentScenario, setCurrentScenario] = useState(SCENARIOS.RAMPUR_OUTBREAK)

  const scenarioData = SCENARIO_DATA[currentScenario] || SCENARIO_DATA.RAMPUR_OUTBREAK

  const setScenario = (scenarioKey) => {
    if (SCENARIOS[scenarioKey]) {
      setCurrentScenario(scenarioKey)
    }
  }

  return (
    <ScenarioContext.Provider
      value={{
        currentScenario,
        scenarioData,
        setScenario,
        scenarios: SCENARIOS,
      }}
    >
      {children}
    </ScenarioContext.Provider>
  )
}

export function useScenario() {
  const context = useContext(ScenarioContext)
  if (!context) {
    throw new Error('useScenario must be used within a ScenarioProvider')
  }
  return context
}
