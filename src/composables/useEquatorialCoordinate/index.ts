import {
  readonly,
  ref,
  watchEffect
} from 'vue'

import type {
  Ref
} from 'vue'

import {
  convertEquatorialToHorizontal
} from '@observerly/celestia'

import type {
  HorizontalCoordinate,
  EquatorialCoordinate
} from '@observerly/celestia'

export interface Observer {
  /**
   *
   * Geographic longitude of the observer (in unit degree)
   * @default -22.95764
   *
   */
  longitude: number
  /**
   *
   * Geographic latitude of the observer (in unit degree)
   * @default 18.49041
   *
   */
  latitude: number
  /**
   *
   * Elevation (above sea level) of the observer (in unit meteres)
   * @default 0
   *
   */
  elevation: number
}

export interface UseEquatorialCoordinateOptions {
  /**
   *
   * Coordinate { ra, dec } of the observed celestial target:
   *
   */
  coordinate: EquatorialCoordinate
  /**
   *
   * A datetime reference:
   *
   */
  datetime: Ref<Date>
  /**
   *
   * An observer object reference:
   *
   */
  observer: Ref<Observer>
}

type RefKeys<T, K extends keyof T = keyof T> = {
  // eslint-disable-next-line no-unused-vars
  [key in K]: Ref<T[K]>
}

export interface UseEquatorialCoordinateReturn extends RefKeys<EquatorialCoordinate & HorizontalCoordinate> {}

export interface UseEquatorialCoordinateProps extends Partial<UseEquatorialCoordinateReturn> {}

// Set the default observer to Namibia:
const defaultObserver = {
  longitude: -22.95764,
  latitude: 18.49041,
  elevation: 0
}

/**
 *
 * reactive useEquatorialCoordinate()
 *
 * @param options
 * @returns UseEquatorialCoordinateReturn { ra, dec, alt, az }
 */
export const useEquatorialCoordinate = (
  options: UseEquatorialCoordinateOptions
): UseEquatorialCoordinateReturn => {
  const {
    coordinate,
    datetime,
    observer = ref(defaultObserver)
  } = options

  const ra = ref(coordinate.ra)

  const dec = ref(coordinate.dec)

  const alt = ref(Infinity)

  const az = ref(Infinity)

  watchEffect(() => {
    const { alt: altitude, az: azimuth } = convertEquatorialToHorizontal(
      {
        ra: ra.value,
        dec: dec.value
      },
      observer.value,
      datetime.value
    )

    alt.value = altitude
    az.value = azimuth
  })

  return {
    ra,
    dec,
    alt: readonly(alt),
    az: readonly(az)
  }
}