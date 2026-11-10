// Cross-tab and live component sync for real-time catalog state updates
const CHANNEL_NAME = 'luxe_drape_catalog_events'

export const notifyCatalogUpdated = (action = 'updated', data = {}) => {
  try {
    if (typeof window !== 'undefined') {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel(CHANNEL_NAME)
        channel.postMessage({ action, data, timestamp: Date.now() })
        channel.close()
      }
      localStorage.setItem('luxe_drape_last_update', JSON.stringify({ action, timestamp: Date.now() }))
    }
  } catch (e) {
    console.debug('[Luxe Drape] Broadcast notification skipped:', e.message)
  }
}

export const subscribeToCatalogUpdates = (onUpdate) => {
  if (typeof window === 'undefined') return () => {}

  let channel = null
  if ('BroadcastChannel' in window) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME)
      channel.onmessage = (event) => {
        onUpdate(event.data)
      }
    } catch (e) {
      console.debug('[Luxe Drape] BroadcastChannel not available:', e.message)
    }
  }

  const handleStorage = (e) => {
    if (e.key === 'luxe_drape_last_update' && e.newValue) {
      try {
        const data = JSON.parse(e.newValue)
        onUpdate(data)
      } catch (err) {
        // ignore parse errors
      }
    }
  }

  window.addEventListener('storage', handleStorage)

  return () => {
    if (channel) channel.close()
    window.removeEventListener('storage', handleStorage)
  }
}
