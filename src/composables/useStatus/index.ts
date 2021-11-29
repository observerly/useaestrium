import {
  onUnmounted, ref, Ref, watch
} from 'vue'

import {
  useEventSource
} from '@vueuse/core'

import {
  UseStatusResponse
} from '../../types'

export interface UseStatusOptions {
  /**
   *
   * URL/ip:port/host to the remote observatory NAT
   * @default 'http://0.0.0.0:8220'
   */
  url: string
}

export type UseStatusReturn = {
  status: Ref<UseStatusResponse>
}

export interface UseStatusProps extends Partial<UseStatusReturn> {}

// Default status:
const defaultStatus = {
  isOffline: true,
  isConnected: false,
  isSlewing: false,
  isTracking: false,
  alt: Infinity,
  az: Infinity
}

/**
 * Reactive useTelescopeStatus()
 * Returns the reactive status of a PlaneWave Astrograph Telescope
 *
 * @param options of type UseTelescopeStatusOptions
 * @output reactive status
 */
export const useStatus = (
  options: UseStatusOptions
): UseStatusReturn => {
  const { url } = options

  // Connect to the Telescope Status over server-sent events:
  const { data, close, error } = useEventSource(`${url}/status`)

  const status = ref<UseStatusResponse>(defaultStatus)

  // Close the event source onUnmounted lifecycle hook:
  onUnmounted(() => {
    close()
  })

  // Watch for an error signal from the status server-sent event:
  watch(error, () => {
    if (error.value) {
      if (error.value.type === 'error') {
        status.value = defaultStatus
      }
    }
  })

  // Watch for an change of response data from the status server-sent event:
  watch(data, () => {
    if (data.value) {
      status.value = JSON.parse(data.value)
    }
  })

  return {
    status
  }
}