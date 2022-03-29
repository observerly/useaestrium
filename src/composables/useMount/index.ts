import {
  onMounted, onUnmounted
} from 'vue'

import {
  EquatorialCoordinate,
  HorizontalCoordinate,
  convertDegreeToHour
} from '@observerly/polaris'

import {
  UseStatusResponse
} from '../../types'

export interface UseMountOptions {
  /**
   *
   * URL/ip:port/host to the remote observatory NAT
   * @default 'http://0.0.0.0:8220'
   */
  url: string
  /**
   *
   * Immediately Connect to the Mount (optional)
   * @default true
   */
  immediate?: boolean
}

export type UseMountReturn = {
  connect: () => Promise<void>
  enable: () => Promise<void>
  disconnect: () => Promise<void>
  disable: () => Promise<void>
  goToEquatorialCoordinate: (params: EquatorialCoordinate) => Promise<any>
  goToHorizontalCoordinate: (params: HorizontalCoordinate) => Promise<any>
  park: () => Promise<void>
  stop: () => Promise<void>
}

export interface UseMountProps extends Partial<UseMountReturn> {}

// The namespace for the Planewave API endpoint construction:
const namespace = 'mount'

// Default mount options:
const defaultMountOptions = {
  // Default URL as given in the PlaneWave API documents:
  url: 'http://0.0.0.0:8220',
  // Always attempt to connect onMount():
  immediate: true
}

/**
 * Reactive useMount()
 * Returns a reactive PlaneWave telescope mount instance via the PlanewaveAPI
 *
 * @param options of type UseMountOptions
 * @output calls enable() and connect() immediately onMounted Vue lifecycle hook.
 * @returns mount connect method(), mount disconnect() method and goToEquatorialCoordinate().
 */
export const useMount = (options: UseMountOptions = defaultMountOptions): UseMountReturn => {
  const { url, immediate = true } = options

  const baseURL = `${url}/${namespace}`

  const connect = async (): Promise<void> => {
    await fetch(`${baseURL}/connect`)
  }

  const enable = async (): Promise<void> => {
    await fetch(`${baseURL}/enable`)
  }

  const disconnect = async (): Promise<void> => {
    await fetch(`${baseURL}/disconnect`)
  }

  const disable = async (): Promise<void> => {
    await fetch(`${baseURL}/disable`)
  }

  const stop = async (): Promise<void> => {
    await fetch(`${baseURL}/stop`)
  }

  const park = async (): Promise<void> => {
    await fetch(`${baseURL}/park`)
  }

  const goToEquatorialCoordinate = async (
    params: EquatorialCoordinate
  ): Promise<UseStatusResponse | undefined> => {
    const { ra, dec } = params

    const ha = convertDegreeToHour(ra)

    const uri: URL = new URL(`${baseURL}/goto/coordinates/equatorial`)

    uri.searchParams.append('ra_hours', ha.toString())

    uri.searchParams.append('dec_degs', dec.toString())

    const response = await fetch(uri.toString(), {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.json()
  }

  const goToHorizontalCoordinate = async (
    params: HorizontalCoordinate
  ): Promise<UseStatusResponse | undefined> => {
    const { alt, az } = params

    const uri: URL = new URL(`${baseURL}/goto/coordinates/horizontal`)

    uri.searchParams.append('alt_degs', alt.toString())

    uri.searchParams.append('az_degs', az.toString())

    const response = await fetch(uri.toString(), {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.json()
  }

  onMounted(() => {
    if (immediate) {
      enable()
      connect()
    }
  })

  onUnmounted(() => {
    stop()
    disconnect()
  })

  return {
    connect,
    enable,
    disconnect,
    disable,
    goToEquatorialCoordinate,
    goToHorizontalCoordinate,
    park,
    stop
  }
}