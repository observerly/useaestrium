import {
  onMounted, onUnmounted
} from 'vue'

import {
  UseStatusResponse
} from '../../types'

export interface FocuserTargetParams {
  target: string
}

export interface UseFocuserOptions {
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

export type UseFocuserReturn = {
  enable: () => Promise<void>
  disable: () => Promise<void>
  goToFocuserTarget: (params: FocuserTargetParams) => Promise<UseStatusResponse>
  stop: () => Promise<void>
}

export interface UseFocuserProps extends Partial<UseFocuserReturn> {}

// The namespace for the Planewave API endpoint construction:
const namespace = 'focuser'

// Default focuser options:
const defaultFocuserOptions = {
  // Default URL as given in the PlaneWave API documents:
  url: 'http://0.0.0.0:8220',
  // Always attempt to connect onMount():
  immediate: true
}

export const useFocuser = (options: UseFocuserOptions = defaultFocuserOptions): UseFocuserReturn => {
  const { url, immediate } = options

  const baseURL = `${url}/${namespace}`

  const enable = async (): Promise<void> => {
    await fetch(`${baseURL}/enable`)
  }

  const disable = async (): Promise<void> => {
    await fetch(`${baseURL}/disable`)
  }

  const goToFocuserTarget = async (
    params: FocuserTargetParams
  ): Promise<UseStatusResponse> => {
    const uri: URL = new URL(`${baseURL}/goto`)

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
    goToFocuserTarget,
    stop
  }
}