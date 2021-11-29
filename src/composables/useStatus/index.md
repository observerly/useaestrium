---
category: Integration
---

# useStatus

Reactive Planewave API status client.

## Usage

```ts
import { watch } from 'vue'

import { useStatus } from '@observerly/useaestrium

const { status } = useStatus({ url: 'http://127.0.0.1:5000' })

// watch for a change in the status:
watch(status, () => {
  console.log(status)
})
```

See the [Type Declarations](#type-declarations) for more options.