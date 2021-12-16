/**
 * @jest-environment jsdom
 */
import {
  beforeEach,
  describe,
  expect,
  it
} from '@jest/globals'

import {
  nextTick
} from 'vue'

import {
  useObserver
} from './'

import {
  useSetup
} from '../../utils'

describe('useObserver', () => {
  const baseURL = 'http://localhost:3000'

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: new URL(baseURL),
      writable: true
    })

    window.location.search = ''
    window.location.hash = ''
  })

  it('Should Be Defined', () => {
    expect(useObserver).toBeDefined()
  })

  it('Should Be At Mauna Kea Default', () => {
    useSetup(async () => {
      const { longitude, latitude } = useObserver({
      })

      expect(longitude.value).toBe(-155.824615)
      expect(latitude.value).toBe(20.005039)
    })
  })

  it('Should Be At Where We Tell It Via Params', () => {
    useSetup(async () => {
      const { longitude, latitude } = useObserver({
      })

      window.location.search = '?longitude=18.4904101&latitude=-22.9576402'

      await nextTick()

      expect(longitude.value).toBe(18.4904101)
      expect(latitude.value).toBe(-22.9576402)
    })
  })

  it('Should Be At Where We Tell It Via Props', () => {
    useSetup(async () => {
      const { longitude, latitude } = useObserver({
        longitude: -24.622997508,
        latitude: -70.40249839
      })

      window.location.search = '?longitude=18.4904101&latitude=-22.9576402'

      await nextTick()

      expect(longitude.value).toBe(-24.622997508)
      expect(latitude.value).toBe(-70.40249839)
    })
  })
})