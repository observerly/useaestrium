---
category: Formatters
---

# useDegreeFormat

Reactive degree (in units of degree) formatter to DMS (degrees, minutes and seconds) or HMS (hours, minutes seconds).

## Usage

```js
import { useDegreeFormat } from '@observerly/useaestrium

// Define a star at a known Equatorial Coordinate:
const betelgeuse: EquatorialCoordinate = {
  ra: 88.7929583,
  dec: 7.4070639
}

const { degreeFormat: HMS } = useDegreeFormat(betelgeuse.ra, {
  format: 'hms'
})

const { degreeFormat: DMS } = useDegreeFormat(betelgeuse.dec, {
  format: 'dms'
})

const betelgeuseCoordinateFormatted = computed(() => {
  return `${HMS} ${DMS}`
})
```