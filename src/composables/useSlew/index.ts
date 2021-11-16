import {
  onMounted, reactive, Ref, ref, watch
} from 'vue'

import {
  convertHorizontalToEquatorial,
  stereoProjectHorizontalFromCartesian2DCoordinate,
  Cartesian2DCoordinate,
  EquatorialCoordinate,
  GeographicPointCoordinate,
  HorizontalCoordinate
} from '@observerly/celestia'

import {
  Canvas,
  ObserverOffset,
  Orientation
} from '../../types'

import {
  useRafFn
} from '@vueuse/core'

export interface UseSlewOptions {
  canvas: Canvas
  emit: (event: 'equatorial-current-slew-position-change', v: EquatorialCoordinate) => void
  observer: GeographicPointCoordinate & ObserverOffset
  orientation: Orientation
  datetime: Ref<Date>
}

interface SlewPosition extends EquatorialCoordinate, HorizontalCoordinate, Cartesian2DCoordinate {}

/**
 * Reactive useSlew()
 * Returns the reactive slew position of a telescope
 *
 * @param options of type UseSlewOptions
 * @output isSlewing, slew, slewActiveEquatorialCoordinate and resetSlew
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSlew = (options: UseSlewOptions) => {
  const { canvas, emit, observer, datetime } = options

  // Is the telescope slewing:
  const isSlewing = ref<boolean>(false)

  const toggleIsSlewing = (): void => {
    isSlewing.value = !isSlewing.value
  }

  const getSlewPosition = (position: Cartesian2DCoordinate) => {
    const { x, y } = position

    let { az, alt } = stereoProjectHorizontalFromCartesian2DCoordinate(
      {
        x: x,
        y: y
      },
      canvas.width,
      canvas.height
    )

    alt += observer.altitudinalOffset.value

    az += observer.azimuthalOffset.value

    const { ra, dec } = convertHorizontalToEquatorial(
      {
        alt: alt,
        az: az
      },
      observer,
      datetime.value
    )

    return {
      ra: ra,
      dec: dec,
      alt: alt,
      az: az,
      x: canvas.width * 0.5,
      y: canvas.height * 0.5
    }
  }

  const slewCoordinate = reactive<SlewPosition>({
    ra: 0,
    dec: 0,
    alt: 0,
    az: 0,
    x: 0,
    y: 0
  })

  watch(slewCoordinate, () => {
    // Emit that the equatorial current slew position has changed:
    emit('equatorial-current-slew-position-change', slewCoordinate)
  })

  onMounted(() => {
    // This sets the current { ra, dec } coordinate of the astrograph to center point:
    resetSlew()
  })

  const slewExtentX = ref<number>(0)

  const slewDirectionX = ref<number>(0)

  const slewExtentY = ref<number>(0)

  const slewDirectionY = ref<number>(0)

  const precision = 100

  const i = ref(1)

  watch(i, () => {
    if (i.value === precision) {
      pauseSlewSimulation()
      isSlewing.value = false
    }
  })

  const { pause: pauseSlewSimulation, resume: resumeSlewSimulation } = useRafFn(() => {
    if (i.value <= precision) {
      slewCoordinate.x += slewExtentX.value / precision
      slewCoordinate.y += slewExtentY.value / precision

      const { ra, dec, alt, az } = getSlewPosition({
        x: slewCoordinate.x,
        y: slewCoordinate.y
      })

      slewCoordinate.ra = ra
      slewCoordinate.dec = dec
      slewCoordinate.alt = alt
      slewCoordinate.az = az
    }
    i.value++
  })

  const slewSimulated = (to: Cartesian2DCoordinate) => {
    toggleIsSlewing()

    if (slewCoordinate.x !== to.x) {
      slewExtentX.value = to.x - slewCoordinate.x
      // Either a positive or negative +/- 1
      // if -1 then slewing X to the "left"
      // if +1 then slewing X to the "right"
      slewDirectionX.value = Math.sign(slewExtentX.value)
    }

    if (slewCoordinate.y !== to.y) {
      slewExtentY.value = to.y - slewCoordinate.y
      // Either a positive or negative +/- 1
      // if -1 then slewing Y "up"
      // if +1 then slewing Y "down"
      slewDirectionY.value = Math.sign(slewExtentY.value)
    }

    i.value = 1

    resumeSlewSimulation()
  }

  const resetSlew = (): void => {
    const { ra, dec, alt, az, x, y } = getSlewPosition({
      x: canvas.width * 0.5,
      y: canvas.height * 0.5
    })

    slewCoordinate.ra = ra
    slewCoordinate.dec = dec
    slewCoordinate.alt = alt
    slewCoordinate.az = az
    slewCoordinate.x = x
    slewCoordinate.y = y
  }

  // Setup some form of long-polling of the Mount "Slew" Status:

  return {
    isSlewing,
    slewSimulated,
    slewCoordinate,
    resetSlew
  }
}

export type UseSlewToPosition = ReturnType<typeof useSlew>