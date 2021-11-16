---
category: Sensors
---

# useSlew

Reactive [enumerateDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices) listing avaliable input/output devices.

## Usage

```js
import { useSlew } from '@observerly/useaestrium'

const {
  devices,
  videoInputs: cameras,
  audioInputs: microphones,
  audioOutputs: speakers,
} = useDevicesList()
```