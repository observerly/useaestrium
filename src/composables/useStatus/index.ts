import {
  computed, ComputedRef, onUnmounted, ref, Ref, watch
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
   * @default 'http://0.0.0.0:5000'
   */
  url: string
}

export type UseStatusReturn = {
  /**
   * Reactive useTelescopeStatus() object
   * Returns the reactive status of a PlaneWave Astrograph Telescope
   *
   * @param options of type UseTelescopeStatusOptions
   * @output reactive status
   */
  status: Ref<UseStatusResponse>
  /**
   *
   * References when there is no connection to the active mount server:
   *
   * @default false
   */
  isOffline: ComputedRef<boolean>
  /**
   *
   * Does the PWI4 client have an active connection to the mount hardware?
   *
   * @default false
   */
  isConnected: ComputedRef<boolean>
  /**
   *
   * When the mount is first commanded to follow a new target, this flag reports
   * true while the mount is moving to acquire the target. Once the target is
   * acquired, or if the movement is stopped, this flag reports false.
   *
   * If the PWI4 client is not connected to the mount, the value will be false.
   *
   * @default false
   */
  isSlewing: ComputedRef<boolean>
  /**
   *
   * When the mount is trying to follow a target, this flag reports true.
   * If isSlewing is also true, then the mount has not yet acquired the
   * target. When the mount is stopped, this flag reports false.
   *
   * @default false
   */
  isTracking: ComputedRef<boolean>
  /**
   *
   * The telescope’s current position in degrees of altitude. 0 degrees is the
   * horizon, and 90 degrees is zenith. This value incorporates pointing
   * model corrections.
   *
   * If PWI4 is not connected to the mount, this value will be 0.
   *
   * @default Infinity
   */
  alt: ComputedRef<number>
  /**
   *
   * The telescope’s current position in degrees of azimuth. North is defined
   * as 0 degrees, and East is 90 degrees. This value incorporates pointing
   * model corrections.
   *
   * If PWI4 is not connected to the mount, this value will be 0.
   *
   * @default Infinity
   */
  az: ComputedRef<number>
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
 * Reactive useStatus()
 * Returns the reactive status of a PlaneWave Astrograph Telescope
 *
 * @param options of type UseStatusOptions
 * @output reactive status
 */
export const useStatus = (
  options: UseStatusOptions
): UseStatusReturn => {
  const { url = 'http://0.0.0.0:5000' } = options

  // Connect to the Telescope Status over server-sent events:
  const { data, close, error } = useEventSource(`${url}/status`)

  const status = ref<UseStatusResponse>(defaultStatus)

  const isOffline = computed(() => {
    return status.value.isOffline
  })

  const isConnected = computed(() => {
    return status.value.isConnected
  })

  const isSlewing = computed(() => {
    return status.value.isSlewing
  })

  const isTracking = computed(() => {
    return status.value.isTracking
  })

  const alt = computed(() => {
    return status.value.alt
  })

  const az = computed(() => {
    return status.value.az
  })

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
    status,
    isOffline,
    isConnected,
    isSlewing,
    isTracking,
    alt,
    az
  }
}