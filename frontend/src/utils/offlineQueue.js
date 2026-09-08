/**
 * PASHURAKSHA AI — IndexedDB Offline Sync Queue
 * Stores livestock health reports locally when network connectivity is absent,
 * and automatically replays them when network connectivity is restored.
 */

const DB_NAME = 'PashuRakshaOfflineDB'
const DB_VERSION = 1
const STORE_NAME = 'offline_reports'

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'))
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function dispatchQueueUpdate(count) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pashuraksha-offline-queue-update', { detail: { count } }))
  }
}

export async function saveOfflineReport(reportData) {
  try {
    const db = await openDB()
    const id = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    const entry = {
      id,
      data: reportData,
      createdAt: new Date().toISOString(),
      status: 'pending_sync'
    }

    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.put(entry)
      req.onsuccess = () => resolve(entry)
      req.onerror = () => reject(req.error)
    })

    const count = await getPendingCount()
    dispatchQueueUpdate(count)
    return entry
  } catch (err) {
    console.error('[OFFLINE QUEUE] Failed to save offline report:', err)
    try {
      const existing = JSON.parse(localStorage.getItem('pashuraksha_offline_reports') || '[]')
      const entry = {
        id: `offline-${Date.now()}`,
        data: reportData,
        createdAt: new Date().toISOString(),
        status: 'pending_sync'
      }
      existing.push(entry)
      localStorage.setItem('pashuraksha_offline_reports', JSON.stringify(existing))
      dispatchQueueUpdate(existing.length)
      return entry
    } catch {
      return null
    }
  }
}

export async function getOfflineReports() {
  try {
    const db = await openDB()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    try {
      return JSON.parse(localStorage.getItem('pashuraksha_offline_reports') || '[]')
    } catch {
      return []
    }
  }
}

export async function removeOfflineReport(id) {
  try {
    const db = await openDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.delete(id)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch {
    try {
      const existing = JSON.parse(localStorage.getItem('pashuraksha_offline_reports') || '[]')
      const filtered = existing.filter((item) => item.id !== id)
      localStorage.setItem('pashuraksha_offline_reports', JSON.stringify(filtered))
    } catch {
      // Ignore
    }
  }
  const count = await getPendingCount()
  dispatchQueueUpdate(count)
}

export async function getPendingCount() {
  const reports = await getOfflineReports()
  return reports.length
}

export async function syncReports(apiClient) {
  const reports = await getOfflineReports()
  if (!reports || reports.length === 0) {
    return { synced: 0, failed: 0, total: 0 }
  }

  let synced = 0
  let failed = 0

  for (const item of reports) {
    try {
      await apiClient.post('/health-reports', item.data)
      await removeOfflineReport(item.id)
      synced++
    } catch (err) {
      console.warn(`[OFFLINE SYNC] Failed to sync report ${item.id}:`, err)
      failed++
    }
  }

  const remainingCount = await getPendingCount()
  dispatchQueueUpdate(remainingCount)

  return { synced, failed, total: reports.length }
}
