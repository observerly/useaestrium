import {
  onMounted, onUnmounted
} from 'vue'

import {
  EquatorialCoordinate, convertDegreesToHours
} from '@observerly/celestia'

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

// The namespace for the Planewave API endpoint construction:
const namespace = 'mount'

// Default mount options:
const defaultMountOptions = {
  url: 'http://0.0.0.0:8220',
  immediate: true
}

/**
 * Reactive useMount()
 * Returns a reactive PlaneWave telescope mount instance via the PlanewaveAPI
 *
 * @param options of type UseMountOptions
 * @output calls connect() immediately onMounted Vue lifecycle hook.
 * @returns mount connect method(), mount disconnect() method and goToEquatorialCoordinate().
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useMount = (options: UseMountOptions = defaultMountOptions) => {
  const { url, immediate = true } = options

  const connect = async () => {
    await fetch(`${url}/${namespace}/connect`)
  }

  const disconnect = async () => {
    await fetch(`${url}/${namespace}/disconnect`)
  }

  const goToEquatorialCoordinate = async (params: EquatorialCoordinate) => {
    const { ra, dec } = params

    const ha = convertDegreesToHours(ra)

    const uri: URL = new URL(`${url}/${namespace}/goto/coordinates/equatorial`)

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

  onMounted(() => {
    if (immediate) {
      connect()
    }
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    connect,
    disconnect,
    goToEquatorialCoordinate
  }
}

export type UseMountReturn = ReturnType<typeof useMount>
