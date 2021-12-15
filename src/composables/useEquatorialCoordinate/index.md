---
category: Sensors
---

# useEquatorialCoordinate

Reactive equatorial coordinate

## Usage

```ts
import { ref } from 'vue'

import { useEquatorialCoordinate } from '@observerly/useaestrium

// Define a star at a known Equatorial Coordinate (e.g., Betelgeuse):
const betelgeuse = {
  ra: 88.7929583,
  dec: 7.4070639
}

// Provide the observer, which is a longitude and latitude value, 
// for example purposes this has been chosen as Manua Kea, Hawaii, US
const observer = ref({
  latitude: 19.820611,
  longitude: -155.468094,
  elevation: 0
})

// We need to specify a date because most calculations are
// differential w.r.t a time component:
const datetime = ref(new Date('2021-05-14T00:00:00.000+00:00'))

const { alt, az } = useEquatorialCoordinate({
  coordinate: betelgeuse,
  observer,
  datetime
})
```

See the [Type Declarations](#type-declarations) for more options.