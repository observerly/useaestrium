---
category: Integration
---

# useMount

Reactive Planewave API mount client.

## Usage

```ts
import { ref, watch } from 'vue'

import { useMount } from '@observerly/useaestrium

const ra = ref(0)

const dec = ref(0)

const { connect, disconnect, goToEquatorialCoordinate } = useMount({
  url: 'http://127.0.0.1:5000',
  immediate: true
})

// async watch for a change in the ra or dec position to slew the mount to the EquatorialCoordinate:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch([ra, dec], async ([prevRA, prevdec], [newRA, newdec]) => {
  if (prevRA !== newRA || prevdec !== newdec) {
    const status = await goToEquatorialCoordinate({ ra: ra.value, dec: dec.value })
  }
})
```

See the [Type Declarations](#type-declarations) for more options.

### Immediate

Auto-connect (enabled by default) onMounted lifecycle hook.

This will call `connect()` automatically for you and you don't need to call it by yourself.

### Auto-disconnect

Auto-close-connection (enabled by default) onUnmounted lifecycle hook.

This will call `disconnect()` automatically when the component unmounts.