import {
  onMounted, onUnmounted
} from 'vue'

import {
  UseStatusResponse
} from '../../types'

export interface RotatorTargetParams {
  target: string
}

export interface UseRotatorOptions {
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

export type UseRotatorReturn = {
  enable: () => Promise<void>
  disable: () => Promise<void>
  goToMechTarget: (params: RotatorTargetParams) => Promise<UseStatusResponse>
  goToFieldTarget: (params: RotatorTargetParams) => Promise<UseStatusResponse>
  stop: () => Promise<void>
}

export interface UseFocuserProps extends Partial<UseRotatorReturn> {}

// The namespace for the Planewave API endpoint construction:
const namespace = 'rotator'

// Default rotator options:
const defaultRotatorOptions = {
  // Default URL as given in the PlaneWave API documents:
  url: 'http://0.0.0.0:8220',
  // Always attempt to connect onMount():
  immediate: true
}

export const useRotator = (options: UseRotatorOptions = defaultRotatorOptions): UseRotatorReturn => {
  const { url, immediate } = options

  const baseURL = `${url}/${namespace}`

  const enable = async (): Promise<void> => {
    await fetch(`${baseURL}/enable`)
  }

  const disable = async (): Promise<void> => {
    await fetch(`${baseURL}/disable`)
  }

  const goToMechTarget = async (
    params: RotatorTargetParams
  ): Promise<UseStatusResponse> => {
    const uri: URL = new URL(`${baseURL}/goto/mech/target`)

    uri.searchParams.append('target', params.target)

    const response = await fetch(uri.toString(), {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.json()
  }
  const goToFieldTarget = async (
    params: RotatorTargetParams
  ): Promise<UseStatusResponse> => {
    const uri: URL = new URL(`${baseURL}/goto/field/target`)

    uri.searchParams.append('target', params.target)

    const response = await fetch(uri.toString(), {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.json()
  }

  const stop = async (): Promise<void> => {
    await fetch(`${baseURL}/stop`)
  }

  onMounted(() => {
    if (immediate) {
      enable()
    }
  })

  onUnmounted(() => {
    stop()
    disable()
  })

  return {
    enable,
    disable,
    goToMechTarget,
    goToFieldTarget,
    stop
  }
}