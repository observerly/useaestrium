/**
 * @jest-environment jsdom
 */
import {
  describe,
  expect,
  it
} from '@jest/globals'

import {
  ref
} from 'vue'

import {
  useEquatorialCoordinate
} from './'

import {
  useSetup
} from '../../utils'

describe('useEquatorialCoordinate', () => {
  it('Should Be Defined', () => {
    expect(useEquatorialCoordinate).toBeDefined()
  })

  it('Betelgeuse Should Be ', () => {
    useSetup(() => {
      // Define a star at a known Equatorial Coordinate:
      const betelgeuse = {
        ra: 88.7929583,
        dec: 7.4070639
      }

      //  For testing, we will fix the longitude and latitude to be Manua Kea, Hawaii, US
      const observer = ref({
        latitude: 19.820611,
        longitude: -155.468094,
        elevation: 0
      })

      // For testing we need to specify a date because most calculations are
      // differential w.r.t a time component. We set it to the author's birthday:
      const datetime = ref(new Date('2021-05-14T00:00:00.000+00:00'))

      const { alt, az } = useEquatorialCoordinate({
        coordinate: betelgeuse,
        observer,
        datetime
      })

      expect(alt.value).toBeCloseTo(72.78539444063765, 1)
      expect(az.value).toBeCloseTo(134.44877920325155, 1)
    })
  })
})