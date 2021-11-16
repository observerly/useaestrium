import { ComputedRef, Ref } from 'vue'

import { HorizontalCoordinate } from '@observerly/celestia'

export interface Canvas {
  width: number,
  height: number
}

export interface ObserverOffset {
  azimuthalOffset: Ref<number>
  altitudinalOffset: Ref<number>
}

export interface Orientation extends ObserverOffset {
  deviceOrientationPermissionState: Ref<string>
  deviceOrientationPermissionGranted: ComputedRef<boolean>
  setDeviceOrientationPermission: () => Promise<boolean>
  toggleUsingDeviceOrientation: () => void
  updateObserverOffset: (offset: HorizontalCoordinate) => void
  usingDeviceOrientation: Ref<boolean>
}