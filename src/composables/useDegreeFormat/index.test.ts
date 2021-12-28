/**
 * @jest-environment jsdom
 */
import {
  describe,
  expect,
  it
} from '@jest/globals'

import {
  useDegreeFormat
} from './'

import type {
  EquatorialCoordinate
} from '@observerly/celestia'

import {
  useSetup
} from '../../utils'

describe('useDegreeFormat', () => {
  // Define a star at a known Equatorial Coordinate:
  const betelgeuse: EquatorialCoordinate = {
    ra: 88.7929583,
    dec: 7.4070639
  }

  it('Should Be Defined', () => {
    expect(useDegreeFormat).toBeDefined()
  })

  it('Betelgeuse Right Ascension Has An Humanised HMS Of 05h 55m 10.31s', () => {
    useSetup(() => {
      const { degreeFormat } = useDegreeFormat(betelgeuse.ra, {
        format: 'hms'
      })

      expect(degreeFormat.value).toBe('05ʰ 55ᵐ 10.31ˢ')
    })
  })

  it('Betelgeuse Declination Has An Humanised DMS Of 7º 24\' 25.43"', () => {
    useSetup(() => {
      const { degreeFormat } = useDegreeFormat(betelgeuse.dec, {
        format: 'dms'
      })

      expect(degreeFormat.value).toBe('7º 24\' 25.43"')
    })
  })
})