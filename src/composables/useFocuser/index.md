---
category: Integration
---

# useFocuser

Reactive Planewave API focuser client.

## Usage

```ts
import { ref, watch } from 'vue'

import { useFocuser } from '@observerly/useaestrium

const target = ref('')

const { goToFocuserTarget } = useFocuser({
  url: 'http://127.0.0.1:5000',
  immediate: true
})

// async watch for a change in the target to target the focuser to the preferred target:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch(target, async (prevTarget, newTarget) => {
  if (prevTarget !== newTarget) {
    const status = await goToFocuserTarget({ target: target.value })
  }
})
```

See the [Type Declarations](#type-declarations) for more options.

### Immediate

Auto-connect (enabled by default) onMounted lifecycle hook.

This will call `enable()` automatically for you and you don't need to call it by yourself.

### Auto-disable

Auto-close-connection (enabled by default) onUnmounted lifecycle hook.

This will call `disable()` and `stop()` automatically when the component unmounts.